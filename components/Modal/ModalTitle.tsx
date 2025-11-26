import React from 'react'
import clsx from 'clsx'
import {ModalTitleProps} from 'swayok-react-mdb-ui-kit/components/Modal/ModalTypes'

// Заголовок модального окна.
function ModalTitle(
    props: ModalTitleProps,
    ref: React.ForwardedRef<HTMLAllCollection>
) {
    const {
        className,
        children,
        tag,
        ...otherProps
    } = props

    const Tag = tag || 'h5'

    return (
        <Tag
            className={clsx('modal-title', className)}
            {...otherProps}
            ref={ref}
        >
            {children}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLAllCollection, ModalTitleProps>(ModalTitle))
