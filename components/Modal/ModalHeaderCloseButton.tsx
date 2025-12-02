import clsx from 'clsx'
import React from 'react'
import {ModalHeaderCloseButtonProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
