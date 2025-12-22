import {
    mdiImageBroken,
    mdiImageFrame,
} from '@mdi/js'
import clsx from 'clsx'
import {
    CSSProperties,
    useEffect,
    useRef,
    useState,
} from 'react'
import {FileApiImageManipulation} from '../../helpers/file_api/FileApiImageManipulation'
import {Icon} from '../Icon/Icon'
import {
    FilePickerFileInfo,
    FilePickerPreviewSizes,
} from './FilePickerTypes'

interface Props {
    file: FilePickerFileInfo
    sizes: FilePickerPreviewSizes
    borderRadius?: number | null
    className?: string
    style?: CSSProperties
}

// Предпросмотр прикрепленной картинки.
export function FilePickerFilePreviewImage(props: Props) {
    const {
        file,
        sizes,
        borderRadius = 6,
        className = 'd-flex flex-row align-items-stretch',
        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)

    const [
        isImagePreviewError,
        setImagePreviewError,
    ] = useState<boolean>(false)

    // Создание предпросмотра картинки.
    useEffect(() => {
        if (!containerRef.current) {
            return
        }
        if (!file.file.previewDataUrl) {
            const longestSide = sizes.width > sizes.height ? sizes.width : sizes.height
            new FileApiImageManipulation(file.file)
                // *2 для нормального качества широких или высоких картинок
                .setMaxSize(Math.round(longestSide * 2))
                .getCanvas()
                .then((img: HTMLCanvasElement) => {
                    if (containerRef.current) {
                        file.file.previewDataUrl = img.toDataURL()
                        containerRef.current.innerHTML = ''
                        containerRef.current.style.backgroundImage = `url("${file.file.previewDataUrl}")`
                    }
                })
                .catch((error: unknown) => {
                    console.log('[FilePickerFilePreview] preview error: ', error)
                    setImagePreviewError(true)
                })
        } else {
            containerRef.current.innerHTML = ''
            containerRef.current.style.backgroundImage = `url("${file.file.previewDataUrl}")`
        }
    }, [containerRef.current, file.file.previewDataUrl])

    return (
        <div
            className={clsx(
                'file-picker-preview-image',
                borderRadius ? 'rounded-' + borderRadius : null,
                className
            )}
            ref={containerRef}
            style={sizes}
        >
            <div
                className="file-picker-preview-image-placeholder d-flex align-items-center justify-content-center"
                style={{
                    ...sizes,
                    ...style,
                }}
            >
                <Icon
                    path={isImagePreviewError ? mdiImageBroken : mdiImageFrame}
                    size={32}
                    color={isImagePreviewError ? 'danger' : 'muted'}
                />
            </div>
        </div>
    )
}
