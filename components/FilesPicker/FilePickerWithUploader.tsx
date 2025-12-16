import {
    ChangeEvent,
    Component,
    createRef,
    RefObject,
} from 'react'
import {
    extractAndNormalizeValidationErrorsFromResponseData,
    UnauthorisedErrorHttpCode,
    ValidationErrorHttpCode,
} from '../../helpers/ApiRequestErrorHelpers'
import {
    FileAPI,
    FileAPIImageFileInfo,
    FileAPISelectedFileInfo,
} from '../../helpers/FileAPI/FileAPI'
import {getCookieValue} from '../../helpers/getCookieValue'
import {NavigationService} from '../../services/NavigationService'
import {ToastService} from '../../services/ToastService'
import {
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
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerUploadInfo,
    FilePickerWithUploaderFileInfo,
    FilePickerWithUploaderProps,
} from './FilePickerTypes'

interface State {
    // Новые прикрепленные файлы.
    files: FilePickerContextProps<FilePickerWithUploaderFileInfo>['files']
    // Состояние отправки файлов на сервер.
    isUploading: boolean
}

const positionDelta: number = 1

// Компонент для выбора файла с диска для загрузки на сервер.
// Компонент должен оборачивать все компоненты, которые участвуют в выборе файлов
// и отображении списка выбранных файлов, т.к. создает контекст с состоянием и действиями.
export class FilePickerWithUploader extends Component<
    FilePickerWithUploaderProps, State
> {

    static defaultProps: Partial<FilePickerWithUploaderProps> = {
        allowImages: true,
        allowFiles: true,
        maxFiles: null,
        maxFileSizeKb: 8 * 1024,
        autoUpload: false,
        disabled: false,
        uploadMethod: 'post',
        deleteMethod: 'delete',
        maxImageSize: 1920,
        convertImagesToJpeg: false,
        imagesCompression: 0.92,
        translations: filePickerDefaultTranslations,
        dropInvalidFiles: false,
        fileUploadingRequestTimeout: 30000,
    }

    state: State = {
        files: [],
        isUploading: false,
    }

    inputRef: RefObject<HTMLInputElement | null>

    // Конструктор
    constructor(props: FilePickerWithUploaderProps) {
        super(props)
        this.inputRef = createRef<HTMLInputElement>()
        // Полифил для мобильных устройств для имитации drag-and-drop событий из touch событий.
        void import('drag-drop-touch')
    }

    // Сброс поля выбора файлов и отмена отправки файлов на сервер.
    reset = (): void => {
        for (let i = 0; i < this.state.files.length; i++) {
            this.state.files[i].uploading.uploadingXhr?.abort()
        }
        this.setState({
            files: [],
            isUploading: false,
        })
    }

    // Находится ли компонент в состоянии отправки файлов на сервер?
    isUploading = (): boolean => this.state.isUploading

    // Вкл/выкл режим отправки файлов (в случае если отправка производится не самим компонентом).
    setUploadingState = (uploading: boolean): void => this.setState({
        isUploading: uploading,
    })

    /**
     * Получить данные файлов для отправки на сервер при отправке не этим компонентом.
     * Картинки конвертируются и ужимаются в соответствии с настройками:
     * maxImageSize, convertImagesToJpeg, imagesCompression.
     * Если не все файлы прошли валидацию и rejectIfNotAllFilesAreValid === true, то
     * отказ будет с ошибкой new Error('contains_invalid_file').
     * Возможно возникновение отказов при обработке картинок:
     * new Error('failed_to_get_image_blob'), new Error('failed_to_resize_file').
     * @param {boolean} detachInvalidFiles Открепить файлы не прошедшие валидацию.
     * @param {boolean} rejectIfNotAllFilesAreValid Ответить отказом если не все файлы прошли валидацию.
     * @param {boolean} useUidAsFileName Использовать FilePickerFileInfo.UID вместо имени файла.
     * Если detachInvalidFiles === true, то rejectIfNotAllFilesAreValid не имеет смысла.
     */
    getFilesForUpload = (
        detachInvalidFiles: boolean,
        rejectIfNotAllFilesAreValid: boolean = false,
        useUidAsFileName: boolean = false
    ): Promise<FilePickerUploadInfo[]> => new Promise<FilePickerUploadInfo[]>(
        (resolve, reject) => {
            const validFiles = this.getValidFiles()
            if (detachInvalidFiles) {
                this.detachInvalidFiles()
            } else if (rejectIfNotAllFilesAreValid && validFiles.length !== this.state.files.length) {
                reject(new Error('contains_invalid_file'))
                return
            }
            const promises = []
            for (let i = 0; i < validFiles.length; i++) {
                promises.push(this.getFileInfoForUpload(validFiles[i], useUidAsFileName))
            }
            Promise.all(promises)
                .then((files: FilePickerUploadInfo[]) => {
                    resolve(files)
                })
                .catch((error: Error) => {
                    reject(error)
                })
        }
    )

    // Открепить файлы непрошедшие валидацию.
    detachInvalidFiles(): void {
        this.setState({
            files: this.getValidFiles(),
        })
    }

    // Запуск отправки файлов на сервер.
    startUploading = (
        rejectIfNotAllValidFilesUploaded: boolean
    ): Promise<Array<FilePickerWithUploaderFileInfo>> => new Promise((resolve, reject) => {
        if (this.state.isUploading) {
            reject(new Error('already_uploading'))
            return
        }
        const validFilesCount = this.getValidFiles().length
        this
            .uploadFiles(false)
            .then(() => {
                const uploadedFiles = this.getUploadedFiles()
                console.log('[FilePicker] startUploading(): uploaded files', uploadedFiles)
                if (rejectIfNotAllValidFilesUploaded) {
                    if (validFilesCount !== uploadedFiles.length) {
                        reject(new Error('not_all_valid_files_uploaded'))
                    }
                }
                resolve(uploadedFiles)
            })
            .catch(reject) // < exception during upload.
    })

    // Отмена отправки файлов на сервер.
    cancelUploading = async (deleteUploadedFiles: boolean): Promise<void> => {
        for (let i = 0; i < this.state.files.length; i++) {
            try {
                this.state.files[i].uploading.uploadingXhr?.abort()
                if (deleteUploadedFiles && this.state.files[i].uploading.uploadedFileInfo) {
                    await this.deleteFileFromServer(this.state.files[i])
                }
            } catch (_e) {
                // ignore.
            }
        }
        if (deleteUploadedFiles) {
            this.setState({
                files: [],
                isUploading: false,
            })
        } else {
            this.setState({
                isUploading: false,
            })
        }
    }

    // Получить список отправленных на сервер файлов.
    getUploadedFiles = (): Array<FilePickerWithUploaderFileInfo> => {
        const ret = []
        const validFiles = this.getValidFiles()
        for (let i = 0; i < validFiles.length; i++) {
            if (validFiles[i].uploading.uploadedFileInfo) {
                ret.push(validFiles[i])
            }
        }
        console.log('[FilePicker] uploaded files', ret)
        return ret
    }

    // Получить список корректных файлов.
    getValidFiles = (): Array<FilePickerWithUploaderFileInfo> => {
        const ret = []
        for (let i = 0; i < this.state.files.length; i++) {
            if (FilePickerHelpers.isValidFile(this.state.files[i])) {
                ret.push(this.state.files[i])
            }
        }
        // console.log('[FilePicker] valid files', ret);
        return ret
    }

    private dummyFn = () => {
    }

    // Отображение блока прикрепления файлов.
    render() {
        const reorderable: boolean = (
            !!this.props.reorderable
            && (this.props?.maxFiles || 2) > 1
        )

        const context: FilePickerContextProps<FilePickerWithUploaderFileInfo> = {
            pickFile: () => {
                if (!this.props.disabled) {
                    this.inputRef.current?.click()
                }
            },
            maxFiles: this.props.maxFiles,
            previews: this.getAllowedFileTypes(),
            fallbackPreview: filePickerFallbackPreview,
            existingFiles: this.props.existingFiles ?? [],
            onExistingFileDelete: this.props.onExistingFileDelete ?? this.dummyFn,
            files: this.state.files,
            reorderable,
            isUploading: this.state.isUploading,
            isDisabled: this.props.disabled ?? false,
            onFileDelete: this.onFileDelete,
            startUploading: this.uploadFiles,
            canAttachMoreFiles: this.canAttachMoreFiles,
            translations: this.props.translations,
            getNextFilePosition: this.getNextFilePosition,
        }

        // Получить минимальное и максимальное значения позиций файлов.
        const minMaxPositions: MinMax = FilePickerHelpers.getMinMaxFilePositions(
            this.props.existingFiles || [],
            this.state.files
        )

        return (
            <FilePickerContext.Provider
                value={context as unknown as FilePickerContextProps<FilePickerFileInfo>}
            >
                <ErrorBoundary>
                    <input
                        type="file"
                        multiple={!this.props.maxFiles || this.props.maxFiles > 1}
                        ref={this.inputRef}
                        style={{width: 0, height: 0, padding: 0, margin: 0, position: 'absolute'}}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                    />
                    {this.renderUploadedFilesInputs()}

                    <ReorderableList<FilePickerWithUploaderFileInfo>
                        itemsCount={this.getNotDeletedFilesCount()}
                        minPosition={minMaxPositions.min}
                        maxPosition={minMaxPositions.max}
                        droppedItemPlacement="before"
                        disabled={!reorderable}
                        onDragFinish={this.onDragFinish}
                    >
                        {this.props.children}
                    </ReorderableList>
                </ErrorBoundary>
            </FilePickerContext.Provider>
        )
    }

    private renderUploadedFilesInputs() {
        if (!this.props.inputName) {
            return null
        }
        const inputs = []
        for (let i = 0; i < this.state.files.length; i++) {
            if (this.state.files[i].uploading.uploadedFileInfo) {
                inputs.push(
                    <input
                        name={this.props.inputName + '[]'}
                        type="hidden"
                        key={'uploaded-file-info-' + i}
                    />
                )
            }
        }
        return inputs
    }

    // Получить разрешенные типы файлов.
    private getAllowedFileTypes(): FilePickerContextProps['previews'] {
        if (this.props.allowedMimeTypes) {
            const allowedMimeTypes = this.props.allowedMimeTypes
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
        if (this.props.allowFiles && this.props.allowImages) {
            return filePickerDefaultPreviews
        }
        const ret: FilePickerContextProps['previews'] = {}
        for (const mimeType in filePickerDefaultPreviews) {
            const preview = filePickerDefaultPreviews[mimeType]
            if (this.props.allowFiles && preview.type === 'file') {
                ret[mimeType] = preview
            } else if (this.props.allowImages && preview.type === 'image') {
                ret[mimeType] = preview
            }
        }
        return ret
    }

    // Обработка прикрепленного файла (валидация, уменьшение).
    private processNewFile = (
        file: FileAPISelectedFileInfo,
        position: number,
        pendingFilesToBeAdded: number
    ): Promise<FilePickerWithUploaderFileInfo> => {
        if (!this.canAttachMoreFiles(pendingFilesToBeAdded)) {
            // control files count
            ToastService.error(
                this.props.translations.error.too_many_files(
                    this.props.maxFiles as number
                )
            )
            return Promise.reject(new Error('too_many_files'))
        }
        const fileUID: string = FilePickerHelpers.makeFileID(file)
        // Проверка на прикрепление уже прикрепленного файла.
        for (let i = 0; i < this.state.files.length; i++) {
            if (this.state.files[i].UID === fileUID) {
                ToastService.error(
                    this.props.translations.error.already_attached(file.name)
                )
                return Promise.reject(new Error('already_attached'))
            }
        }
        return new Promise<FilePickerWithUploaderFileInfo>((resolve, reject) => {
            try {
                const mimeTypeInfo: string | FilePickerContextMimeTypeInfo = this.validateFileType(file)
                const isInvalidFileType: boolean = typeof mimeTypeInfo === 'string'
                if (isInvalidFileType) {
                    ToastService.error(
                        this.props.translations.error.invalid_file(file.name, mimeTypeInfo as string),
                        6000
                    )
                }
                const processedFile: FilePickerWithUploaderFileInfo = {
                    UID: fileUID,
                    file,
                    error: isInvalidFileType ? mimeTypeInfo as string : null,
                    info: null,
                    position,
                    uploadingCancelled: false,
                    isDeleted: false,
                    uploading: {
                        isUploading: null,
                        isUploaded: false,
                        canRetry: false,
                        alreadyRetried: false,
                        uploadedPercent: 0,
                        uploadingXhr: null,
                    },
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
                console.error('[FilePickerWithUploader] processNewFile error: ', {
                    file,
                    error: e,
                })
                reject(e as Error)
            }
        })
    }

    // Валидация типа файла.
    private validateFileType = (file: FileAPISelectedFileInfo): string | FilePickerContextMimeTypeInfo =>
        FilePickerHelpers.validateFileTypeAndSize(
            file,
            this.getAllowedFileTypes(),
            this.props.translations,
            this.props.maxFileSizeKb
        )

    // Можно ли прикрепить больше файлов?
    private canAttachMoreFiles = (pendingFilesToBeAdded: number = 0): boolean => {
        if (this.props.maxFiles === null || this.props.maxFiles <= 1) {
            return true
        }
        return (this.getNotDeletedFilesCount() + pendingFilesToBeAdded) < this.props.maxFiles
    }

    // Посчитать количество прикрепленных, но не удаленных файлов.
    private getNotDeletedFilesCount(): number {
        return (this.props.existingFiles || [])
            .concat(this.state.files)
            .filter(file => !file.isDeleted)
            .length
    }

    // Вычислить позицию для нового прикрепленного файла.
    private getNextFilePosition = (): number => {
        const maxValue = (this.props.existingFiles || [])
            .concat(this.state.files)
            .reduce((carry: FilePickerWithUploaderFileInfo | null, file): FilePickerWithUploaderFileInfo => {
                if (!carry) {
                    return file
                }
                return (carry.position < file.position) ? file : carry
            }, null)
        return maxValue ? maxValue.position + positionDelta : 0
    }

    // Обработка выбора файлов.
    private onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        void this.onNewFilesSelected(event)
    }

    // Окончание перетаскивания файлов.
    private onDragFinish = (
        _draggedElementPosition: number,
        draggedElementPayload: FilePickerWithUploaderFileInfo,
        _droppedOnElementPosition: number,
        droppedOnElementPayload: FilePickerWithUploaderFileInfo
    ): void => {
        const newPosition: number = droppedOnElementPayload.position
        const allFiles: FilePickerWithUploaderFileInfo[] = (this.props.existingFiles || [])
            .concat(this.state.files)
        // Смещаем все файлы с позицией >= той, что у файла, на который перетащили другой файл на 1.
        for (let i = 0; i < allFiles.length; i++) {
            if (allFiles[i].position >= newPosition) {
                allFiles[i].position++
            }
        }
        // Задаем позицию перетаскиваемого файла = позиции файла, на который перетащили.
        draggedElementPayload.position = newPosition
        this.setState(state => ({
            files: state.files.slice(),
        }), () => {
            this.props.onReorder?.(
                (this.props.existingFiles || []).slice(),
                this.state.files.slice()
            )
        })
    }

    // Обработка нескольких выбранных файлов.
    private onNewFilesSelected = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (this.props.disabled) {
            return Promise.resolve()
        }
        const selectedFiles: Array<FileAPISelectedFileInfo> = FileAPI.getFiles(event.target, true)
        // console.log('[FilePicker] new files', selectedFiles);
        const newFilesList: Array<FilePickerWithUploaderFileInfo> = []
        let newMaxPosition: number = this.getNextFilePosition()
        for (let i = 0; i < selectedFiles.length; i++) {
            try {
                const processedFile: FilePickerWithUploaderFileInfo = await this.processNewFile(
                    selectedFiles[i],
                    newMaxPosition,
                    newFilesList.length
                )
                newMaxPosition++
                if (FilePickerHelpers.isValidFile(processedFile) || !this.props.dropInvalidFiles) {
                    newFilesList.push(processedFile)
                }
                this.props.onFileAttached?.(
                    processedFile,
                    FilePickerHelpers.isValidFile(processedFile)
                )
            } catch (e: unknown) {
                if (e !== null) { // < except for a file is already added or there no more places left
                    console.error('[FilePicker] Failed to process new file', {
                        index: i,
                        file: selectedFiles[i],
                        error: e,
                    })
                }
            }
        }
        this.setState((state: State) => ({
            files: this.props.maxFiles === 1 ? newFilesList : state.files.concat(newFilesList),
        }), () => {
            if (this.props.autoUpload) {
                setTimeout(() => {
                    this.uploadFiles(true).catch(() => {
                    })
                }, 100)
            }
        })
    }

    // Отправка файлов на сервер.
    private uploadFiles = async (isAutoUpload: boolean): Promise<void> => {
        if (!this.props.uploadUrl) {
            return Promise.reject(new Error('[FilePicker] uploadFiles(): uploadUrl is not set'))
        }
        if (this.state.isUploading) {
            // console.log('[FilePicker] uploadFiles(): cancel (already uploading)');
            return Promise.reject(new Error('[FilePicker] uploadFiles(): cancel (already uploading)'))
        }
        this.setState({
            isUploading: true,
        })
        this.props.onUploadingStarted?.()
        console.log('[FilePicker] uploadFiles(): started')
        return this.uploadNextFile()
            .finally(() => {
                this.setState({
                    isUploading: false,
                })
                this.props.onUploadingEnded?.()
                console.log('[FilePicker] uploadFiles(): ended')
            })
            .catch(e => {
                console.error('[FilePicker] uploadFiles -> uploadNextFile error', e)
                if (isAutoUpload) {
                    ToastService.error(
                        this.props.translations.error.internal_error_during_upload,
                        6000
                    )
                }
                // todo: Раскомментировать если будем использовать Sentry
                // if (Config.isProduction) {
                //     Sentry.captureException(e, {
                //         extra: {
                //             isAutoUpload,
                //         },
                //     })
                // }
            })
    }

    // Отправка следующего неотправленного файла на сервер.
    private uploadNextFile = async (): Promise<void> => {
        for (let i = 0; i < this.state.files.length; i++) {
            if (!this.canBeUploaded(this.state.files[i])) {
                continue
            }
            // console.log('file is valid. starting upload', this.state.files[i]);
            try {
                await this.startFileUploading(this.state.files[i].UID)
            } catch (e) {
                await this.finishFileUploadingWithError(
                    this.state.files[i].UID,
                    this.props.translations.error.internal_error_during_upload,
                    false
                )
                console.error('[FilePicker] uploadNextFile() -> startFileUploading() error', e)
            }
            return this.uploadNextFile()
        }
        return Promise.resolve()
    }

    // Файл может быть отправлен на сервер?
    private canBeUploaded(file: FilePickerWithUploaderFileInfo): boolean {
        if (file.isDeleted || file.uploading.isUploaded) {
            return false
        }
        if (file.error) {
            return file.uploading.canRetry
        }
        return true
    }

    // Обработка нажатия на кнопку удаления файла.
    private onFileDelete = (file: FilePickerWithUploaderFileInfo, delay?: number) => {
        let removedFile: FilePickerWithUploaderFileInfo | null = null
        this.setState((state: State) => {
            for (let i = 0; i < state.files.length; i++) {
                if (file.UID === this.state.files[i].UID) {
                    const newFiles = state.files.slice()
                    removedFile = newFiles[i]
                    if (delay) {
                        // Нужно дождаться окончания анимации удаления.
                        newFiles[i].isDeleted = true
                    } else {
                        newFiles.splice(i, 1)
                    }
                    return {
                        files: newFiles,
                    }
                }
            }
            return {
                files: state.files,
            }
        }, () => {
            if (delay) {
                // Удалить файл из состояния после окончания анимации удаления.
                setTimeout(() => {
                    this.setState((state: State) => {
                        for (let i = 0; i < state.files.length; i++) {
                            if (file.UID === this.state.files[i].UID) {
                                const newFiles = state.files.slice()
                                newFiles.splice(i, 1)
                                return {
                                    files: newFiles,
                                }
                            }
                        }
                        return {
                            files: state.files,
                        }
                    })
                    if (removedFile) {
                        this.props.onFileRemoved?.(removedFile)
                    }
                }, delay)
            } else if (removedFile) {
                this.props.onFileRemoved?.(removedFile)
            }
            if (file.uploading.uploadedFileInfo) {
                // Удалить с сервера.
                this.deleteFileFromServer(file)
                    .then(() => {
                    })
                    .catch(() => {
                    })
            }
            if (file.uploading.uploadingXhr) {
                // Отменить активный запрос на сервер.
                file.uploading.uploadingXhr.abort()
            }

        })
    }

    // Запуск отправки файла на сервер.
    private startFileUploading(fileUID: FilePickerWithUploaderFileInfo['UID']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.setState((state: State) => {
                for (let i = 0; i < state.files.length; i++) {
                    if (state.files[i].UID === fileUID) {
                        const files = state.files.slice()
                        files[i].error = null
                        files[i].uploading.uploadingXhr = null
                        files[i].uploading.isUploading = true
                        files[i].uploading.isUploaded = false
                        files[i].uploading.uploadedPercent = 0
                        if (files[i].error) {
                            files[i].uploading.alreadyRetried = true
                        }
                        setTimeout(() => {
                            this.sendFileToServer(files[i])
                                .then(resolve)
                                .catch(reject)
                        }, 10)
                        return {
                            files,
                        }
                    }
                }
                return {
                    files: state.files,
                }
            })
        })
    }

    // Удаление файла с сервера.
    private deleteFileFromServer(file: FilePickerWithUploaderFileInfo): Promise<boolean> {
        if (!this.props.deleteUrl) {
            return Promise.reject(new Error('deleteUrl is not set'))
        }
        if (!file.uploading.uploadedFileInfo) {
            return Promise.resolve(false)
        }
        return new Promise(resolve => {
            try {
                const xhr = new XMLHttpRequest()
                xhr.addEventListener('load', () => {
                    console.log(
                        '[FilePicker] deleteFileFromServer(): response',
                        {code: xhr.status, response: xhr.response}
                    )
                    if (xhr.status < 400) {
                        resolve(true)
                    } else {
                        console.error(
                            '[FilePicker] deleteFileFromServer(): failed',
                            {code: xhr.status, response: xhr.response}
                        )
                        resolve(false)
                    }
                })
                xhr.addEventListener('error', () => resolve(false))
                xhr.addEventListener('abort', () => resolve(false))
                let method: 'get' | 'post'
                let dataMethod: null | 'PUT' | 'DELETE' = null
                switch (this.props.deleteMethod) {
                    case 'get':
                        method = 'get'
                        break
                    case 'delete':
                        dataMethod = 'DELETE'
                        method = 'post'
                        break
                    case 'put':
                        dataMethod = 'PUT'
                        method = 'post'
                        break
                    case 'post':
                    default:
                        method = 'post'
                        break
                }
                let url: string = this.props.deleteUrl as string
                let formData: FormData | null = null
                if (method === 'get') {
                    const queryArgs: AnyObject<string> = {
                        info: file.uploading.uploadedFileInfo as string,
                    }
                    if (dataMethod) {
                        queryArgs._method = dataMethod
                    }
                    url = NavigationService.makeUrl(url, null, queryArgs)
                } else {
                    formData = new FormData()
                    formData.append('info', file.uploading.uploadedFileInfo as string)
                    if (dataMethod) {
                        formData.append('_method', dataMethod)
                    }
                }
                xhr.open(method, url)
                xhr.setRequestHeader('X-XSRF-TOKEN', getCookieValue('XSRF-TOKEN') || '')
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
                xhr.setRequestHeader('Accept', 'application/json')
                xhr.send(formData)
                // console.log('[FilePicker] deleteFileFromServer(): XHR sent', {method, url, formData});
            } catch (e) {
                console.error('[FilePicker] deleteFileFromServer(): error', e)
                resolve(false)
            }
        })
    }

    // Отправка файла на сервер (выполнение запроса к серверу).
    private sendFileToServer(file: FilePickerWithUploaderFileInfo): Promise<void> {
        if (!this.props.uploadUrl) {
            return Promise.reject(new Error('uploadUrl is not set'))
        }
        return new Promise((resolve, reject) => {
            this
                .getFileInfoForUpload(file)
                .then((fileInfo: FilePickerUploadInfo<FilePickerWithUploaderFileInfo>) => {
                    const formData = new FormData()
                    if (this.props.uploadMethod !== 'post') {
                        formData.append('_method', this.props.uploadMethod.toUpperCase())
                    }
                    formData.append('file', fileInfo.data, fileInfo.fileName)
                    const xhr = new XMLHttpRequest()
                    file.uploading.uploadingXhr = xhr
                    xhr.open('post', this.props.uploadUrl as string)
                    xhr.setRequestHeader('X-XSRF-TOKEN', getCookieValue('XSRF-TOKEN') || '')
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
                    xhr.setRequestHeader('Accept', 'application/json')
                    xhr.timeout = this.props.fileUploadingRequestTimeout || 30000
                    // xhr.setRequestHeader('Content-Type', 'multipart/form-data'); //< this header causes fails!!
                    let throttler: number | null = null
                    xhr.upload.addEventListener('progress', (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                        if (throttler && e.total !== e.loaded) {
                            return
                        }
                        this.updateUploadProgressForFile(file.UID, e.total, e.loaded)
                        if (e.loaded < e.total) {
                            throttler = window.setTimeout(() => {
                                throttler = null
                            }, 1000)
                        }
                    })
                    xhr.addEventListener('load', () => {
                        let responseData: AnyObject = {}
                        try {
                            responseData = JSON.parse(xhr.response as string)
                        } catch (_e) {
                            /* empty */
                        }
                        // console.log('[FilePicker] File upload response', xhr.status, xhr.response, responseData);
                        if (xhr.status < 400) {
                            if (!responseData.file_info) {
                                this.finishFileUploadingWithError(
                                    fileInfo.file.UID,
                                    this.props.translations.error.invalid_response,
                                    fileInfo.file.uploading.canRetry
                                ).then(resolve).catch(reject)
                            } else {
                                this.finishFileUploading(fileInfo.file.UID, responseData.file_info as AnyObject)
                                    .then(resolve)
                                    .catch(reject)
                            }
                        } else if (xhr.status >= 500) {
                            this.finishFileUploadingWithError(
                                fileInfo.file.UID,
                                this.props.translations.error.server_error,
                                fileInfo.file.uploading.canRetry
                            ).then(resolve).catch(reject)
                        } else if (xhr.status === ValidationErrorHttpCode) {
                            let message: string
                            if (responseData) {
                                const errors = extractAndNormalizeValidationErrorsFromResponseData(responseData)
                                message = errors.file || this.props.translations.error.invalid_response
                            } else {
                                message = this.props.translations.error.invalid_response
                            }
                            this.finishFileUploadingWithError(fileInfo.file.UID, message, false).then(resolve).catch(
                                reject
                            )
                        } else if (xhr.status === UnauthorisedErrorHttpCode) {
                            ToastService.error(this.props.translations.error.http401)
                            NavigationService.reload()
                        } else {
                            this.finishFileUploadingWithError(
                                fileInfo.file.UID,
                                this.props.translations.error.invalid_response,
                                false
                            ).then(resolve).catch(reject)
                        }
                    })
                    xhr.addEventListener('error', () => {
                        this.finishFileUploadingWithError(
                            fileInfo.file.UID,
                            this.props.translations.error.internal_error_in_xhr,
                            fileInfo.file.uploading.canRetry
                        ).then(resolve).catch(reject)
                    })
                    xhr.addEventListener('abort', () => {
                        this.abortFileUploading(fileInfo.file.UID).then(resolve).catch(reject)
                    })
                    xhr.addEventListener('timeout', () => {
                        this.finishFileUploadingWithError(
                            fileInfo.file.UID,
                            this.props.translations.error.timed_out,
                            fileInfo.file.uploading.canRetry
                        ).then(resolve).catch(reject)
                    })
                    xhr.send(formData)
                })
                .catch(e => {
                    console.error('[FilePicker] file uploading failed', e)
                    let message: string
                    switch (e) {
                        case 'failed_to_resize_image':
                            message = this.props.translations.error.failed_to_resize_image
                            break
                        case 'failed_to_get_image_blob':
                        default:
                            message = this.props.translations.error.failed_to_get_file_blob
                    }
                    this.finishFileUploadingWithError(file.UID, message, false).then(resolve).catch(reject)
                })
        })
    }

    // Завершение оправки файла на сервер.
    private finishFileUploading(
        fileUID: FilePickerWithUploaderFileInfo['UID'],
        uploadedFileInfo: FilePickerWithUploaderFileInfo['uploading']['uploadedFileInfo']
    ): Promise<void> {
        return new Promise(resolve => {
            this.setState((state: State) => {
                for (let i = 0; i < state.files.length; i++) {
                    if (state.files[i].UID === fileUID) {
                        const files = state.files.slice()
                        files[i].uploading.isUploading = false
                        files[i].uploading.isUploaded = true
                        files[i].uploading.uploadingXhr = null
                        files[i].uploading.uploadedPercent = 100
                        files[i].uploading.uploadedFileInfo = uploadedFileInfo
                        return {
                            files,
                        }
                    }
                }
                return {
                    files: state.files,
                }
            }, resolve)
        })
    }

    // Завершение оправки файла на сервер в случае ошибки.
    private finishFileUploadingWithError(
        fileUID: FilePickerWithUploaderFileInfo['UID'],
        error: string,
        allowRetry: boolean
    ): Promise<void> {
        return new Promise(resolve => {
            this.setState((state: State) => {
                for (let i = 0; i < state.files.length; i++) {
                    if (state.files[i].UID === fileUID) {
                        const files = state.files.slice()
                        files[i].uploading.isUploading = false
                        files[i].uploading.isUploaded = false
                        files[i].uploading.uploadingXhr = null
                        files[i].uploading.uploadedPercent = 0
                        files[i].uploading.canRetry = !files[i].uploading.alreadyRetried && allowRetry
                        files[i].error = error
                        return {
                            files,
                        }
                    }
                }
                return {
                    files: state.files,
                }
            }, resolve)
        })
    }

    // Отмена оправки файла на сервер.
    private abortFileUploading(fileUID: FilePickerWithUploaderFileInfo['UID']): Promise<void> {
        return new Promise(resolve => {
            this.setState((state: State) => {
                for (let i = 0; i < state.files.length; i++) {
                    if (state.files[i].UID === fileUID) {
                        const files = state.files.slice()
                        files[i].uploadingCancelled = true
                        files[i].uploading.isUploading = false
                        files[i].uploading.isUploaded = false
                        files[i].uploading.uploadingXhr = null
                        files[i].uploading.uploadedPercent = 0
                        files[i].uploading.canRetry = true
                        return {
                            files,
                        }
                    }
                }
                return {
                    files: state.files,
                }
            }, resolve)
        })
    }

    // Обновление прогресса отправки файла на сервер.
    private updateUploadProgressForFile(fileUID: FilePickerWithUploaderFileInfo['UID'], totalSize: number, uploaded: number): void {
        this.setState((state: State) => {
            for (let i = 0; i < state.files.length; i++) {
                if (state.files[i].UID === fileUID) {
                    const files = state.files.slice()
                    files[i].uploading.uploadedPercent = Math.min(100, Math.round((uploaded / totalSize) * 100))
                    return {
                        files,
                    }
                }
            }
            return {
                files: state.files,
            }
        })
    }

    // Получение информации о файле для отправки на сервер.
    private getFileInfoForUpload(
        file: FilePickerWithUploaderFileInfo,
        useUidAsFileName: boolean = false
    ): Promise<FilePickerUploadInfo<FilePickerWithUploaderFileInfo>> {
        return FilePickerHelpers.getFileInfoForUpload<FilePickerWithUploaderFileInfo>(
            file,
            useUidAsFileName,
            this.props.maxImageSize,
            this.props.convertImagesToJpeg,
            this.props.imagesCompression
        )
    }
}
