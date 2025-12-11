import clsx from 'clsx'
import {DropdownTextProps} from './DropdownTypes'

// Текстовый блок для DropdownMenu со стилями как у DropdownItem.
export function DropdownText(props: DropdownTextProps) {

    const {
        className,
        ...otherProps
    } = props

    return (
        <div
            className={clsx(className, 'dropdown-text')}
            {...otherProps}
        />
    )
}
