import clsx from 'clsx'
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
