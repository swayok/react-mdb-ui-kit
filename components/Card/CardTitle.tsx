import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export type CardTitleProps = ComponentPropsWithModifiableTag

// Заголовок карточки
function CardTitle(props: CardTitleProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        tag,
        ...otherProps
    } = props

    const Tag = tag || 'div'

    return (
        <Tag
            className={clsx('card-title', className)}
            {...otherProps}
            ref={ref}
        >
            {children}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLAllCollection, CardTitleProps>(CardTitle))
