import clsx from 'clsx'
import React from 'react'
import {CardHeaderProps} from './CardTypes'

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
