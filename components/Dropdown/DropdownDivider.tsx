import clsx from 'clsx'
import type {DropdownDividerProps} from './DropdownTypes'

// Разделитель элементов выпадающего меню.
export function DropdownDivider(props: DropdownDividerProps) {

    const {
        className,
        role = 'separator',
        ...otherProps
    } = props

    return (
        <hr
            className={clsx(className, 'dropdown-divider')}
            role={role}
            {...otherProps}
        />
    )
}
