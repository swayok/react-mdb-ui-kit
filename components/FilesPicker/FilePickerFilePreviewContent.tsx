import clsx from 'clsx'
import React, {CSSProperties, useContext} from 'react'
import FilePickerContext from './FilePickerContext'
import {FilePickerFilePreviewFile} from './FilePickerFilePreviewFile'
import {FilePickerFilePreviewImage} from './FilePickerFilePreviewImage'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerPreviewSizes,
} from '../../types/FilePicker'

interface Props {
    file: FilePickerFileInfo
    previewSizes: FilePickerPreviewSizes
    imagePreviewSize: number | FilePickerPreviewSizes
    borderRadius?: number | null
    className?: string
    additionalClassName?: string
    imageClassName?: string
    fileClassName?: string
    allowFileNameTooltip?: boolean
    style?: CSSProperties
}

// Предпросмотр прикрепленного файла или картинки.
export const FilePickerFilePreviewContent = React.memo(function FilePickerFilePreviewContent(props: Props) {
    const {
        previews,
        fallbackPreview,
    } = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        file,
        previewSizes,
        imagePreviewSize,
        borderRadius = 6,
        className = 'd-flex align-items-center justify-content-center',
        additionalClassName,
        imageClassName,
        fileClassName,
        allowFileNameTooltip,
        style,
    } = props

    const previewInfo: FilePickerContextMimeTypeInfo = previews[file.file.type] ?? {
        mime: '',
        type: 'file',
        extensions: [],
        preview: fallbackPreview,
    } as FilePickerContextMimeTypeInfo

    // noinspection SuspiciousTypeOfGuard
    const imagePreviewSizes: FilePickerPreviewSizes = typeof imagePreviewSize === 'number'
        ? {width: imagePreviewSize, height: imagePreviewSize}
        : imagePreviewSize

    return (
        <div
            className={clsx(
                'file-picker-preview',
                previewInfo.preview === 'image'
                    ? 'file-picker-preview-for-image'
                    : 'file-picker-preview-for-file',
                className,
                additionalClassName,
                previewInfo.preview === 'image' ? imageClassName : null
            )}
            style={previewSizes}
        >
            {previewInfo.preview === 'image' ? (
                <FilePickerFilePreviewImage
                    file={file}
                    sizes={imagePreviewSizes}
                    style={style}
                    borderRadius={borderRadius}
                />
            ) : (
                <FilePickerFilePreviewFile
                    file={file}
                    sizes={previewSizes}
                    renderer={previewInfo.preview}
                    borderRadius={borderRadius}
                    allowFileNameTooltip={allowFileNameTooltip}
                    style={style}
                    additionalClassName={fileClassName}
                />
            )}
        </div>
    )
})
