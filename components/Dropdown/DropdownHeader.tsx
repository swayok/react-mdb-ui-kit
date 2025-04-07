import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

export type DropdownHeaderProps = ComponentPropsWithModifiableTag

// Заголовок выпадающего меню.
function DropdownHeader(props: DropdownHeaderProps) {
    const {
        tag: Tag = 'div',
        children,
        className,
        ...otherProps
    } = props

    return (
        <Tag {...otherProps} className={clsx('dropdown-header', className)}>
            {children}
        </Tag>
    )
}

export default React.memo(DropdownHeader)
