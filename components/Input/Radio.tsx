import React from 'react'
import Checkbox, {CheckboxProps} from './Checkbox'

// Аналог <input type="radio"/>.
function Radio(
    props: CheckboxProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    return (
        <Checkbox
            type="radio"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            tabIndex={-1}
            {...props}
        />
    )
}

export default React.forwardRef<HTMLInputElement, CheckboxProps>(Radio)
