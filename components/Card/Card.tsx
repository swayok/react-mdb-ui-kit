import clsx from 'clsx'
import React from 'react'
import {
    BackgroundColors,
    BorderColors,
    ComponentPropsWithModifiableTagAndRef,
} from '../../types'

export interface CardProps extends ComponentPropsWithModifiableTagAndRef {
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

// Контейнер каточки (блок с белым фоном, скругленными углами и тенью).
// Структура:
// Card
//      CardHeader
//          CardTitle
//              Текст заголовка
//      CardBody
//          Содержимое карточки
//      CardFooter
//          Кнопки или другие элементы
export function Card(props: CardProps) {
    const {
        className,
        children,
        border,
        borderColor,
        background,
        tag: Tag = 'div',
        shadow,
        alignment,
        ...otherProps
    } = props

    const classes = clsx(
        'card',
        border ? `border border-${border}` : null,
        border && borderColor ? `border-${borderColor}` : null,
        background ? `bg-${background}` : null,
        shadow ? `shadow-${shadow}` : null,
        alignment ? `text-${alignment}` : null,
        className
    )

    return (
        <Tag
            className={classes}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default CardProps
