import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export type DropdownHeaderProps = ComponentPropsWithModifiableTag

// Заголовок выпадающего меню.
function DropdownHeader(props: DropdownHeaderProps) {
    const {
        tag,
        children,
        className,
        ...otherProps
    } = props

    const Tag = tag || 'h6'

    return (
        <Tag {...otherProps} className={clsx('dropdown-header', className)}>
            {children}
        </Tag>
    )
}

export default React.memo(DropdownHeader)
