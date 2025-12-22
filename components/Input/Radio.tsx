import {Checkbox} from './Checkbox'
import {CheckboxProps} from './InputTypes'

// Аналог <input type="radio"/>.
export function Radio(props: Omit<CheckboxProps, 'type'>) {
    return (
        <Checkbox
            type="radio"
            {...props}
        />
    )
}
