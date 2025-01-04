import clsx from 'clsx'
import React from 'react'
import {BackgroundColors, ComponentPropsWithModifiableTag} from '../types/Common'

export interface BadgeProps extends ComponentPropsWithModifiableTag {
    pill?: boolean,
    dot?: boolean,
    notification?: boolean,
    color?: BackgroundColors,
    large?: boolean
}

// Элемент, стилизованный под небольшой блок с фоном и текстом или числом (кол-во, теги и т.п.)
function Badge(props: BadgeProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        color,
        pill,
        dot,
        large,
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
        large ? 'badge-lg' : null,
        className
    )

    return (
        <Tag
            className={classes}
            ref={ref}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLAllCollection, BadgeProps>(Badge))
