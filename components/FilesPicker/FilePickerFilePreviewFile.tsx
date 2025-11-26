import clsx from 'clsx'
import React, {CSSProperties} from 'react'
import {
    FilePickerContextMimeTypePreviewRenderer,
    FilePickerFileInfo,
    FilePickerPreviewSizes,
} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
import Tooltip from '../Tooltip'
import FilePickerHelpers from './FilePickerHelpers'

interface Props {
    file: FilePickerFileInfo
    sizes: FilePickerPreviewSizes
    renderer: FilePickerContextMimeTypePreviewRenderer
    borderRadius?: number | null
    className?: string
    additionalClassName?: string
    allowFileNameTooltip?: boolean
    style?: CSSProperties
}

// Предпросмотр прикрепленного файла.
export const FilePickerFilePreviewFile = React.memo(function FilePickerFilePreviewFile(props: Props) {
    const {
        file,
        sizes,
        renderer,
        borderRadius = 6,
        allowFileNameTooltip,
        className = 'd-flex flex-row align-items-stretch justify-content-center',
        additionalClassName,
        style,
    } = props

    return (
        <Tooltip
            tag="div"
            title={
                allowFileNameTooltip
                    ? file.file.name + (file.file.size > 0 ? ' (' + FilePickerHelpers.getFileSizeMb(file) + 'MB)' : '')
                    : undefined
            }
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
            {renderer(sizes.width, file.file.name, file.file)}
        </Tooltip>
    )
})
