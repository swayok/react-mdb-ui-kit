import {
    type ChangeEvent,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import {
    FileAPI,
    type FileAPISelectedFileInfo,
} from '../../helpers/file_api/FileAPI'
import {
    convertHeicFileToBlob,
    isHeicOrHeifMime,
} from '../../helpers/file_api/FileApiImageManipulation'
import {useDragDropTouchPolyfill} from '../../helpers/useDragDropTouchPolyfill'
import {useEventCallback} from '../../helpers/useEventCallback'
import {ToastService} from '../../services/ToastService'
import type {
    AnyObject,
    MinMax,
} from '../../types'
import {ErrorBoundary} from '../ErrorBoundary'
import {ReorderableList} from '../ReorderableList/ReorderableList'
import {
    FilePickerContext,
    filePickerDefaultPreviews,
    filePickerDefaultTranslations,
    filePickerFallbackPreview,
} from './FilePickerContext'
import {FilePickerHelpers} from './FilePickerHelpers'
import type {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFileValidationResult,
    FilePickerInputProps,
} from './FilePickerTypes'

// Добавляется к максимальной позиции при прикреплении нового файла.
const positionDelta: number = 1

/**
 * Компонент для выбора файла с диска для загрузки на сервер.
 * Компонент должен оборачивать все компоненты, которые участвуют в выборе файлов
 * и отображении списка выбранных файлов т.к. создает контекст с состоянием и действиями.
 * Это упрощенная версия компонента FilePicker, в которой реализован конкретный вариант
 * управления списком файлов без возможности влиять на процесс.
 * Фактически - список файлов передается через свойство value, а изменения возвращаются
 * через вызов onChange.
 */
export function FilePickerInput(props: FilePickerInputProps) {
    const {
        allowImages = true,
        allowFiles = true,
        maxFiles = null,
        maxFileSizeKb = 8192,
        disabled = false,
        maxImageSize = 1920,
        convertImagesToJpeg = false,
        convertHeifTo = 'jpeg',
        imagesCompression = 0.92,
        translations = filePickerDefaultTranslations,
        dropInvalidFiles: propsDropInvalidFiles,
        allowedMimeTypes,
        useUidAsFileName,
        value = [],
        onChange,
        onAttachmentError,
        logException,
        children,
    } = props

    const dropInvalidFiles: boolean = propsDropInvalidFiles ?? (maxFiles === 1)

    // Поле ввода, которое используется для обработки выбора файла.
    const inputRef = useRef<HTMLInputElement>(null)

    // Полифил для мобильных устройств для имитации drag-and-drop событий из touch событий.
    useDragDropTouchPolyfill()

    // Нормализация списка файлов.
    const files: FilePickerFileInfo[] = useMemo(
        () => FilePickerHelpers.normalizeValueFromDB(value),
        [value]
    )

    // Вызов onChange при изменении списка файлов.
    // Это требуется для нормализации внешнего состояния.
    useEffect(() => {
        if (JSON.stringify(files) !== JSON.stringify(value)) {
            onChange(files)
        }
    }, [files])

    // Вычислить позицию для нового прикрепленного файла.
    const getNextFilePosition = useEventCallback((): number => {
        const fileWithMaxPosition: FilePickerFileInfo | null = files.reduce(
            (carry: FilePickerFileInfo | null, file: FilePickerFileInfo): FilePickerFileInfo => {
                if (!carry) {
                    return file
                }
                return (carry.position < file.position) ? file : carry
            },
            null
        )
        return fileWithMaxPosition ? fileWithMaxPosition.position + positionDelta : 0
    })

    // Посчитать количество прикрепленных, но не удаленных файлов.
    const notDeletedFilesCount: number = useMemo(
        () => files.filter(file => !file.isDeleted).length,
        [files]
    )

    // Можно ли прикрепить больше файлов?
    const canAttachMoreFiles = useEventCallback((
        pendingFilesToBeAdded: number = 0
    ): boolean => {
        if (maxFiles === null || maxFiles <= 1) {
            return true
        }
        return (notDeletedFilesCount + pendingFilesToBeAdded) < maxFiles
    })

    // Получить разрешенные типы файлов.
    const allowedFileTypes: AnyObject<FilePickerContextMimeTypeInfo> = useMemo(
        (): FilePickerContextProps['previews'] => {
            if (allowedMimeTypes) {
                const ret: FilePickerContextProps['previews'] = {}
                for (const mimeType of allowedMimeTypes) {
                    if (typeof mimeType === 'string') {
                        if (mimeType in filePickerDefaultPreviews) {
                            ret[mimeType] = filePickerDefaultPreviews[mimeType]
                        }
                    } else {
                        // Конфиг отображения предпросмотров.
                        ret[mimeType.mime] = mimeType
                    }
                }
                return ret
            }
            if (allowFiles && allowImages) {
                return filePickerDefaultPreviews
            }
            const ret: FilePickerContextProps['previews'] = {}
            for (const mimeType in filePickerDefaultPreviews) {
                const preview: FilePickerContextMimeTypeInfo = filePickerDefaultPreviews[mimeType]
                if (allowFiles && preview.type === 'file') {
                    ret[mimeType] = preview
                } else if (allowImages && preview.type === 'image') {
                    ret[mimeType] = preview
                }
            }
            return ret
        },
        [allowedMimeTypes, allowFiles, allowImages]
    )

    // Сжатие картинки и обновление состояния через onChange() после сжатия.
    const compressImageFileAndUpdateState = useEventCallback((
        originalFile: FileAPISelectedFileInfo,
        processedFile: FilePickerFileInfo
    ): void => {
        FilePickerHelpers.compressFile(
            processedFile,
            maxImageSize,
            convertImagesToJpeg,
            imagesCompression
        )
            .then(async compressedFile => {
                // 1. Получаем имя файла.
                const normalizedFileName = FilePickerHelpers.getNormalizedFileName(
                    processedFile,
                    useUidAsFileName,
                    convertImagesToJpeg
                )
                // 2. Заменяем оригинальный файл измененным, с нормализованным названием.
                const compressedFileInfo = Object.assign(
                    new File([compressedFile], normalizedFileName, {
                        lastModified: processedFile.file.lastModified,
                        type: compressedFile.type,
                    }),
                    {
                        isImage: true,
                        isProcessing: false,
                    }
                )
                // 3. Получаем дополнительные данные о картинке (размеры, exif, превью).
                const imageInfo = await FileAPI.getImageInfo(compressedFileInfo, true)
                // 4. Обновляем файл в списке, если требуется или дополняем данные в processedFile.
                const index = files.findIndex(f => f.UID === processedFile.UID)
                if (index === -1) {
                    // Данные еще не добавлены в value.
                    processedFile.file = compressedFileInfo
                    processedFile.info = imageInfo
                    return
                }
                // Данные уже добавлены в value.
                const updates = [...files]
                updates[index] = {
                    ...updates[index],
                    file: compressedFileInfo,
                    info: imageInfo,
                }
                onChange(updates)
            })
            .catch(error => {
                logException?.(error, processedFile)
                const errorMessage = translations.error.failed_to_resize_image
                ToastService.error(originalFile.name + ':' + errorMessage)
                // Обновляем файл в списке.
                const index = files.findIndex(f => f.UID === processedFile.UID)
                if (index === -1) {
                    // Данные еще не добавлены в value.
                    processedFile.error = errorMessage
                    return
                } else {
                    // Данные уже добавлены в value.
                    const updates = [...files]
                    updates[index] = {
                        ...updates[index],
                        error: errorMessage,
                    }
                    onChange(updates)
                }
                console.error('[FilePickerInput] compressFile error: ', {
                    file: originalFile,
                    error,
                })
                throw error
            })
    })

    // Конвертировать HEIC/HEIF файл в JPEG или PNG.
    const convertHeicFile = useEventCallback(async (
        originalFile: FileAPISelectedFileInfo,
        processedFile: FilePickerFileInfo
    ): Promise<boolean> => {
        const targetExtension: 'png' | 'jpg' = convertHeifTo === 'png' && !convertImagesToJpeg
            ? 'png'
            : 'jpg'
        const targetMimeType: 'image/jpeg' | 'image/png' = targetExtension === 'png'
            ? 'image/png'
            : 'image/jpeg'
        const convertedBlob: Blob | null = await convertHeicFileToBlob(
            processedFile.file,
            targetMimeType,
            imagesCompression
        )
        if (!convertedBlob) {
            processedFile.error = translations.error.mime_type_forbidden(
                originalFile.extension ?? targetExtension
            )
            ToastService.error(processedFile.error, 5000)
            return false
        }
        const newExtension: string = convertHeifTo === 'png' ? '.png' : '.jpg'
        const convertedFileName: string = processedFile.file.name.replace(
            /\.[a-zA-Z0-9]{1,6}$/,
            newExtension
        )
        processedFile.file = Object.assign(
            new File(
                [convertedBlob],
                convertedFileName,
                {
                    lastModified: processedFile.file.lastModified,
                    type: targetMimeType,
                }
            ),
            {
                isProcessing: false,
                isImage: true,
                mimeType: targetMimeType,
                extension: convertHeifTo === 'png' ? 'png' : 'jpg',
            }
        )
        return true
    })

    // Обработка прикрепленной картинки.
    const processNewImage = useEventCallback(async (
        originalFile: FileAPISelectedFileInfo,
        processedFile: FilePickerFileInfo,
        mimeTypeInfo: FilePickerContextMimeTypeInfo
    ): Promise<FilePickerFileInfo> => {
        // Файл - валидная картинка.
        // 1. Если файл в формате HEIC/HEIF - конвертируем его в JPEG или PNG
        // с помощью пакета heic-to (браузеры не умеют работать с HEIC/HEIF нативно).
        if (isHeicOrHeifMime(mimeTypeInfo.mime)) {
            processedFile.file.isProcessing = true

            convertHeicFile(originalFile, processedFile)
                .then(success => {
                    if (!success) {
                        processedFile.error = translations.error.mime_type_forbidden(
                            originalFile.extension ?? mimeTypeInfo.mime
                        )
                        ToastService.error(processedFile.error, 5000)
                        return
                    }
                    compressImageFileAndUpdateState(originalFile, processedFile)
                })
                .catch(error => {
                    logException?.(error, processedFile)
                    const errorMessage = translations.error.failed_to_resize_image
                    ToastService.error(originalFile.name + ':' + errorMessage)
                    processedFile.error = errorMessage
                })

            return processedFile
        }
        // 2. Сжимаем и конвертируем в JPEG, если необходимо.
        // Также обновляет файл через onChange(), если необходимо.
        compressImageFileAndUpdateState(originalFile, processedFile)

        // 3. Получаем дополнительные данные о картинке (размеры, exif, превью).
        processedFile.info = await FileAPI.getImageInfo(processedFile.file, true)
        return processedFile
    })

    // Обработка прикрепленного файла (валидация, уменьшение).
    const processNewFile = useEventCallback(async (
        file: FileAPISelectedFileInfo,
        position: number,
        pendingFilesToBeAdded: number
    ): Promise<FilePickerFileInfo> => {
        if (!canAttachMoreFiles(pendingFilesToBeAdded)) {
            // Контроль количества прикрепленных файлов.
            ToastService.error(
                translations.error.too_many_files(maxFiles!)
            )
            throw new Error('too_many_files')
        }
        const fileUID: string = FilePickerHelpers.makeFileID(file)
        // Проверка на прикрепление уже прикрепленного файла.
        for (const item of files) {
            if (item.UID === fileUID) {
                ToastService.error(
                    translations.error.already_attached(file.name)
                )
                throw new Error('already_attached')
            }
        }
        let processedFile: FilePickerFileInfo | null = null
        try {
            const validationResult: FilePickerFileValidationResult = FilePickerHelpers.validateFileTypeAndSize(
                file,
                allowedFileTypes,
                translations,
                maxFileSizeKb
            )
            processedFile = {
                UID: fileUID,
                file,
                error: validationResult.error,
                info: null,
                position,
                isNew: true,
            }
            if (validationResult.error) {
                ToastService.error(
                    translations.error.invalid_file(file.name, validationResult.error),
                    6000
                )
                return processedFile
            }
            if (file.isImage) {
                return await processNewImage(
                    file,
                    processedFile,
                    validationResult.mimeTypeInfo!
                )
            }
            return processedFile
        } catch (e) {
            logException?.(e, processedFile)
            console.error('[FilePickerInput] processNewFile error: ', {
                file,
                error: e,
            })
            throw e
        }
    })

    // Обработка одного или нескольких выбранных файлов.
    const onNewFilesSelected = useEventCallback(async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (disabled) {
            return Promise.resolve()
        }
        const selectedFiles: FileAPISelectedFileInfo[] = FileAPI.getFiles(event.target, true)
        const newFilesList: FilePickerFileInfo[] = []
        let newMaxPosition: number = getNextFilePosition()
        for (let i = 0; i < selectedFiles.length; i++) {
            try {
                const processedFile: FilePickerFileInfo = await processNewFile(
                    selectedFiles[i],
                    newMaxPosition,
                    newFilesList.length
                )
                newMaxPosition++
                if (FilePickerHelpers.isValidFile(processedFile) || !dropInvalidFiles) {
                    newFilesList.push(processedFile)
                } else if (processedFile.error) {
                    onAttachmentError?.(processedFile.error, processedFile)
                }
            } catch (e: unknown) {
                if (e !== null) {
                    // Except for a file is already added or there no more places left.
                    console.error('[FilePicker] Failed to process new file', {
                        index: i,
                        file: selectedFiles[i],
                        error: e,
                    })
                }
            }
        }
        if (newFilesList.length > 0) {
            if (maxFiles === 1) {
                // Нужно пометить файл из БД удалённым.
                const filesToDelete = files.filter(file => !file.isNew)
                for (let i = 0; i < filesToDelete.length; i++) {
                    if (!filesToDelete[i].isDeleted) {
                        filesToDelete[i] = {
                            ...filesToDelete[i],
                            isDeleted: true,
                        }
                    }
                }
                onChange(filesToDelete.concat(newFilesList))
            } else {
                onChange(files.concat(newFilesList))
            }
        }
    })

    // Обработка нажатия на кнопку удаления файла.
    const onFileDelete = useEventCallback((
        file: FilePickerFileInfo
    ) => {
        for (let i = 0; i < files.length; i++) {
            if (file.UID === files[i].UID) {
                const updates: FilePickerFileInfo[] = files.slice()
                if (file.isNew) {
                    // Новый файл можно удалять безвозвратно.
                    updates.splice(i, 1)
                } else {
                    // Файл из БД: Нужно пометить как удаленный.
                    updates[i] = {
                        ...updates[i],
                        isDeleted: true,
                    }
                }
                onChange(updates)
                return
            }
        }
    })

    // Обработка нажатия на кнопку восстановления файла.
    const onExistingFileRestore = useEventCallback((
        file: FilePickerFileInfo
    ) => {
        if (maxFiles !== 1 && !canAttachMoreFiles(1)) {
            ToastService.error(translations.error.too_many_files(maxFiles!))
            return
        }
        for (let i = 0; i < files.length; i++) {
            if (file.UID === files[i].UID) {
                if (files[i].isNew) {
                    return
                }
                const updatedFile = {
                    ...files[i],
                    isDeleted: false,
                }
                if (maxFiles === 1) {
                    // Режим одного файла.
                    // Заменяем весь список файлов на восстановленный.
                    onChange([updatedFile])
                } else {
                    // Разрешено прикрепление нескольких файлов.
                    const updates: FilePickerFileInfo[] = files.slice()
                    updates[i] = updatedFile
                    onChange(updates)
                }
                return
            }
        }
    })

    // Окончание перетаскивания файлов.
    const onDragFinish = useEventCallback((
        _draggedElementPosition: number,
        draggedElementPayload: FilePickerFileInfo,
        _droppedOnElementPosition: number,
        droppedOnElementPayload: FilePickerFileInfo
    ): void => {
        const newPosition: number = droppedOnElementPayload.position
        // Задаем позицию перетаскиваемого файла = позиции файла, на который перетащили.
        const updates: FilePickerFileInfo[] = []
        // Смещаем все файлы с позицией >= той, что у файла, на который перетащили другой файл на 1.
        for (const file of files) {
            // console.log(files[i].file.name, files[i].position)
            if (file.UID === draggedElementPayload.UID) {
                updates.push({
                    ...(file),
                    position: newPosition,
                })
            } else if (file.position >= newPosition) {
                updates.push({
                    ...(file),
                    position: file.position + 1,
                })
            } else {
                updates.push(file)
            }
        }
        draggedElementPayload.position = newPosition
        onChange(updates)
    })

    // Можно ли менять позиции файлов?
    const reorderable: boolean = (
        !!props.reorderable
        && (props?.maxFiles ?? 2) > 1
    )

    // Данные контекста.
    const context: FilePickerContextProps = {
        pickFile: useEventCallback(() => {
            if (!disabled) {
                inputRef.current?.click()
            }
        }),
        maxFiles,
        previews: allowedFileTypes,
        fallbackPreview: filePickerFallbackPreview,
        existingFiles: files.filter(file => !file.isNew),
        onExistingFileDelete: onFileDelete,
        onExistingFileRestore,
        files: files.filter(file => file.isNew),
        reorderable,
        isDisabled: disabled,
        onFileDelete,
        canAttachMoreFiles,
        translations,
        getNextFilePosition,
        isUploading: false,
        startUploading: useEventCallback(
            () => Promise.reject(new Error('action_not_allowed'))
        ),
    }

    // Получить минимальное и максимальное значения позиций файлов.
    const minMaxPositions: MinMax = FilePickerHelpers.getMinMaxFilePositions(files, [])

    return (
        <FilePickerContext.Provider
            value={context}
        >
            <ErrorBoundary>
                <input
                    type="file"
                    multiple={!maxFiles || maxFiles > 1}
                    ref={inputRef}
                    style={{
                        width: 0,
                        height: 0,
                        padding: 0,
                        margin: 0,
                        position: 'absolute',
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                        void onNewFilesSelected(event)
                    }}
                    disabled={disabled}
                />

                <ReorderableList<FilePickerFileInfo>
                    itemsCount={notDeletedFilesCount}
                    minPosition={minMaxPositions.min}
                    maxPosition={minMaxPositions.max}
                    droppedItemPlacement="before"
                    disabled={!reorderable}
                    onDragFinish={onDragFinish}
                >
                    {children}
                </ReorderableList>
            </ErrorBoundary>
        </FilePickerContext.Provider>
    )
}
