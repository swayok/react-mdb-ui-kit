import clsx from 'clsx'
import {InputGroupTextProps} from './InputTypes'

// Текст для вставки в <InputGroup>.
export function InputGroupText(props: InputGroupTextProps) {
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
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default InputGroupText
