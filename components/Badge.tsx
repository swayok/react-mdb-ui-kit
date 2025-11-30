import clsx from 'clsx'
import React from 'react'
import {
    AnyRefObject,
    BackgroundColors,
    ComponentPropsWithModifiableTag,
} from 'swayok-react-mdb-ui-kit/types/Common'

export interface BadgeProps extends ComponentPropsWithModifiableTag {
    pill?: boolean,
    dot?: boolean,
    notification?: boolean,
    color?: BackgroundColors,
    ref?: AnyRefObject<HTMLAllCollection>
}

// Элемент, стилизованный под небольшой блок с фоном и текстом или числом (кол-во, теги и т.п.)
export function Badge(props: BadgeProps) {
    const {
        className,
        color,
        pill,
        dot,
        tag: Tag = 'span',
        children,
        notification,
        ...otherProps
    } = props

    const classes = clsx(
        'badge',
        color ? 'bg-' + color : 'bg-primary',
        dot ? 'badge-dot' : null,
        pill ? 'rounded-pill' : null,
        notification ? 'badge-notification' : null,
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
export default Badge
