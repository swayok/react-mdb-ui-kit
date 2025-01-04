import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export interface InputGroupTextProps extends ComponentPropsWithModifiableTag {
    noBorder?: boolean,
}

// Текст для вставки в <InputGroup>.
function InputGroupText(props: InputGroupTextProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        noBorder,
        tag,
        ...otherProps
    } = props

    const classes = clsx(
        'input-group-text',
        noBorder ? 'border-0' : null,
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

export default React.memo(React.forwardRef<HTMLAllCollection, InputGroupTextProps>(InputGroupText))
