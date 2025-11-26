import React from 'react'
import clsx from 'clsx'
import {DropdownHeaderProps} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'

export function DropdownHeader(props: DropdownHeaderProps) {

    const {
        className,
        tag: Component = 'div',
        role = 'heading',
        ref,
        ...otherProps
    } = props

    return (
        <Component
            ref={ref}
            className={clsx(className, 'dropdown-header')}
            role={role}
            {...otherProps}
        />
    )
}
