import clsx from 'clsx'
import type {CardTitleProps} from './CardTypes'

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
