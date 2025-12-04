import clsx from 'clsx'
import {InputGroupProps} from './InputTypes'

// Группа для объединения поля ввода и дополнений к нему (кнопки, подписи, иконки).
export function InputGroup(props: InputGroupProps) {
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
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default InputGroup
