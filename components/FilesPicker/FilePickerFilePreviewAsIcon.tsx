import React from 'react'
import Icon, {AppIconProps} from '../Icon'

interface Props extends Omit<AppIconProps, 'label'> {
    // Размер предпросмотра для определения размера иконки (1/3 от previewSize, максимум 50).
    previewSize: number,
}

// Иконка для предпросмотра прикрепленного файла (если не картинка).
function FilePickerFilePreviewAsIcon(props: Props) {

    const {
        previewSize,
        ...iconProps
    } = props

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <Icon size={Math.max(50, Math.round(previewSize / 3))} {...iconProps} />
        </div>
    )
}

export default React.memo(FilePickerFilePreviewAsIcon)
