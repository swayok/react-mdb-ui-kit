import clsx from 'clsx'
import {ModalFooterProps} from './ModalTypes'

// Подвал модального окна.
// Обычно содержит 1 или несколько кнопок (Button, ModalFooterCloseButton).
export function ModalFooter(props: ModalFooterProps) {
    const {
        className,
        border,
        flexBetween,
        center,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx(
                'modal-footer',
                border || border === undefined ? 'border-top' : '',
                flexBetween ? 'justify-content-between flex-nowrap' : null,
                center && !flexBetween ? 'justify-content-center' : null,
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    )
}
