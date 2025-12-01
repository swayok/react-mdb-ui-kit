import clsx from 'clsx'
import React from 'react'
import {ComponentPropsWithModifiableTagAndRef} from '../../types'

export type CardTitleProps = ComponentPropsWithModifiableTagAndRef

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
