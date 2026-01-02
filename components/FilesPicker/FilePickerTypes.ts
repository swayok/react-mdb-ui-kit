import type {
    ReactNode,
    RefObject,
} from 'react'
import type {
    FileAPIImageFileInfo,
    FileAPISelectedFileInfo,
} from '../../helpers/file_api/FileAPI'
import type {ApiRequestMethod} from '../../services/ApiRequestService'
import {
    AnyObject,
    CssGridColumnsConfig,
    HtmlComponentProps,
    MorphingComponentProps,
} from '../../types'

// Рендерер предпросмотра файла.
export type FilePickerContextMimeTypePreviewRenderer = (
    previewWidth: number,
    fileName: string,
    fileData: FileAPISelectedFileInfo
) => ReactNode

// Настройки предпросмотра для типа файлов.
export interface FilePickerContextMimeTypeInfo {
    mime: string
    // Расширения файлов, например: ['jpeg', 'jpg'].
    extensions: string[]
    // Рендерер.
    preview: FilePickerContextMimeTypePreviewRenderer | 'image'
    // Тип файла.
    type: 'image' | 'file' | 'video' | 'audio' | 'document'
}

// Состояние компонентов выбора файлов для загрузки на сервер.
export interface FilePickerContextProps<T extends FilePickerFileInfo = FilePickerFileInfo> {
    // Максимальное кол-во файлов.
    maxFiles: number | null
    // Набор собственных компонентов для отображения предпросмотра прикрепленного файла.
    // По умолчанию есть настройки для PDF/Word/Excel и картинок.
    previews: AnyObject<FilePickerContextMimeTypeInfo>
    // Стандартный компонент для отображения предпросмотра прикрепленного файла
    // на случай если нет специального.
    fallbackPreview: FilePickerContextMimeTypePreviewRenderer
    // Список ранее прикрепленных файлов.
    existingFiles: T[]
    // Удаление файла из БД.
    onExistingFileDelete: (file: T, delay?: number) => void
    // Восстановление удаленного файла, полученного из БД.
    onExistingFileRestore?: ((file: T) => void) | null
    // Список новых прикрепленных файлов.
    files: T[]
    // Запуск прикрепления файла (программное нажатие на <input type="file">).
    pickFile: () => void
    // Можно ли прикрепить еще файлы?
    canAttachMoreFiles: () => boolean
    // Обработчик нажатия на кнопку удаления прикрепленного файла.
    onFileDelete: (file: T, delay?: number) => void
    // Запуск отправки файлов на сервер.
    startUploading: (isAutoUpload: boolean) => Promise<void>
    // Разрешить изменение позиций картинок?
    reorderable: boolean
    // Получить позицию для нового прикрепленного файла (используется для изменения позиции файлов).
    getNextFilePosition: () => number
    // Состояние отправки файлов на сервер.
    isUploading: boolean
    // Заблокировано ли взаимодействие с компонентом?
    isDisabled: boolean
    // Локализация.
    translations: FilePickerTranslations
}

// Публичное API компонента выбора файлов для загрузки на сервер.
export interface FilePickerApi<T extends FilePickerFileInfo = FilePickerFileInfo> {
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
    getFilesForUpload(
        detachInvalidFiles: boolean,
        rejectIfNotAllFilesAreValid?: boolean,
        useUidAsFileName?: boolean
    ): Promise<FilePickerUploadInfo<T>[]>

    // Получить список корректных файлов.
    getValidFiles(): T[]

    // Сброс поля выбора файлов и отмена отправки файлов на сервер.
    reset(): void
}

/**
 * Свойства компонента выбора файлов для загрузки на сервер.
 * Компонент не обеспечивает отображение файлов, только управление списком.
 * Для отображения файлов нужно использовать вложенные компоненты (children).
 */
export interface ManagedFilePickerProps<T extends FilePickerFileInfo = FilePickerFileInfo> {
    /**
     * Компоненты для отображения прикрепленных файлов.
     *
     * @see FilePickerPreviews
     * @see FilePickerPreviewsWithoutInfo
     */
    children: ReactNode | ReactNode[]
    // Ссылка на API компонента.
    apiRef?: RefObject<FilePickerApi<T> | null>
    // Список ранее прикрепленных файлов.
    existingFiles?: T[]
    // Удаление ранее прикрепленного файла.
    onExistingFileDelete?: (file: T, delay?: number) => void
    // Разрешить картинки?
    allowImages?: boolean
    // Разрешить не картинки?
    allowFiles?: boolean
    // Максимальное количество файлов для загрузки.
    maxFiles: FilePickerContextProps<T>['maxFiles']
    // Максимальный размер файлов на диске (не действует на картинки).
    maxFileSizeKb?: number
    // Имя поля ввода.
    inputName?: string
    // Прикреплен новый файл.
    onFileAttached?: (
        file: T,
        isValid: boolean
    ) => void
    // Файл удалён (откреплён).
    onFileRemoved?: (file: T) => void
    // Удаленный файл восстановлен.
    onFileRestored?: (file: T) => void
    // Вкл/Выкл доступности интерактивных элементов компонента.
    disabled?: boolean
    // Максимальный размер стороны картинки в пикселях.
    maxImageSize?: number
    // Конвертирование картинок в jpeg.
    convertImagesToJpeg?: boolean
    // Качество картинки при конвертации (от 0 до 1, по умолчанию: 0,92).
    imagesCompression?: number
    // Локализация.
    translations: FilePickerTranslations
    // Разрешенные mime-типы файлов.
    allowedMimeTypes?: (string | FilePickerContextMimeTypeInfo)[]
    // При прикреплении некорректного файла - не добавлять его в список файлов, а игнорировать.
    // В этом случае не будет отображаться блок предпросмотра.
    dropInvalidFiles?: boolean
    // Разрешить изменение позиций картинок?
    reorderable?: boolean
    // Изменены позиции файлов в списке.
    onReorder?: (
        existingFiles: T[],
        newFiles: T[]
    ) => void
}

/**
 * Свойства компонента выбора файлов для загрузки на сервер.
 * Компонент не обеспечивает отображение файлов, только управление списком.
 * Для отображения файлов нужно использовать вложенные компоненты (children).
 */
export interface FilePickerInputProps {
    /**
     * Компоненты для отображения прикрепленных файлов.
     *
     * @see FilePickerPreviews
     * @see FilePickerPreviewsWithoutInfo
     */
    children: ReactNode | ReactNode[]
    // Список ранее прикрепленных файлов.
    value?: (FilePickerFileInfoFromDB | FilePickerFileInfo)[]
    // Разрешить картинки?
    allowImages?: boolean
    // Разрешить не картинки?
    allowFiles?: boolean
    // Максимальное количество файлов для загрузки.
    maxFiles?: FilePickerContextProps<FilePickerFileInfo>['maxFiles']
    // Максимальный размер файлов на диске (не действует на картинки).
    maxFileSizeKb?: number
    // Использовать UID вместо оригинального имени прикрепляемого файла.
    useUidAsFileName?: boolean
    // Имя поля ввода.
    inputName?: string
    // Вкл/Выкл доступности интерактивных элементов компонента.
    disabled?: boolean
    // Максимальный размер стороны картинки в пикселях.
    maxImageSize?: number
    // Конвертирование картинок в jpeg.
    convertImagesToJpeg?: boolean
    // Качество картинки при конвертации (от 0 до 1, по умолчанию: 0,92).
    imagesCompression?: number
    // Локализация.
    translations: FilePickerTranslations
    // Разрешенные mime-типы файлов.
    allowedMimeTypes?: (string | FilePickerContextMimeTypeInfo)[]
    // При прикреплении некорректного файла - не добавлять его в список файлов, а игнорировать.
    // В этом случае не будет отображаться блок предпросмотра.
    dropInvalidFiles?: boolean
    // Разрешить изменение позиций картинок?
    reorderable?: boolean
    // Изменения в списке файлов.
    onChange: (files: FilePickerFileInfo[]) => void
    // Дополнительный обработчик ошибки при прикреплении файла.
    onAttachmentError?: (error: string, file: FilePickerFileInfo) => void
}

// Свойства компонента выбора файлов для загрузки на сервер,
// с модулем автоматической загрузки.
export interface FilePickerWithUploaderProps extends Omit<ManagedFilePickerProps<FilePickerWithUploaderFileInfo>, 'apiRef'> {
    // Вкл/выкл автозагрузки файлов на сервер сразу после прикрепления.
    autoUpload: boolean
    // URL для отправки файлов на сервер.
    uploadUrl?: string | null
    // HTTP метод отправки файлов на сервер, по умолчанию: post.
    uploadMethod: ApiRequestMethod
    // Длительность ожидания ответа на отправку файла.
    fileUploadingRequestTimeout?: number
    // Началась загрузка файлов на сервер.
    onUploadingStarted?: () => void
    // Завершилась загрузка файлов на сервер.
    onUploadingEnded?: () => void
    // URL для удаления файлов с сервера.
    deleteUrl?: string | null
    // HTTP метод удаления файлов с сервера, по умолчанию: delete.
    deleteMethod: ApiRequestMethod
}

// Свойства компонента FilePickerTrigger.
export interface FilePickerTriggerProps extends MorphingComponentProps, Pick<HtmlComponentProps, 'onClick' | 'children'> {
}

/**
 * Свойства компонента, который отображает список прикрепленных файлов с информацией
 * о прикрепленных файлах (имя, размер и т.п.).
 */
export interface FilePickerPreviewsProps extends HtmlComponentProps<HTMLDivElement> {
    // Размер предпросмотра.
    previewSize?: number
    // Показывать этот блок всегда или только когда есть прикрепленные файлы?
    // Дополнительная кнопка добавления первого файла может быть размещена вне этого блока,
    // поэтому его можно скрывать до прикрепления первого файла.
    alwaysVisible?: boolean
    // CSS классы для предпросмотров.
    itemClassName?: string
    // CSS классы для кнопки добавления файла.
    pickerButtonClassName?: string
    // Показывать удаленные файлы, полученные из БД.
    // Также добавляется возможность восстановить файл.
    showDeletedFiles?: boolean
    // Анимировать добавление и удаление файла.
    animatePreviews?: boolean
    // Увеличивать картинку при наведении курсора?
    scaleImageOnHover?: boolean
    // Количество элементов в строке.
    columns?: CssGridColumnsConfig
    // Подпись кнопки прикрепления файла.
    // По умолчанию: FilePickerContextProps.translations.attach_file.
    attachFileButtonLabel?: string
}

/**
 * Размер элемента предпросмотра файла.
 */
export interface FilePickerPreviewSizes {
    width: number
    height: number
}

/**
 * Свойства компонента, который отображает список прикрепленных файлов в виде
 * небольших preview-блоков.
 */
export interface FilePickerPreviewsWithoutInfoProps extends HtmlComponentProps<HTMLDivElement> {
    // Размер контейнера предпросмотра прикрепленного файла.
    previewSize?: number | FilePickerPreviewSizes
    // Размер кнопрки пикрепления картинки.
    // По умолчанию: previewSize.
    pickerButtonSize?: number | FilePickerPreviewSizes
    // Размер предпросмотра картинки.
    // По умолчанию: previewSize.
    imagePreviewSize?: number
    // Показывать этот блок всегда или только когда есть прикрепленные файлы?
    // Дополнительная кнопка добавления первого файла может быть размещена вне этого блока,
    // поэтому его можно скрывать до прикрепления первого файла.
    alwaysVisible?: boolean
    // CSS классы для контейнера предпросмотра файла или картинки.
    itemClassName?: string
    // CSS классы для предпросмотра картинки.
    imagePreviewClassName?: string
    // CSS классы для кнопки добавления файла.
    pickerButtonClassName?: string
    // Иконка для кнопки добавления картинки.
    adderIcon?: string
    // Увеличивать картинку при наведении курсора?
    scaleImageOnHover?: boolean
    // Показывать удаленные файлы, полученные из БД.
    // Также добавляется возможность восстановить файл.
    showDeletedFiles?: boolean
    // Анимировать добавление и удаление файла.
    animatePreviews?: boolean
}

// Тексты для компонентов выбора файлов для загрузки на сервер.
export interface FilePickerTranslations {
    file_size: string
    error_label: string
    error: {
        mime_type_forbidden: (extension: string) => string
        mime_type_and_extension_mismatch: (extension: string, type: string) => string
        already_attached: (name: string) => string
        too_many_files: (limit: number) => string
        file_too_large: (maxSizeMb: number) => string
        server_error: string
        unexpected_error: string
        non_json_validation_error: string
        invalid_response: string
        invalid_file: (fileName: string, error: string) => string
        internal_error_during_upload: string
        internal_error_in_xhr: string
        timed_out: string
        failed_to_get_file_blob: string
        failed_to_resize_image: string
        http401: string
    }
    status: {
        uploaded: string
        not_uploaded: string
        uploading: (uploadedPercent: number) => string
    }
    attach_file: string
    replace_file: string
    not_all_valid_files_uploaded: string
    internal_error_during_files_uploading: string
    file_will_be_deleted: string
    restore: string
}

// Информация о прикрепленном файле для отправки на сервер.
export interface FilePickerUploadInfo<T extends FilePickerFileInfo = FilePickerFileInfo> {
    file: T
    data: Blob
    fileName: string
}

// Информация о прикрепленном файле.
export interface FilePickerFileInfo {
    UID: string
    file: FileAPISelectedFileInfo
    resizedCanvas?: HTMLCanvasElement
    error: null | string
    info: FileAPIImageFileInfo | null
    position: number
    isNew?: boolean
    isDeleted?: boolean
}

// Информация о файле, полученная с сервера.
export interface FilePickerFileInfoFromDB {
    // ID файла в БД.
    id: string | number
    // MIME-тип файла.
    mimeType: string
    // Оригинальное имя файла.
    uploadName: string
    // URL к файлу.
    url: string
    // Позиция в списке.
    position?: number | null
}

// Информация о прикрепленном файле и состоянии его загрузки на сервер.
export interface FilePickerWithUploaderFileInfo extends FilePickerFileInfo {
    uploading: {
        // null means that there was no attempt to upload a file.
        isUploading: boolean | null
        isUploaded: boolean
        canRetry: boolean
        alreadyRetried: boolean
        uploadedPercent: number
        uploadedFileInfo?: string | AnyObject
        uploadingXhr: null | XMLHttpRequest
    }
    uploadingCancelled: boolean
}

// Свойства компонента, показывающего предпросмотр файла.
export interface FilePickerFilePreviewProps<
    T extends FilePickerFileInfo = FilePickerFileInfo,
> extends HtmlComponentProps {
    key: string
    file: T
    // Размер контейнера предпросмотра прикрепленного файла.
    previewSize: number | FilePickerPreviewSizes
    // Размер предпросмотра картинки.
    // По умолчанию: previewSize.
    imagePreviewSize?: number | FilePickerPreviewSizes
    imageClassName?: string
    fileClassName?: string
    showIfDeleted?: boolean
    onDelete: (file: T) => void
    onRestore?: (file: T) => void
    // Анимировать появление и удаление файла.
    animate?: boolean
    // Увеличивать картинку при наведении курсора?
    scaleImageOnHover?: boolean
}
