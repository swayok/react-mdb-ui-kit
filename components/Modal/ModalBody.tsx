import React from 'react'
import clsx from 'clsx'
import {ModalBodyProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Контейнер содержимого модального окна.
export function ModalBody(props: ModalBodyProps) {
    const {
        className,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('modal-body', className)}
            {...otherProps}
        >
            {children}
        </div>
    )
}

/** @deprecated */
export default ModalBody
