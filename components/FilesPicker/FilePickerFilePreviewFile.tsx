import clsx from 'clsx'
import {CSSProperties} from 'react'
import {Tooltip} from '../Tooltip/Tooltip'
import {FilePickerHelpers} from './FilePickerHelpers'
import {
    FilePickerContextMimeTypePreviewRenderer,
    FilePickerFileInfo,
    FilePickerPreviewSizes,
} from './FilePickerTypes'

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
export function FilePickerFilePreviewFile(props: Props) {
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
}
