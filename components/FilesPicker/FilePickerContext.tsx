import {mdiFileExcelOutline, mdiFileOutline, mdiFileWordOutline, mdiVolumeHigh} from '@mdi/js'
import React from 'react'
import FilePickerAudioFilePreview from './FilePickerAudioFilePreview'
import {FileAPISelectedFileInfo} from '../../helpers/FileAPI/FileAPI'
import file_picker from '../../locales/en/file_picker'
import {mdiFilePdfOutline} from '../../helpers/icons'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {FilePickerContextMimeTypeInfo, FilePickerContextProps, FilePickerTranslations} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
import FilePickerFilePreviewAsIcon from './FilePickerFilePreviewAsIcon'

// Стандартная локализация таблицы.
export const filePickerDefaultTranslations: FilePickerTranslations = file_picker

// Стандартный набор настроек предпросмотра прикрепленных файлов в зависимости от типа.
export const filePickerDefaultPreviews: AnyObject<FilePickerContextMimeTypeInfo> = {
    'image/jpeg': {
        mime: 'image/jpeg',
        type: 'image',
        extensions: ['jpg', 'jpeg'],
        preview: 'image',
    },
    'image/png': {
        mime: 'image/png',
        type: 'image',
        extensions: ['png'],
        preview: 'image',
    },
    'image/avif': {
        mime: 'image/avif',
        type: 'image',
        extensions: ['avif'],
        preview: 'image',
    },
    'image/webp': {
        mime: 'image/webp',
        type: 'image',
        extensions: ['webp'],
        preview: 'image',
    },
    'image/svg+xml': {
        mime: 'image/svg+xml',
        type: 'image',
        extensions: ['svg'],
        preview: 'image',
    },
    'application/pdf': {
        mime: 'application/pdf',
        type: 'document',
        extensions: ['pdf'],
        preview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
            return (
                <FilePickerFilePreviewAsIcon
                    path={mdiFilePdfOutline}
                    color="red"
                    previewSize={previewWidth}
                    fileData={fileData}
                />
            )
        },
    },
    'application/msword': {
        mime: 'application/msword',
        type: 'document',
        extensions: ['doc'],
        preview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
            return (
                <FilePickerFilePreviewAsIcon
                    path={mdiFileWordOutline}
                    color="blue"
                    previewSize={previewWidth}
                    fileData={fileData}
                />
            )
        },
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        type: 'document',
        extensions: ['docx'],
        preview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
            return (
                <FilePickerFilePreviewAsIcon
                    path={mdiFileWordOutline}
                    color="blue"
                    previewSize={previewWidth}
                    fileData={fileData}
                />
            )
        },
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        type: 'document',
        extensions: ['xlsx'],
        preview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
            return (
                <FilePickerFilePreviewAsIcon
                    path={mdiFileExcelOutline}
                    color="green"
                    previewSize={previewWidth}
                    fileData={fileData}
                />
            )
        },
    },
    'text/csv': {
        mime: 'text/csv',
        type: 'document',
        extensions: ['csv'],
        preview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
            return (
                <FilePickerFilePreviewAsIcon
                    path={mdiFileExcelOutline}
                    color="green"
                    previewSize={previewWidth}
                    fileData={fileData}
                />
            )
        },
    },
    'audio/mpeg': {
        mime: 'audio/mpeg',
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
    fallbackPreview(previewWidth: number, _fileName: string, fileData: FileAPISelectedFileInfo) {
        return (
            <FilePickerFilePreviewAsIcon
                path={mdiFileOutline}
                color="muted"
                previewSize={previewWidth}
                fileData={fileData}
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
