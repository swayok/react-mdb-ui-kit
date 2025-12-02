import React from 'react'
import clsx from 'clsx'
import {ModalContentProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Контейнер для основных элементов модального окна.
// Внутри обычно несколько компонентов: ModalHeader, ModalBody, ModalFooter.
export function ModalContent(props: ModalContentProps) {
    const {
        className,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('modal-content', className)}
            {...otherProps}
        >
            {children}
        </div>
    )
}

/** @deprecated */
export default ModalContent
