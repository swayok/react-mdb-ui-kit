import {AllHTMLAttributes} from 'react'

// Свойства предпросмотрщика изображений.
export interface ImagesPreviewerProps extends AllHTMLAttributes<HTMLDivElement> {
    images: string[],
    alt?: string,
    // Настройка количества колонок в списке миниатюр для каждого размера экрана.
    previewsColumns?: {
        xs?: number,
        sm?: number,
        md?: number,
        lg?: number,
        xl?: number,
        xxl?: number,
    }
}

// Свойства просмотрщика изображений в модальном окне.
export interface ImagesCarouselModalProps {
    images: string[],
    currentIndex?: number,
    show: boolean | null,
    id?: string,
    depth?: number,
    onClose: () => void,
    onClosed?: () => void,
    onIndexChange?: (newIndex: number) => void,
}
