import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef} from 'react'
import FilePickerContext, {FilePickerContextPropsDefaults, filePickerDefaultTranslations} from './FilePickerContext'
import FileAPI, {FileAPISelectedFileInfo} from '../../helpers/FileAPI/FileAPI'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    SimplifiedFilePickerProps,
} from '../../types/FilePicker'
import ErrorBoundary from '../ErrorBoundary'
import ToastService from '../../services/ToastService'
import {AnyObject, MinMax} from '../../types/Common'
import ReorderableList from '../ReorderableList/ReorderableList'
import FilePickerHelpers from './FilePickerHelpers'

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
export default function SimplifiedFilePicker(props: SimplifiedFilePickerProps) {

    const {
        allowImages = true,
        allowFiles = true,
        maxFiles = FilePickerContextPropsDefaults.maxFiles,
        maxFileSizeKb = 8 * 1024,
        disabled = false,
        maxImageSize = 1920,
        convertImagesToJpeg = false,
        imagesCompression = 0.92,
        translations = filePickerDefaultTranslations,
        dropInvalidFiles = false,
        allowedMimeTypes,
        useUidAsFileName,
        value = [],
        onChange,
        children,
    } = props

    // Поле ввода, которое используется для обработки выбора файла.
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Полифил для мобильных устройств для имитации drag-and-drop событий из touch событий.
        void import('drag-drop-touch')
    }, [])

    // Нормализация списка файлов.
    const files: FilePickerFileInfo[] = useMemo(
        () => FilePickerHelpers.normalizeValueFromDB(value),
        [value]
    )

    // Вычислить позицию для нового прикрепленного файла.
    const getNextFilePosition = useCallback((): number => {
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
    }, [files])

    // Посчитать количество прикрепленных, но не удаленных файлов.
    const notDeletedFilesCount: number = useMemo(
        () => files.filter(file => !file.isDeleted).length,
        [files]
    )

    // Можно ли прикрепить больше файлов?
    const canAttachMoreFiles = useCallback(
        (pendingFilesToBeAdded: number = 0): boolean => {
            if (maxFiles === null || maxFiles <= 1) {
                return true
            }
            return (notDeletedFilesCount + pendingFilesToBeAdded) < maxFiles
        },
        [maxFiles, notDeletedFilesCount]
    )

    // Получить разрешенные типы файлов.
    const allowedFileTypes: AnyObject<FilePickerContextMimeTypeInfo> = useMemo(
        (): FilePickerContextProps['previews'] => {
            if (allowedMimeTypes) {
                const ret: FilePickerContextProps['previews'] = {}
                for (let i = 0; i < allowedMimeTypes.length; i++) {
                    const mimeType: string = allowedMimeTypes[i]
                    if (mimeType in FilePickerContextPropsDefaults.previews) {
                        ret[mimeType] = FilePickerContextPropsDefaults.previews[mimeType]
                    }
                }
                return ret
            }
            if (allowFiles && allowImages) {
                return FilePickerContextPropsDefaults.previews
            }
            const ret: FilePickerContextProps['previews'] = {}
            for (const mimeType in FilePickerContextPropsDefaults.previews) {
                const preview: FilePickerContextMimeTypeInfo = FilePickerContextPropsDefaults.previews[mimeType]
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

    // Обработка прикрепленного файла (валидация, уменьшение).
    const processNewFile = async (
        file: FileAPISelectedFileInfo,
        position: number,
        pendingFilesToBeAdded: number
    ): Promise<FilePickerFileInfo> => {
        if (!canAttachMoreFiles(pendingFilesToBeAdded)) {
            // Контроль количества прикрепленных файлов.
            ToastService.error(
                translations.error.too_many_files(maxFiles as number)
            )
            throw new Error('too_many_files')
        }
        const fileUID: string = FilePickerHelpers.makeFileID(file)
        // Проверка на прикрепление уже прикрепленного файла.
        for (let i = 0; i < files.length; i++) {
            if (files[i].UID === fileUID) {
                ToastService.error(
                    translations.error.already_attached(file.name)
                )
                throw new Error('already_attached')
            }
        }
        try {
            const mimeTypeInfo: string | FilePickerContextMimeTypeInfo = FilePickerHelpers.validateFileTypeAndSize(
                file,
                allowedFileTypes,
                translations,
                maxFileSizeKb
            )
            const isInvalidFileType: boolean = typeof mimeTypeInfo === 'string'
            if (isInvalidFileType) {
                ToastService.error(
                    translations.error.invalid_file(file.name, mimeTypeInfo as string),
                    6000
                )
            }
            const processedFile: FilePickerFileInfo = {
                UID: fileUID,
                file,
                error: isInvalidFileType ? mimeTypeInfo as string : null,
                info: null,
                position,
                isNew: true,
            }
            if (file.isImage && !isInvalidFileType) {
                // Файл - валидная картинка.
                // 1. Получаем имя файла.
                const normalizedFileName = FilePickerHelpers.getNormalizedFileName(
                    processedFile,
                    useUidAsFileName,
                    convertImagesToJpeg
                )
                // 2. Сжимаем и конвертируем в JPEG, если необходимо.
                Object.assign(
                    processedFile.file,
                    // Получаем обработанный Blob.
                    await FilePickerHelpers.compressFile(
                        processedFile,
                        maxImageSize,
                        convertImagesToJpeg,
                        imagesCompression
                    ),
                    // Заменяем имя файла.
                    {
                        name: normalizedFileName,
                    }
                )
                // 3. Получаем дополнительные данные о картинке (размеры, exif, превью).
                processedFile.info = await FileAPI.getImageInfo(processedFile.file, true)
            }
            return processedFile
        } catch (e) {
            // todo: Раскомментировать если будем использовать Sentry
            // if (Config.isProduction) {
            //     Sentry.captureException(e, {
            //         extra: {
            //             file,
            //         },
            //     })
            // }
            console.error('[FilePicker] processNewFile error: ', {
                file,
                error: e,
            })
            throw e
        }
    }

    // Обработка одного или нескольких выбранных файлов.
    const onNewFilesSelected = async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (disabled) {
            return Promise.resolve()
        }
        const selectedFiles: Array<FileAPISelectedFileInfo> = FileAPI.getFiles(event.target, true)
        const newFilesList: Array<FilePickerFileInfo> = []
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
                }
            } catch (e: unknown) {
                if (e !== null) { //< except for a file is already added or there no more places left
                    console.error('[FilePicker] Failed to process new file', {
                        index: i,
                        file: selectedFiles[i],
                        error: e,
                    })
                }
            }
        }
        if (newFilesList.length > 0) {
            onChange(files.concat(newFilesList))
        }
    }

    // Обработка нажатия на кнопку удаления файла.
    const onFileDelete = useCallback(
        (file: FilePickerFileInfo) => {
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
                }
            }
        },
        [onChange, files]
    )

    // Окончание перетаскивания файлов.
    const onDragFinish = (
        _draggedElementPosition: number,
        draggedElementPayload: FilePickerFileInfo,
        _droppedOnElementPosition: number,
        droppedOnElementPayload: FilePickerFileInfo
    ): void => {
        const newPosition: number = droppedOnElementPayload.position
        // Задаем позицию перетаскиваемого файла = позиции файла, на который перетащили.
        const updates: FilePickerFileInfo[] = files.slice()
        // Смещаем все файлы с позицией >= той, что у файла, на который перетащили другой файл на 1.
        for (let i = 0; i < updates.length; i++) {
            // console.log(updates[i].file.name, updates[i].position)
            if (updates[i].position >= newPosition) {
                updates[i].position++
            }
        }
        draggedElementPayload.position = newPosition
        onChange(updates)
    }

    // Можно ли менять позиции файлов?
    const reorderable: boolean = (
        !!props.reorderable
        && (props?.maxFiles || 2) > 1
    )

    // Данные контекста.
    const context: FilePickerContextProps = Object.assign({}, FilePickerContextPropsDefaults, {
        pickFile: useCallback(
            () => {
                if (!disabled) {
                    inputRef.current?.click()
                }
            },
            [disabled, inputRef]
        ),
        maxFiles,
        previews: allowedFileTypes,
        existingFiles: files.filter(file => !file.isNew),
        onExistingFileDelete: onFileDelete,
        files: files.filter(file => file.isNew),
        reorderable,
        isDisabled: disabled,
        onFileDelete,
        canAttachMoreFiles,
        translations,
        getNextFilePosition,
    })

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
