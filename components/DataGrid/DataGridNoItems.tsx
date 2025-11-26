import React from 'react'
import clsx from 'clsx'
import {DataGridNoItemsProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

// Сообщение о том что в таблице нет строк.
function DataGridNoItems(props: DataGridNoItemsProps) {

    const {
        children,
        className,
        flexFill,
        ...otherProps
    } = props

    return (
        <div
            {...otherProps}
            className={clsx(
                'data-grid-no-items fs-6 pt-5 pb-5 ps-4 pe-4',
                flexFill ? 'flex-1 d-flex flex-column justify-content-center align-items-center' : 'text-center',
                className
            )}
        >
            <span>
                {children}
            </span>
        </div>
    )
}

export default React.memo(DataGridNoItems)
