import clsx from 'clsx'
import {MouseEvent} from 'react'
import {Button} from '../Button'
import {ModalHeaderCloseButtonProps} from './ModalTypes'

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
