import clsx from 'clsx'
import React from 'react'
import {CardTitleProps} from './CardTypes'

// Заголовок карточки.
export function CardTitle(props: CardTitleProps) {
    const {
        className,
        children,
        tag: Tag = 'div',
        ...otherProps
    } = props

    return (
        <Tag
            className={clsx('card-title', className)}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default CardTitle
