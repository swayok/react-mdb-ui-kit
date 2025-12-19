import clsx from 'clsx'
import {InputSize} from '../InputTypes'

// CSS-классы для Input компонента.
export function getInputClassName(config: {
    size: InputSize
    active?: boolean
    isFocused?: boolean
    activeOnFocus?: boolean
    hasNotEmptyValue?: boolean
    invalid?: boolean
    textarea?: boolean
    className?: string
}): string {
    return clsx(
        'form-control',
        config.active || (config.isFocused && config.activeOnFocus) || config.hasNotEmptyValue
            ? 'active'
            : null,
        config.size === 'small' ? 'form-control-sm' : null,
        config.size === 'large' ? 'form-control-lg' : null,
        config.invalid ? 'is-invalid' : null,
        config.className
    )
}
