import type {AllHTMLAttributes} from 'react'
import type {
    AnyRefObject,
    BackgroundColors,
} from '../../types'

export interface ProgressProps extends AllHTMLAttributes<HTMLDivElement> {
    ref?: AnyRefObject<HTMLDivElement>
    // Высота полосы
    height?: number | string
}

export interface ProgressBarProps extends AllHTMLAttributes<HTMLDivElement> {
    ref?: AnyRefObject<HTMLDivElement>
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
