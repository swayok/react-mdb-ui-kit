import React from 'react'
import clsx from 'clsx'
import {ModalTitleProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Заголовок модального окна.
export function ModalTitle(props: ModalTitleProps) {
    const {
        className,
        children,
        tag,
        ...otherProps
    } = props

    const Tag = tag || 'h5'

    return (
        <Tag
            className={clsx('modal-title', className)}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default ModalTitle
