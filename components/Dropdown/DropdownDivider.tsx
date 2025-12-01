import React from 'react'
import clsx from 'clsx'
import {DropdownDividerProps} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'

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
