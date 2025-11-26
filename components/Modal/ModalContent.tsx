import React from 'react'
import clsx from 'clsx'
import {ModalContentProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Контейнер для основных элементов модального окна.
// Внутри обычно несколько компонентов: ModalHeader, ModalBody, ModalFooter.
function ModalContent(
    props: ModalContentProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const {
        className,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('modal-content', className)}
            {...otherProps}
            ref={ref}
        >
            {children}
        </div>
    )
}

export default React.memo(React.forwardRef<HTMLDivElement, ModalContentProps>(ModalContent))
