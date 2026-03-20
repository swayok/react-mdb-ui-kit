import {Checkbox} from './Checkbox'
import type {CheckboxProps} from './InputTypes'

// Чекбокс в виде переключателя.
export function Switch(props: Omit<CheckboxProps, 'type'>) {
    return (
        <Checkbox
            type="switch"
            {...props}
        />
    )
}
