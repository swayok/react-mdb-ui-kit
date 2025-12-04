import clsx from 'clsx'
import {MouseEvent} from 'react'
import {ModalHeaderCloseButtonProps} from './ModalTypes'
import {Button} from '../Button'

// Кнопка закрытия модального окна для ModalHeader.
export function ModalHeaderCloseButton(props: ModalHeaderCloseButtonProps) {

    const {
        className,
        floating,
        white,
        onClose,
        ...otherProps
    } = props

    return (
        <Button
            className={clsx(
                'btn-close',
                white ? 'btn-close-white' : null,
                className,
                floating ? 'floating' : null
            )}
            color="none"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                onClose?.()
            }}
            noRipple
            {...otherProps}
        />
    )
}

/** @deprecated */
export default ModalHeaderCloseButton
