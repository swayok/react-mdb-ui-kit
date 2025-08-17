import React from 'react'
import FilePickerFilePreviewAsIcon from './FilePickerFilePreviewAsIcon'
import {mdiFileExcelOutline, mdiFileOutline, mdiFileWordOutline, mdiVolumeHigh} from '@mdi/js'
import {FilePickerContextProps, FilePickerTranslations} from '../../types/FilePicker'
import {mdiFilePdfOutline} from '../../helpers/icons'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {FilePickerContextMimeTypeInfo} from 'swayok-react-mdb-ui-kit/types/FilePicker'
import {FileAPISelectedFileInfo} from 'swayok-react-mdb-ui-kit/helpers/FileAPI/FileAPI'
import FilePickerAudioFilePreview from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerAudioFilePreview'
import file_picker from 'swayok-react-mdb-ui-kit/locales/en/file_picker'

// Стандартная локализация таблицы.
export const filePickerDefaultTranslations: FilePickerTranslations = file_picker

// Стандартный набор настроек пердпросмотра прикрепленных файлов в зависимости от типа.
export const filePickerDefaultPreviews: AnyObject<FilePickerContextMimeTypeInfo> = {
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
                    color="red"
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
                    color="blue"
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
                    color="blue"
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
                    color="green"
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
                    color="green"
                    previewSize={previewWidth}
                />
            )
        },
    },
    'audio/mpeg': {
        type: 'audio',
        extensions: ['mp3'],
        preview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
            return (
                <FilePickerAudioFilePreview
                    path={mdiVolumeHigh}
                    color="blue"
                    previewSize={previewWidth}
                    fileData={fileData}
                />
            )
        },
    },
}

// Контекст компонентов прикрепления файлов.
export const FilePickerContextPropsDefaults: Readonly<Required<FilePickerContextProps>> = {
    translations: filePickerDefaultTranslations,
    maxFiles: null,
    previews: filePickerDefaultPreviews,
    fallbackPreview(previewWidth: number) {
        return (
            <FilePickerFilePreviewAsIcon
                path={mdiFileOutline}
                color="muted"
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
    onExistingFileRestore: null,
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
