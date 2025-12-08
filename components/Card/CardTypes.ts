import type {
    BackgroundColors,
    BorderColors,
    MorphingHtmlComponentProps,
} from '../../types'

// Свойства компонента Card.
export interface CardProps extends MorphingHtmlComponentProps {
    // Толщина границы: 0, 1, 2, 3, 4, 5.
    border?: number
    // Цвет границы.
    borderColor?: BorderColors
    // Цвет фона.
    background?: BackgroundColors
    // Тень: inner, 0, 1, 2, 3, 4, 5, 6.
    // Суффиксы: '{w}-soft' ('2-soft'), '{w}-strong' ('2-strong').
    shadow?: number | string
    // Расположение текста в карточке.
    alignment?: 'end' | 'center' | 'start'
}

// Свойства компонента CardBody.
export type CardBodyProps = MorphingHtmlComponentProps

// Свойства компонента CardFooter.
export interface CardFooterProps extends MorphingHtmlComponentProps {
    // Толщина верхней границы: 0, 1, 2, 3, 4, 5.
    border?: number
    // Цвет границы.
    borderColor?: BorderColors
    // Цвет фона.
    background?: BackgroundColors
}

// Свойства компонента CardHeader.
export interface CardHeaderProps extends MorphingHtmlComponentProps {
    // Толщина нижней границы: 0, 1, 2, 3, 4, 5.
    border?: number
    // Цвет границы.
    borderColor?: BorderColors
    // Цвет фона.
    background?: BackgroundColors
}

// Свойства компонента CardTitle.
export type CardTitleProps = MorphingHtmlComponentProps
