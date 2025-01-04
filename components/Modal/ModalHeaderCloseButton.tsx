import React from 'react'
import clsx from 'clsx'
import Button from '../Button'
import {ModalHeaderCloseButtonProps} from '../../types/Modals'
import withStable from '../../helpers/withStable'

// Кнопка закрытия модального окна для ModalHeader.
function ModalHeaderCloseButton(props: ModalHeaderCloseButtonProps) {

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

export default withStable<ModalHeaderCloseButtonProps>(['onClose'], ModalHeaderCloseButton)
