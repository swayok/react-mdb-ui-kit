import clsx from 'clsx'
import React, {CSSProperties} from 'react'
import {
    FilePickerContextMimeTypePreviewRenderer,
    FilePickerFileInfo,
    FilePickerPreviewSizes,
} from 'swayok-react-mdb-ui-kit/types/FilePicker'

interface Props {
    file: FilePickerFileInfo
    sizes: FilePickerPreviewSizes
    renderer: FilePickerContextMimeTypePreviewRenderer
    borderRadius?: number | null
    className?: string
    additionalClassName?: string
    style?: CSSProperties
}

// Предпросмотр прикрепленного файла.
export const FilePickerFilePreviewFile = React.memo(function FilePickerFilePreviewFile(props: Props) {
    const {
        file,
        sizes,
        renderer,
        borderRadius = 6,
        className = 'd-flex flex-row align-items-stretch',
        additionalClassName,
        style,
    } = props

    return (
        <div
            className={clsx(
                'file-picker-preview-file',
                borderRadius ? 'rounded-' + borderRadius : null,
                className,
                additionalClassName
            )}
            style={{
                ...sizes,
                ...style,
            }}
        >
            {renderer(sizes.width, file.file.name)}
        </div>
    )
})
