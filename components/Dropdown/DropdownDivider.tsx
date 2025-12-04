import clsx from 'clsx'
import {DropdownDividerProps} from './DropdownTypes'

// Разделитель элементов выпадающего меню.
export function DropdownDivider(props: DropdownDividerProps) {

    const {
        className,
        tag: Component = 'hr',
        role = 'separator',
        ...otherProps
    } = props

    return (
        <Component
            className={clsx(className, 'dropdown-divider')}
            role={role}
            {...otherProps}
        />
    )
}
