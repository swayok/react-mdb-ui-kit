import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export interface InputGroupTextProps extends ComponentPropsWithModifiableTag {
    noBorder?: boolean
    small?: boolean
    large?: boolean
}

// Текст для вставки в <InputGroup>.
function InputGroupText(props: InputGroupTextProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        noBorder,
        small,
        large,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const classes = clsx(
        'input-group-text',
        noBorder ? 'border-0' : null,
        small && !large ? 'input-group-text-sm' : null,
        !small && large ? 'input-group-text-lg' : null,
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

export default React.memo(React.forwardRef<HTMLAllCollection, InputGroupTextProps>(InputGroupText))
