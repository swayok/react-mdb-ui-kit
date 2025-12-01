import clsx from 'clsx'
import React from 'react'
import {
    BackgroundColors,
    BorderColors,
    ComponentPropsWithModifiableTagAndRef,
} from '../../types'

export interface CardFooterProps extends ComponentPropsWithModifiableTagAndRef {
    // Толщина верхней границы: 0, 1, 2, 3, 4, 5.
    border?: number
    // Цвет границы.
    borderColor?: BorderColors
    // Цвет фона.
    background?: BackgroundColors
}

// Подвал карточки.
export function CardFooter(props: CardFooterProps) {
    const {
        className,
        children,
        border,
        borderColor,
        background,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const classes = clsx(
        'card-footer',
        border ? `border-${border}` : null,
        border && borderColor ? `border-${borderColor}` : null,
        background ? `bg-${background}` : null,
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
export default CardFooter
