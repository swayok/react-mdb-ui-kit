import type {
    AnyRef,
    BackgroundColors,
    HtmlComponentProps,
} from '../../types'

export interface ProgressProps extends HtmlComponentProps<HTMLDivElement> {
    ref?: AnyRef<HTMLDivElement>
    // Высота полосы
    height?: number | string
}

export interface ProgressBarProps extends HtmlComponentProps<HTMLDivElement> {
    ref?: AnyRef<HTMLDivElement>
    // Анимация.
    animated?: boolean
    // Цвет.
    color?: BackgroundColors
    // С полосками?
    striped?: boolean
    // Текущее значение (при minValue=0 и maxValue=100 - аналог процента).
    currentValue: number
    // Минимальное значение (по умолчанию: 0).
    minValue?: number
    // Максимальное значение (по умолчанию: 100).
    maxValue?: number
}
