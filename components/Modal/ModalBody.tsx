import React from 'react'
import clsx from 'clsx'
import {ModalBodyProps} from '../../types/Modals'

// Контейнер содержимого модального окна.
function ModalBody(
    props: ModalBodyProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const {
        className,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('modal-body', className)}
            {...otherProps}
            ref={ref}
        >
            {children}
        </div>
    )
}

export default React.memo(React.forwardRef<HTMLDivElement, ModalBodyProps>(ModalBody))
