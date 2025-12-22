import {useMemo} from 'react'
import {FileAPISelectedFileInfo} from '../../helpers/file_api/FileAPI'
import {
    IconProps,
    Icon,
} from '../Icon/Icon'

interface Props extends Omit<IconProps, 'label'> {
    // Размер предпросмотра для определения размера иконки (1/3 от previewSize, максимум 50).
    previewSize: number
    fileData: FileAPISelectedFileInfo
}

// Иконка для предпросмотра прикрепленного файла (если не картинка).
export function FilePickerAudioFilePreview(props: Props) {

    const {
        previewSize,
        fileData,
        ...iconProps
    } = props

    const audio = useMemo(() => {
        const blobUrl = fileData.previewDataUrl ?? URL.createObjectURL(fileData)
        return new Audio(blobUrl)
    }, [fileData])

    return (
        <div
            className="clickable d-flex flex-column align-items-center justify-content-center"
            onClick={() => {
                audio.currentTime = 0
                void audio.play()
            }}
        >
            <Icon
                size={Math.max(50, Math.round(previewSize / 3))}
                {...iconProps}
            />
        </div>
    )
}
