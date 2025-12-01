import clsx from 'clsx'
import React from 'react'
import {
    BackgroundColors,
    BorderColors,
    ComponentPropsWithModifiableTagAndRef,
} from '../../types'

export interface CardHeaderProps extends ComponentPropsWithModifiableTagAndRef {
    // Толщина нижней границы: 0, 1, 2, 3, 4, 5.
    border?: number
    // Цвет границы.
    borderColor?: BorderColors
    // Цвет фона.
    background?: BackgroundColors
}

// Шапка карточки.
export function CardHeader(props: CardHeaderProps) {
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
        'card-header',
        border !== undefined ? `border-${border}` : null,
        border !== undefined && borderColor ? `border-${borderColor}` : null,
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
export default CardHeader
