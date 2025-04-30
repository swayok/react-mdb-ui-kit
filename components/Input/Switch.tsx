import React from 'react'
import Checkbox, {CheckboxProps} from 'swayok-react-mdb-ui-kit/components/Input/Checkbox'

// Чекбокс в виде переключателя.
export default function Switch(props: Omit<CheckboxProps, 'type'>) {
    return (
        <Checkbox
            type="switch"
            {...props}
        />
    )
}
