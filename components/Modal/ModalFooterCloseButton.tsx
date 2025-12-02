import React from 'react'
import {Button} from '../Button'
import clsx from 'clsx'
import {ModalFooterCloseButtonProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Кнопка закрытия модального окна для ModalFooter.
export function ModalFooterCloseButton(props: ModalFooterCloseButtonProps) {
    const {
        className,
        onClose,
        title,
        ...otherProps
    } = props
    return (
        <Button
            color="gray"
            className={clsx('modal-close', className)}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                onClose?.()
            }}
            {...otherProps}
        >
            {title}
        </Button>
    )
}

/** @deprecated */
export default ModalFooterCloseButton
