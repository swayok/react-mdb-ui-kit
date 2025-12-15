import clsx from 'clsx'
import {CardFooterProps} from './CardTypes'

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
