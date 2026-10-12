import type {ChangeEvent} from 'react'
import {Input} from './Input'
import type {IntegerInputProps} from './InputTypes'

// Поле ввода целого числа.
export function IntegerInput(props: IntegerInputProps) {

    const {
        value,
        allowNegative,
        min,
        max,
        children,
        onChange,
        ...otherInputProps
    } = props

    return (
        <Input
            {...otherInputProps}
            allowedChars={allowNegative ? /([0-9]|^-)/ : /[0-9]/}
            value={String(value ?? '')}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (otherInputProps.readOnly || otherInputProps.disabled) {
                    event.preventDefault()
                    return
                }
                const rawValue: string = event.currentTarget.value
                if (rawValue === '') {
                    onChange(event, rawValue, null)
                    return
                }
                let normalizedValue: number = parseInt(rawValue)
                if (min !== undefined && normalizedValue < min) {
                    normalizedValue = min
                }
                if (max !== undefined && normalizedValue > max) {
                    normalizedValue = max
                }
                onChange(event, rawValue, normalizedValue)
            }}
        >
            {children}
        </Input>
    )
}
