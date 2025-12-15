import clsx from 'clsx'
import {ModalTitle} from './ModalTitle'
import {ModalHeaderCloseButton} from './ModalHeaderCloseButton'
import {ModalHeaderProps} from './ModalTypes'

// Шапка модального окна.
// Обычно содержит название (ModalTitle) и кнопку закрытия (ModalHeaderCloseButton).
export function ModalHeader(props: ModalHeaderProps) {

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

/** @deprecated */
export default ModalHeader
