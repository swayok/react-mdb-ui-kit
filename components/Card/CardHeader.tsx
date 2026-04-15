import clsx from 'clsx'
import type {CardHeaderProps} from './CardTypes'

// Шапка карточки.
export function CardHeader(props: CardHeaderProps) {
    const {
        className,
        children,
        border,
        borderColor,
        background,
        flexRow,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const classes = clsx(
        'card-header',
        border !== undefined ? `border-${border}` : null,
        border !== undefined && borderColor ? `border-${borderColor}` : null,
        background ? `bg-${background}` : null,
        flexRow ? `d-flex flex-row justify-content-${flexRow}` : null,
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
