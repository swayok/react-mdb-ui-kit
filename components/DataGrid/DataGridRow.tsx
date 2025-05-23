import React from 'react'
import {DataGridRowProps} from '../../types/DataGrid'
import clsx from 'clsx'

// Обертка строки таблицы (<tr>).
function DataGridRow(props: DataGridRowProps) {

    const {
        children,
        index,
        selected,
        className,
        highlight,
        ...rowProps
    } = props

    return (
        <tr
            {...rowProps}
            className={clsx(
                className,
                index % 2 === 0 ? 'even' : 'odd',
                selected ? 'data-grid-row-selected' : null,
                highlight ? 'table-highlight-' + highlight : null
            )}
        >
            {children}
        </tr>
    )
}

export default React.memo(DataGridRow)
