import {MouseEvent} from 'react'
import {Button} from '../Button'
import clsx from 'clsx'
import {ModalFooterCloseButtonProps} from './ModalTypes'

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
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
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
