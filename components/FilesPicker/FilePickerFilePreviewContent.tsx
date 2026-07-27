import clsx from 'clsx'
import {
    type CSSProperties,
    type ReactNode,
} from 'react'
import {useFilePickerContext} from './FilePickerContext'
import {FilePickerFilePreviewFile} from './FilePickerFilePreviewFile'
import {FilePickerFilePreviewImage} from './FilePickerFilePreviewImage'
import type {
    FilePickerContextMimeTypePreviewRenderer,
    FilePickerFileInfo,
    FilePickerPreviewSizes,
} from './FilePickerTypes'

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
export function FilePickerFilePreviewContent(props: Props) {
    const {
        previews,
        fallbackPreview,
    } = useFilePickerContext()

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

    let content: ReactNode
    if (file.file.isImage) {
        content = (
            <FilePickerFilePreviewImage
                file={file}
                sizes={typeof imagePreviewSize === 'number'
                    ? {width: imagePreviewSize, height: imagePreviewSize}
                    : imagePreviewSize}
                style={style}
                borderRadius={borderRadius}
            />
        )
    } else {
        content = (
            <FilePickerFilePreviewFile
                file={file}
                sizes={previewSizes}
                renderer={
                    previews[file.file.mimeType ?? file.file.type]?.preview as FilePickerContextMimeTypePreviewRenderer
                    ?? fallbackPreview
                }
                borderRadius={borderRadius}
                allowFileNameTooltip={allowFileNameTooltip}
                style={style}
                additionalClassName={fileClassName}
            />
        )
    }

    return (
        <div
            className={clsx(
                'file-picker-preview',
                file.file.isImage
                    ? 'file-picker-preview-for-image'
                    : 'file-picker-preview-for-file',
                className,
                additionalClassName,
                file.file.isImage ? imageClassName : null
            )}
            style={previewSizes}
        >
            {content}
        </div>
    )
}
