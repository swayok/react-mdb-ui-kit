import clsx from 'clsx'
import {DataGridCellProps} from './DataGridTypes'

// Ячейка таблицы.
export function DataGridCell(props: DataGridCellProps) {

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

/** @deprecated */
export default DataGridCell
