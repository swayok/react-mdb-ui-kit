import React from 'react'
import clsx from 'clsx'
import {DropdownDividerProps} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'

export function DropdownDivider(props: DropdownDividerProps) {

    const {
        className,
        tag: Component = 'hr',
        role = 'separator',
        ref,
        ...otherProps
    } = props

    return (
        <Component
            ref={ref}
            className={clsx(className, 'dropdown-divider')}
            role={role}
            {...otherProps}
        />
    )
}
