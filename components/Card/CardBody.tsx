import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export type CardBodyProps = ComponentPropsWithModifiableTag

// Контейнер содержимого карточки
function CardBody(props: CardBodyProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        tag,
        ...otherProps
    } = props

    const Tag = tag || 'div'

    return (
        <Tag
            className={clsx('card-body', className)}
            {...otherProps}
            ref={ref}
        >
            {children}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLAllCollection, CardBodyProps>(CardBody))
