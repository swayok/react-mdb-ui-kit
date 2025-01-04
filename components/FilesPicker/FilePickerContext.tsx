import React from 'react'
import FilePickerFilePreviewAsIcon from './FilePickerFilePreviewAsIcon'
import {mdiFileExcelOutline, mdiFileOutline, mdiFileWordOutline} from '@mdi/js'
import {FilePickerContextProps, FilePickerTranslations} from '../../types/FilePicker'
import {mdiFilePdfOutline} from '../../helpers/icons'

// Стандартная локализация таблицы.
export const filePickerDefaultTranslations: FilePickerTranslations = {
    file_size: 'Size',
    error_label: 'Error',
    error: {
        mime_type_forbidden: (extension: string) => `Files of type ${extension} are forbidden.`,
        mime_type_and_extension_mismatch: (extension: string, type: string) => `File extension (${extension}) does not match its type (${type}).`,
        already_attached: (name: string) => `File ${name} is already attached.`,
        too_many_files: (limit: number) => `Attachments limit reached: ${limit}.`,
        file_too_large: (maxSizeMb: number) => `File size exceeds the limit of ${maxSizeMb} MB.`,
        server_error: 'Unknown error happened while saving the file.',
        unexpected_error: 'Failed to process and save the file.',
        non_json_validation_error: 'The file has failed server-side validation.',
        invalid_response: 'Invalid responce was received from server.',
        invalid_file: (fileName: string, error: string) => `Error happened while attaching file ${fileName}: ${error}`,
        internal_error_during_upload: 'Unexpected error happened during file processing. File contents might be corrupted.',
        internal_error_in_xhr: 'Unexpected error happened while sending file to server.',
        timed_out: 'File upload has timed out. Maybe you internet connection is too slow.',
        failed_to_get_file_blob: 'Failed to get file contents to upload to server.',
        failed_to_resize_image: 'Failed to process image before uploading it to server.',
        http401: 'Authentication error. Please login into your account.',
    },
    status: {
        uploaded: 'The file was uploaded to server',
        not_uploaded: 'The file is not uploaded to server yet',
        uploading: (uploadedPercent: number) => `Uploading the file: ${uploadedPercent}%`,
    },
    attach_file: 'Attach file',
    not_all_valid_files_uploaded: 'Filed to upload some of the attached files to server. Fix errors or detach files with errors.',
    internal_error_during_files_uploading: 'Unexpected error happened while uploading files to server. Maybe some files are corruped and cannot be uploaded.',
    file_will_be_deleted: 'File will be deleted after form is saved.',
    restore: 'Restore file.',
}

// Контекст компонентов прикрепления файлов.
export const FilePickerContextPropsDefaults: Readonly<Required<FilePickerContextProps>> = {
    translations: filePickerDefaultTranslations,
    maxFiles: null,
    previews: {
        'image/jpeg': {
            type: 'image',
            extensions: ['jpg', 'jpeg'],
            preview: 'image',
        },
        'image/png': {
            type: 'image',
            extensions: ['png'],
            preview: 'image',
        },
        'image/svg+xml': {
            type: 'image',
            extensions: ['svg'],
            preview: 'image',
        },
        'application/pdf': {
            type: 'document',
            extensions: ['pdf'],
            preview(previewWidth: number) {
                return (
                    <FilePickerFilePreviewAsIcon
                        path={mdiFilePdfOutline}
                        className="text-red"
                        previewSize={previewWidth}
                    />
                )
            },
        },
        'application/msword': {
            type: 'document',
            extensions: ['doc'],
            preview(previewWidth: number) {
                return (
                    <FilePickerFilePreviewAsIcon
                        path={mdiFileWordOutline}
                        className="text-blue"
                        previewSize={previewWidth}
                    />
                )
            },
        },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            type: 'document',
            extensions: ['docx'],
            preview(previewWidth: number) {
                return (
                    <FilePickerFilePreviewAsIcon
                        path={mdiFileWordOutline}
                        className="text-blue"
                        previewSize={previewWidth}
                    />
                )
            },
        },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
            type: 'document',
            extensions: ['xlsx'],
            preview(previewWidth: number) {
                return (
                    <FilePickerFilePreviewAsIcon
                        path={mdiFileExcelOutline}
                        className="text-green"
                        previewSize={previewWidth}
                    />
                )
            },
        },
        'text/csv': {
            type: 'document',
            extensions: ['csv'],
            preview(previewWidth: number) {
                return (
                    <FilePickerFilePreviewAsIcon
                        path={mdiFileExcelOutline}
                        className="text-green"
                        previewSize={previewWidth}
                    />
                )
            },
        },
    },
    fallbackPreview(previewWidth: number) {
        return (
            <FilePickerFilePreviewAsIcon
                path={mdiFileOutline}
                className="text-muted"
                previewSize={previewWidth}
            />
        )
    },
    canAttachMoreFiles() {
        return true
    },
    pickFile() {
    },
    onFileDelete() {
    },
    existingFiles: [],
    onExistingFileDelete() {
    },
    files: [],
    reorderable: false,
    getNextFilePosition: () => 0,
    isUploading: false,
    isDisabled: false,
    startUploading() {
        return Promise.reject(new Error('unknown'))
    },
}

const FilePickerContext = React.createContext<FilePickerContextProps>(FilePickerContextPropsDefaults)

export default FilePickerContext
