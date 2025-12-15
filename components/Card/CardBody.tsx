import clsx from 'clsx'
import {CardBodyProps} from './CardTypes'

// Контейнер содержимого карточки
export function CardBody(props: CardBodyProps) {
    const {
        className,
        children,
        tag: Tag = 'div',
        ...otherProps
    } = props

    return (
        <Tag
            className={clsx('card-body', className)}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default CardBody
