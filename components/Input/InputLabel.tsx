import clsx from 'clsx'
import {InputLabelProps} from './InputTypes'

// Подпись для поля ввода.
export function InputLabel(props: InputLabelProps) {

    const {
        label,
        inputId,
        className,
        invalid,
        ...labelProps
    } = props

    if (!label || label.length === 0) {
        return null
    }

    return (
        <label
            {...labelProps}
            className={clsx('form-label', className)}
            htmlFor={inputId}
        >
            {label}
        </label>
    )
}
