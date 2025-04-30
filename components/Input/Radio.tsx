import React from 'react'
import Checkbox, {CheckboxProps} from './Checkbox'

// Аналог <input type="radio"/>.
export default function Radio(props: Omit<CheckboxProps, 'type'>) {
    return (
        <Checkbox
            type="radio"
            {...props}
        />
    )
}
