import clsx from 'clsx'
import React from 'react'
import {DataGridCellProps} from '../../types/DataGrid'

// Ячейка таблицы.
function DataGridCell(props: DataGridCellProps) {

    const {
        children,
        highlight,
        className,
        ...otherProps
    } = props

    return (
        <td
            className={clsx(
                highlight ? 'table-highlight-' + highlight : null,
                className
            )}
            {...otherProps}
        >
            {children}
        </td>
    )
}

export default React.memo(DataGridCell)
