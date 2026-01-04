import clsx from 'clsx'
import {ModalDialogProps} from './ModalTypes'

// Контейнер модального окна.
// Отвечает за размеры и расположение.
// Внутри должен быть компонент ModalContent.
export function ModalDialog(props: ModalDialogProps) {

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
        typeof scrollable === 'string' ? 'modal-dialog-' + scrollable : null,
        centered || centered === undefined ? 'modal-dialog-centered' : null,
        size && size !== 'md' ? `modal-${size}` : null,
        className
    )

    return (
        <div
            className={classes}
            {...otherProps}
        >
            {children}
        </div>
    )
}
