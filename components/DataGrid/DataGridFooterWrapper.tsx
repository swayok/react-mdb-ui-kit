import React from 'react'
import clsx from 'clsx'
import {DataGridFooterWrapperProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

// Обертка подвала таблицы с данными.
export function DataGridFooterWrapper(props: DataGridFooterWrapperProps) {

    const {
        className,
        shadow,
        border,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx(
                'data-grid-footer d-flex flex-row flex-wrap align-items-center justify-content-between ps-3 pe-3 pt-2 pb-2',
                shadow ? 'shadow-2-strong' : 'border-top',
                border || border === undefined ? 'border' : null,
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    )
}
