import React, {AllHTMLAttributes} from 'react'
import {ApiRequestMethod} from '../services/ApiRequestService'
import {AnyObject} from './Common'
import {FileAPIImageFileInfo, FileAPISelectedFileInfo} from '../helpers/FileAPI/FileAPI'

// Рендерер предпросмотра файла.
export type FilePickerContextMimeTypePreviewRenderer = (
    (previewWidth: number, fileName: string) => React.ReactNode
)

// Настройки предпросмотра для типа файлов.
export type FilePickerContextMimeTypeInfo = {
    // Расширения файлов, например: ['jpeg', 'jpg'].
    extensions: Array<string>,
    // Рендерер.
    preview: FilePickerContextMimeTypePreviewRenderer | 'image',
    // Тип файла.
    type: 'image' | 'file' | 'video' | 'document'
}

// Состояние компонентов выбора файлов для загрузки на сервер.
export type FilePickerContextProps = {
    // Максимальное кол-во файлов.
    maxFiles: number | null,
    // Набор собственных компонентов для отображения предпросмотра прикрепленного файла.
    // По умолчанию есть настройки для PDF/Word/Excel и картинок.
    previews: AnyObject<FilePickerContextMimeTypeInfo>,
    // Стандартный компонент для отображения предпросмотра прикрепленного файла
    // на случай если нет специального.
    fallbackPreview: FilePickerContextMimeTypePreviewRenderer,
    // Список ранее прикрепленных файлов.
    existingFiles: FilePickerFileInfo[],
    // Удаление ранее прикрепленного файла.
    onExistingFileDelete: (file: FilePickerFileInfo, delay?: number) => void,
    // Список новых прикрепленных файлов.
    files: FilePickerFileInfo[],
    // Запуск прикрепления файла (программное нажатие на <input type="file">).
    pickFile: () => void,
    // Можно ли прикрепить еще файлы?
    canAttachMoreFiles: () => boolean,
    // Обработчик нажатия на кнопку удаления прикрепленного файла.
    onFileDelete: (file: FilePickerFileInfo, delay?: number) => void,
    // Запуск отправки файлов на сервер.
    startUploading: () => Promise<void>
    // Разрешить изменение позиций картинок?
    reorderable: boolean,
    // Получить позицию для нового прикрепленного файла (используется для изменения позиции файлов).
    getNextFilePosition: () => number,
    // Состояние отправки файлов на сервер.
    isUploading: boolean,
    // Заблокировано ли взаимодействие с компонентом?
    isDisabled: boolean,
    // Локализация.
    translations: FilePickerTranslations,
}

// Публичное API компонента выбора файлов для загрузки на сервер.
export type FilePickerApi = {
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
        rejectIfNotAllFilesAreValid: boolean = false,
        useUidAsFileName: boolean = false
    ): Promise<FilePickerUploadInfo[]>,

    // Получить список корректных файлов.
    getValidFiles(): Array<FilePickerFileInfo>,

    // Сброс поля выбора файлов и отмена отправки файлов на сервер.
    reset(): void,
}

// Свойства компонента выбора файлов для загрузки на сервер.
export interface FilePickerProps {
    children: React.ReactNode | React.ReactNode[];
    // Ссылка на API компонента.
    apiRef?: React.RefObject<FilePickerApi>
    // Список ранее прикрепленных файлов.
    existingFiles?: FilePickerFileInfo[];
    // Удаление ранее прикрепленного файла.
    onExistingFileDelete?: (file: FilePickerFileInfo, delay?: number) => void;
    // Разрешить картинки?
    allowImages?: boolean;
    // Разрешить не картинки?
    allowFiles?: boolean;
    // Максимальное количество файлов для загрузки.
    maxFiles: FilePickerContextProps['maxFiles'];
    // Максимальный размер файлов на диске (не действует на картинки).
    maxFileSizeKb?: number;
    // Имя поля ввода.
    inputName?: string;
    // Прикреплен новый файл.
    onFileAttached?: (
        file: FilePickerFileInfo,
        isValid: boolean,
    ) => void;
    // Файл удалён (откреплён).
    onFileRemoved?: (
        file: FilePickerFileInfo,
    ) => void;
    // Вкл/Выкл доступности интерактивных элементов компонента.
    disabled?: boolean;
    // Максимальный размер стороны картинки в пикселях.
    maxImageSize?: number;
    // Конвертирование картинок в jpeg.
    convertImagesToJpeg?: boolean;
    // Качество картинки при конвертации (от 0 до 1, по умолчанию: 0,92).
    imagesCompression?: number;
    // Локализация.
    translations: FilePickerTranslations;
    // Разрешенные mime-типы файлов.
    allowedMimeTypes?: string[];
    // При прикреплении некорректного файла - не добавлять его в список файлов,
    // а игнорировать. В этом случае не будет отображаться блок предпросмотра.
    dropInvalidFiles?: boolean;
    // Разрешить изменение позиций картинок?
    reorderable?: boolean;
    // Изменены позиции файлов в списке.
    onReorder?: (
        existingFiles: FilePickerFileInfo[],
        newFiles: FilePickerFileInfo[]
    ) => void;
}

// Свойства компонента выбора файлов для загрузки на сервер,
// с модулем автоматической загрузки.
export interface FilePickerWithUploaderProps extends Omit<FilePickerProps, 'apiRef'> {
    // Вкл/выкл автозагрузки файлов на сервер сразу после прикрепления.
    autoUpload: boolean;
    // URL для отправки файлов на сервер.
    uploadUrl?: string | null;
    // HTTP метод отправки файлов на сервер, по умолчанию: post.
    uploadMethod: ApiRequestMethod;
    // Началась загрузка файлов на сервер.
    onUploadingStarted?: () => void;
    // Завершилась загрузка файлов на сервер.
    onUploadingEnded?: () => void;
    // URL для удаления файлов с сервера.
    deleteUrl?: string | null;
    // HTTP метод удаления файлов с сервера, по умолчанию: delete.
    deleteMethod: ApiRequestMethod;
}

// Тексты для компонентов выбора файлов для загрузки на сервер.
export type FilePickerTranslations = {
    file_size: string,
    error_label: string,
    error: {
        mime_type_forbidden: (extension: string) => string,
        mime_type_and_extension_mismatch: (extension: string, type: string) => string,
        already_attached: (name: string) => string,
        too_many_files: (limit: number) => string,
        file_too_large: (maxSizeMb: number) => string,
        server_error: string,
        unexpected_error: string,
        non_json_validation_error: string,
        invalid_response: string,
        invalid_file: (fileName: string, error: string) => string,
        internal_error_during_upload: string,
        internal_error_in_xhr: string,
        timed_out: string,
        failed_to_get_file_blob: string,
        failed_to_resize_image: string,
        http401: string,
    },
    status: {
        uploaded: string,
        not_uploaded: string,
        uploading: (uploadedPercent: number) => string,
    },
    attach_file: string,
    not_all_valid_files_uploaded: string,
    internal_error_during_files_uploading: string,
    file_will_be_deleted: string,
    restore: string,
}

// Информация о прикрепленном файле для отправки на сервер.
export type FilePickerUploadInfo = {
    file: FilePickerFileInfo,
    data: Blob,
    fileName: string,
}

// Информация о прикрепленном файле и состоянии его загрузки на сервер.
export type FilePickerFileInfo = {
    UID: string,
    file: FileAPISelectedFileInfo,
    resizedCanvas?: HTMLCanvasElement,
    error: null | string,
    info: FileAPIImageFileInfo | null,
    position: number,
    uploading: {
        // null means that there was no attempt to upload a file.
        isUploading: boolean | null,
        isUploaded: boolean,
        canRetry: boolean,
        alreadyRetried: boolean,
        uploadedPercent: number,
        uploadedFileInfo?: string | AnyObject,
        uploadingXhr: null | XMLHttpRequest
    },
    uploadingCancelled: boolean,
    isDeleted: boolean,
}

// Свойства компонента, показывающего предпросмотр файла.
export interface FilePickerFilePreviewProps extends AllHTMLAttributes<HTMLElement>{
    file: FilePickerFileInfo,
    previewSize: number,
    onDelete: (file: FilePickerFileInfo) => void,
    key: string,
}

// Позиция нового файла в списке.
export type NewFilePosition = {
    name: string,
    position: number,
}

// Позиция существующего файла в списке.
export type ExistingFilePosition = {
    id: number,
    position: number,
}