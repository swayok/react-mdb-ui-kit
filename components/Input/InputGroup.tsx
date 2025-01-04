import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export interface InputGroupProps extends ComponentPropsWithModifiableTag {
    noWrap?: boolean,
    small?: boolean,
    large?: boolean,
}

// Группа для объединения поля ввода и дополнений к нему (кнопки, подписи, иконки).
function InputGroup(props: InputGroupProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        noWrap,
        tag,
        small,
        large,
        ...otherProps
    } = props

    const classes = clsx(
        'input-group',
        noWrap ? 'flex-nowrap' : null,
        small && !large ? 'input-group-sm' : null,
        large && !small ? 'input-group-sm' : null,
        className
    )

    const Tag = tag || 'div'

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

export default React.memo(React.forwardRef<HTMLAllCollection, InputGroupProps>(InputGroup))
