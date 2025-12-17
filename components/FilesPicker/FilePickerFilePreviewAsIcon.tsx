import {FileAPISelectedFileInfo} from '../../helpers/FileAPI/FileAPI'
import {
    IconProps,
    Icon,
} from '../Icon'

interface Props extends Omit<IconProps, 'label'> {
    // Размер предпросмотра для определения размера иконки (1/3 от previewSize, максимум 50).
    previewSize: number
    fileData?: FileAPISelectedFileInfo
}

// Иконка для предпросмотра прикрепленного файла (если не картинка).
export function FilePickerFilePreviewAsIcon(props: Props) {

    const {
        previewSize,
        fileData,
        ...iconProps
    } = props

    const icon = (
        <Icon
            size={Math.max(50, Math.round(previewSize / 3))}
            {...iconProps}
        />
    )
    const className = 'd-flex flex-column align-items-center justify-content-center'
    if (fileData?.previewDataUrl) {
        return (
            <a
                className={className}
                href={fileData?.previewDataUrl}
                target="_blank"
                rel="noreferrer"
            >
                {icon}
            </a>
        )
    }
    return (
        <div className={className}>
            {icon}
        </div>
    )
}
