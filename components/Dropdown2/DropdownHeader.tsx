import React from 'react'
import clsx from 'clsx'
import {DropdownHeaderProps} from './DropdownTypes'

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
