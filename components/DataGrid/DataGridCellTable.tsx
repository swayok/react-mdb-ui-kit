import clsx from 'clsx'
import {TableHTMLAttributes} from 'react'

// Таблица для отображения в ячейке таблицы.
export function DataGridCellTable(props: TableHTMLAttributes<HTMLTableElement>) {

    const {
        children,
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
