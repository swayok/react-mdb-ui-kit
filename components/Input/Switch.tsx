import React from 'react'
import Checkbox, {CheckboxProps} from './Checkbox'

// Чекбокс в виде переключателя.
function Switch(props: CheckboxProps, ref: React.ForwardedRef<HTMLInputElement>) {
    return (
        <Checkbox
            toggleSwitch
            type="checkbox"
            ref={ref}
            {...props}
        />
    )
}

export default React.memo(React.forwardRef<HTMLInputElement, CheckboxProps>(Switch))
