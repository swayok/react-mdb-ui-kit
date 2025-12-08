import type {
    CssGridColumnsConfig,
    HtmlComponentProps,
} from '../../types'

// Свойства предпросмотрщика изображений.
export interface ImagesPreviewerProps extends HtmlComponentProps<HTMLDivElement> {
    images: string[]
    alt?: string
    // Настройка количества колонок в списке миниатюр для каждого размера экрана.
    previewsColumns?: CssGridColumnsConfig
}

// Свойства просмотрщика изображений в модальном окне.
export interface ImagesCarouselModalProps {
    images: string[]
    currentIndex?: number
    show: boolean | null
    id?: string
    depth?: number
    onClose: () => void
    onClosed?: () => void
    onIndexChange?: (newIndex: number) => void
}
