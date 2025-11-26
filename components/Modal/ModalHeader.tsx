import React from 'react'
import clsx from 'clsx'
import ModalTitle from './ModalTitle'
import ModalHeaderCloseButton from './ModalHeaderCloseButton'
import {ModalHeaderProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Шапка модального окна.
// Обычно содержит название (ModalTitle) и кнопку закрытия (ModalHeaderCloseButton).
function ModalHeader(
    props: ModalHeaderProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {

    const {
        className,
        children,
        title,
        titleProps,
        onClose,
        closeButtonProps,
        border,
        ...otherProps
    } = props

    const classes = clsx(
        'modal-header',
        border || border === undefined ? 'border-bottom' : null,
        className
    )

    return (
        <div
            className={classes}
            {...otherProps}
            ref={ref}
        >
            {title && (
                <ModalTitle {...titleProps}>
                    {title}
                </ModalTitle>
            )}
            {children}
            {onClose && (
                <ModalHeaderCloseButton
                    onClose={onClose}
                    {...closeButtonProps}
                />
            )}
        </div>
    )
}

export default React.memo(React.forwardRef<HTMLDivElement, ModalHeaderProps>(ModalHeader))
