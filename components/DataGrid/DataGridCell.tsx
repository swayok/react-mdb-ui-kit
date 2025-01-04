import React from 'react'

// Ячейка таблицы.
function DataGridCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {

    const {
        children,
        ...otherProps
    } = props

    return (
        <td {...otherProps}>
            {children}
        </td>
    )
}

export default React.memo(DataGridCell)
