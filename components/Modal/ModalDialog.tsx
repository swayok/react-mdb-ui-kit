import React from 'react'
import clsx from 'clsx'
import {ModalDialogProps} from '../../types/Modals'

// Контейнер модального окна.
// Отвечает за размеры и расположение.
// Внутри должен быть компонент ModalContent.
function ModalDialog(
    props: ModalDialogProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {

    const {
        className,
        centered,
        children,
        size,
        scrollable,
        ...otherProps
    } = props

    const classes = clsx(
        'modal-dialog',
        scrollable ? 'modal-dialog-scrollable' : null,
        centered || centered === undefined ? 'modal-dialog-centered' : null,
        size && size !== 'md' ? `modal-${size}` : null,
        className
    )

    return (
        <div
            className={classes}
            {...otherProps}
            ref={ref}
        >
            {children}
        </div>
    )
}

export default React.memo(React.forwardRef<HTMLDivElement, ModalDialogProps>(ModalDialog))
