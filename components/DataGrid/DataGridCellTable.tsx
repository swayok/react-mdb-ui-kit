import React from 'react'
import clsx from 'clsx'

// Таблица для отображения в ячейке таблицы.
function DataGridCellTable(props: React.TableHTMLAttributes<HTMLTableElement>) {

    const {
        children,
        // eslint-disable-next-line react/prop-types
        className,
        ...otherProps
    } = props

    return (
        <table
            className={clsx('subtable', className)}
            {...otherProps}
        >
            <tbody>
                {children}
            </tbody>
        </table>
    )
}

export default React.memo(DataGridCellTable)
