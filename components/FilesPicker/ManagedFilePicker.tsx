import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import FilePickerContext, {FilePickerContextPropsDefaults, filePickerDefaultTranslations} from './FilePickerContext'
import {FileAPI, FileAPIImageFileInfo, FileAPISelectedFileInfo} from '../../helpers/FileAPI/FileAPI'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    ManagedFilePickerProps,
    FilePickerUploadInfo,
    FilePickerFileInfo,
} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
import {ErrorBoundary} from '../ErrorBoundary'
import {ToastService} from '../../services/ToastService'
import {AnyObject, MinMax} from 'swayok-react-mdb-ui-kit/types/Common'
import ReorderableList from '../ReorderableList/ReorderableList'
import {withStable} from '../../helpers/withStable'
import FilePickerHelpers from './FilePickerHelpers'

// Добавляется к максимальной позиции при прикреплении нового файла.
const positionDelta: number = 1

// Компонент для выбора файла с диска для загрузки на сервер.
// Компонент должен оборачивать все компоненты, которые участвуют в выборе файлов
// и отображении списка выбранных файлов т.к. создает контекст с состоянием и действиями.
function ManagedFilePicker(props: ManagedFilePickerProps<FilePickerFileInfo>) {

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
        existingFiles = [],
        allowedMimeTypes,
        onFileAttached,
        onFileRemoved,
        onFileRestored,
        onReorder,
        onExistingFileDelete,
        apiRef,
        children,
    } = props

    // Поле ввода, которое используется для обработки выбора файла.
    const inputRef = useRef<HTMLInputElement>(null)

    // Прикрепленные файлы.
    const [
        files,
        setFiles,
    ] = useState<FilePickerFileInfo[]>([])

    useEffect(() => {
        // Полифил для мобильных устройств для имитации drag-and-drop событий из touch событий.
        void import('drag-drop-touch')
    }, [])

    // Вычислить позицию для нового прикрепленного файла.
    const getNextFilePosition = useCallback((): number => {
        const fileWithMaxPosition: FilePickerFileInfo | null = (existingFiles || [])
            .concat(files)
            .reduce((carry: FilePickerFileInfo | null, file: FilePickerFileInfo): FilePickerFileInfo => {
                if (!carry) {
                    return file
                }
                return (carry.position < file.position) ? file : carry
            }, null)
        return fileWithMaxPosition ? fileWithMaxPosition.position + positionDelta : 0
    }, [existingFiles, files])

    // Посчитать количество прикрепленных, но не удаленных файлов.
    const notDeletedFilesCount: number = useMemo(
        () => (existingFiles || [])
            .concat(files)
            .filter(file => !file.isDeleted)
            .length,
        [files, existingFiles]
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
                for (const mimeType of allowedMimeTypes) {
                    if (typeof mimeType === 'string') {
                        if (mimeType in FilePickerContextPropsDefaults.previews) {
                            ret[mimeType] = FilePickerContextPropsDefaults.previews[mimeType]
                        }
                    } else {
                        // Конфиг отображения предпросмотров.
                        ret[mimeType.mime] = mimeType
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
    const processNewFile = (
        file: FileAPISelectedFileInfo,
        position: number,
        pendingFilesToBeAdded: number
    ): Promise<FilePickerFileInfo> => {
        if (!canAttachMoreFiles(pendingFilesToBeAdded)) {
            // Контроль количества прикрепленных файлов.
            ToastService.error(
                translations.error.too_many_files(maxFiles!)
            )
            return Promise.reject(new Error('too_many_files'))
        }
        const fileUID: string = FilePickerHelpers.makeFileID(file)
        // Проверка на прикрепление уже прикрепленного файла.
        for (const item of files) {
            if (item.UID === fileUID) {
                ToastService.error(
                    translations.error.already_attached(file.name)
                )
                return Promise.reject(new Error('already_attached'))
            }
        }
        return new Promise<FilePickerFileInfo>((resolve, reject) => {
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
                    isDeleted: false,
                    isNew: true,
                }
                if (isInvalidFileType || !file.isImage) {
                    // Файл должен быть отображен либо с ошибкой, либо без превью (если не картинка).
                    resolve(processedFile)
                } else {
                    FileAPI
                        .getImageInfo(file, true)
                        .then((info: FileAPIImageFileInfo | null) => {
                            processedFile.info = info
                            // console.log('[FilePicker] image info', info);
                            resolve(processedFile)
                        })
                        .catch(reject)
                }
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
                reject(e as Error)
            }
        })
    }

    // Обработка одного или нескольких выбранных файлов.
    const onNewFilesSelected = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (disabled) {
            return Promise.resolve()
        }
        const selectedFiles: FileAPISelectedFileInfo[] = FileAPI.getFiles(event.target, true)
        // console.log('[FilePicker] new files', selectedFiles);
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
                }
                onFileAttached?.(
                    processedFile,
                    FilePickerHelpers.isValidFile(processedFile)
                )
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
        setFiles(files => maxFiles === 1 ? newFilesList : files.concat(newFilesList))
    }

    // Обработка нажатия на кнопку удаления файла.
    const onFileDelete = useCallback(
        (file: FilePickerFileInfo, delay?: number) => {
            let removedFile: FilePickerFileInfo | null = null
            setFiles(files => {
                for (let i = 0; i < files.length; i++) {
                    if (file.UID === files[i].UID) {
                        const updates: FilePickerFileInfo[] = files.slice()
                        removedFile = updates[i]
                        if (delay) {
                            // Нужно дождаться окончания анимации удаления.
                            updates[i] = {
                                ...updates[i],
                                isDeleted: true,
                            }
                        } else {
                            updates.splice(i, 1)
                        }
                        return updates
                    }
                }
                return files
            })
            if (delay) {
                // Удалить файл из состояния после окончания анимации удаления.
                setTimeout(() => {
                    setFiles(files => {
                        for (let i = 0; i < files.length; i++) {
                            if (file.UID === files[i].UID) {
                                const updates: FilePickerFileInfo[] = files.slice()
                                updates.splice(i, 1)
                                return updates
                            }
                        }
                        return files
                    })
                    if (removedFile) {
                        onFileRemoved?.(removedFile)
                    }
                }, delay)
            } else if (removedFile) {
                onFileRemoved?.(removedFile)
            }
        },
        [onFileRemoved]
    )

    // Обработка нажатия на кнопку восстановления файла.
    const onExistingFileRestore = useCallback(
        (file: FilePickerFileInfo) => {
            if (maxFiles !== 1 && !canAttachMoreFiles(1)) {
                ToastService.error(translations.error.too_many_files(maxFiles!))
                return
            }
            let restoredFile: FilePickerFileInfo | null = null
            setFiles(files => {
                for (let i = 0; i < files.length; i++) {
                    if (file.UID === files[i].UID) {
                        if (files[i].isNew) {
                            return files
                        }
                        const updatedFile = {
                            ...files[i],
                            isDeleted: false,
                        }
                        if (maxFiles === 1) {
                            // Режим одного файла.
                            // Заменяем весь список файлов на восстановленный.
                            return [updatedFile]
                        }
                        // Разрешено прикрепление нескольких файлов.
                        const updates: FilePickerFileInfo[] = files.slice()
                        updates[i] = updatedFile
                        restoredFile = updates[i]
                        return updates
                    }
                }
                return files
            })
            if (restoredFile) {
                onFileRestored?.(restoredFile)
            }
        },
        [onFileRestored, files, canAttachMoreFiles, maxFiles]
    )

    // Обновление публичного API.
    useEffect(() => {
        if (apiRef) {
            const getValidFiles = () => {
                const ret = []
                for (const item of files) {
                    if (FilePickerHelpers.isValidFile(item)) {
                        ret.push(item)
                    }
                }
                // console.log('[FilePicker] valid files', ret);
                return ret
            }
            apiRef.current = {
                getValidFiles,
                getFilesForUpload(
                    detachInvalidFiles: boolean,
                    rejectIfNotAllFilesAreValid: boolean = false,
                    useUidAsFileName: boolean = false
                ): Promise<FilePickerUploadInfo[]> {
                    return new Promise<FilePickerUploadInfo[]>((resolve, reject) => {
                        const validFiles: FilePickerFileInfo[] = getValidFiles()
                        if (detachInvalidFiles) {
                            setFiles(validFiles)
                        } else if (rejectIfNotAllFilesAreValid && validFiles.length !== files.length) {
                            reject(new Error('contains_invalid_file'))
                            return
                        }
                        const promises = []
                        for (const item of validFiles) {
                            promises.push(FilePickerHelpers.getFileInfoForUpload(
                                item,
                                useUidAsFileName,
                                maxImageSize,
                                convertImagesToJpeg,
                                imagesCompression
                            ))
                        }
                        Promise.all(promises)
                            .then((files: FilePickerUploadInfo[]) => {
                                resolve(files)
                            })
                            .catch((error: Error) => {
                                reject(error)
                            })
                    })
                },
                reset(): void {
                    setFiles([])
                },
            }
        }
        return () => {
            if (apiRef) {
                apiRef.current = null
            }
        }
    }, [apiRef, files, maxImageSize, convertImagesToJpeg, imagesCompression])

    // Окончание перетаскивания файлов.
    const onDragFinish = (
        _draggedElementPosition: number,
        draggedElementPayload: FilePickerFileInfo,
        _droppedOnElementPosition: number,
        droppedOnElementPayload: FilePickerFileInfo
    ): void => {
        const newPosition: number = droppedOnElementPayload.position
        // Задаем позицию перетаскиваемого файла = позиции файла, на который перетащили.
        const stateUpdates: FilePickerFileInfo[] = files.slice()
        const existingFilesUpdates: FilePickerFileInfo[] = (existingFiles || []).slice()
        const allFiles: FilePickerFileInfo[] = existingFilesUpdates.concat(stateUpdates)
        // Смещаем все файлы с позицией >= той, что у файла, на который перетащили другой файл на 1.
        for (const item of allFiles) {
            if (item.position >= newPosition) {
                item.position++
            }
        }
        draggedElementPayload.position = newPosition
        setFiles(stateUpdates)
        onReorder?.(existingFilesUpdates, stateUpdates)
    }

    // Можно ли менять позиции файлов?
    const reorderable: boolean = (
        !!props.reorderable
        && (props?.maxFiles ?? 2) > 1
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
        existingFiles,
        onExistingFileDelete,
        onExistingFileRestore,
        files,
        reorderable,
        isDisabled: disabled,
        onFileDelete,
        canAttachMoreFiles,
        translations,
        getNextFilePosition,
    })

    // Получить минимальное и максимальное значения позиций файлов.
    const minMaxPositions: MinMax = FilePickerHelpers.getMinMaxFilePositions(
        existingFiles || [],
        files
    )

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

export default withStable(
    ['onFileAttached', 'onExistingFileDelete', 'onFileRemoved', 'onReorder'],
    ManagedFilePicker
)

