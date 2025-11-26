import React from 'react'
import clsx from 'clsx'
import {ModalFooterProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Подвал модального окна.
// Обычно содержит 1 или несколько кнопок (Button, ModalFooterCloseButton).
function ModalFooter(
    props: ModalFooterProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
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
            ref={ref}
        >
            {children}
        </div>
    )
}

export default React.memo(React.forwardRef<HTMLDivElement, ModalFooterProps>(ModalFooter))
