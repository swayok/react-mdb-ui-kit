import React from 'react'
import clsx from 'clsx'
import {ModalTitleProps} from '../../types/Modals'

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
