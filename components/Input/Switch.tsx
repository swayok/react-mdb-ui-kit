import React from 'react'
import Checkbox, {CheckboxProps} from './Checkbox'

// Чекбокс в виде переключателя.
export default function Switch(props: Omit<CheckboxProps, 'type'>) {
    return (
        <Checkbox
            type="switch"
            {...props}
        />
    )
}
