import type {
    AllHTMLAttributes,
    RefObject,
} from 'react'
import type {
    ButtonColors,
    ComponentPropsWithModifiableTag,
} from '../../types'

// Свойства компонента Ripple.
export interface RippleProps extends ComponentPropsWithModifiableTag {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: RefObject<any>
    // Может ли волна выйти за границы нажатого элемента?
    unbound?: boolean
    // Цвет волны.
    color?: ButtonColors
    // Минимальный радиус волны.
    minRadius?: number
    // Фиксированный радиус волны.
    radius?: number
    // Длительность анимации.
    duration?: number
    // Центрирование относительно кнопки, а не относительно курсора.
    centered?: boolean
    // Отключить?
    noRipple?: boolean
}

// Стили волны.
export interface RippleWaveStyle {
    left: string
    top: string
    height: string
    width: string
    transitionDelay: string
    transitionDuration: string
    backgroundImage?: string
}

// Размеры и позиция волны.
export interface RipplePositionAndDimensions {
    offsetX: number
    offsetY: number
    height: number
    width: number
}

// Свойства компонента RippleWave.
export type RippleWaveProps = AllHTMLAttributes<HTMLDivElement>
