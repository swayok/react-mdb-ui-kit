import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export type DropdownDividerProps = ComponentPropsWithModifiableTag

// Разделитель между элементами выпадающего меню.
function DropdownDivider(props: DropdownDividerProps) {

    const {
        tag,
        className,
        ...otherProps
    } = props

    const Tag = tag || 'div'

    return (
        <Tag
            {...otherProps}
            className={clsx('dropdown-divider', className)}
        />
    )
}

export default React.memo(DropdownDivider)
