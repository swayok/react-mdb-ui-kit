import React from 'react'
import clsx from 'clsx'
import {DropdownItemTextProps} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'

export function DropdownItemText(props: DropdownItemTextProps) {

    const {
        className,
        tag: Component = 'span',
        ref,
        ...otherProps
    } = props

    return (
        <Component
            ref={ref}
            className={clsx(className, 'dropdown-item-text')}
            {...otherProps}
        />
    )
}
