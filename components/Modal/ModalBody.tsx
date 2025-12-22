import clsx from 'clsx'
import {ModalBodyProps} from './ModalTypes'

// Контейнер содержимого модального окна.
export function ModalBody(props: ModalBodyProps) {
    const {
        className,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('modal-body', className)}
            {...otherProps}
        >
            {children}
        </div>
    )
}
