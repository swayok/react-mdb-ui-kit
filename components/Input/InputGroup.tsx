import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from 'swayok-react-mdb-ui-kit/types/Common'

export interface InputGroupProps extends ComponentPropsWithModifiableTag {
    noWrap?: boolean
}

// Группа для объединения поля ввода и дополнений к нему (кнопки, подписи, иконки).
function InputGroup(props: InputGroupProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className = 'mb-4',
        children,
        noWrap,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const classes = clsx(
        'input-group',
        noWrap ? 'flex-nowrap' : null,
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

export default React.memo(React.forwardRef<HTMLAllCollection, InputGroupProps>(InputGroup))
