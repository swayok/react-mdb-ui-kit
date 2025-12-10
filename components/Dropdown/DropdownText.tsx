import clsx from 'clsx'
import {DropdownTextProps} from './DropdownTypes'

// Текстовый блок для DropdownMenu со стилями как у DropdownItem.
export function DropdownText(props: DropdownTextProps) {

    const {
        className,
        tag: Component = 'span',
        ref,
        ...otherProps
    } = props

    return (
        <Component
            ref={ref}
            className={clsx(className, 'dropdown-text')}
            {...otherProps}
        />
    )
}
