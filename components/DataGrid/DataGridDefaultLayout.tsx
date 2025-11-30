import React from 'react'
import DataGridFooter from './DataGridFooter'
import DataGridTable from './DataGridTable'
import clsx from 'clsx'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {DataGridDefaultLayoutProps, DataGridFooterProps, DataGridTableProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'
import {withStable} from '../../helpers/withStable'

// Стандартная разметка таблицы с данными.
// Сверху вниз:
// - фильтры (если заданы)
// - таблица
// - подвал (кол-во строк, пагинация, выбор лимита строк)
function DataGridDefaultLayout<
    RowDataType extends object = AnyObject
>(props: DataGridDefaultLayoutProps<RowDataType>) {

    const {
        id,
        tableProps: tablePropsCustom = {},
        footerProps: footerPropsCustom = {},
        filtersPanel,
        renderHeaders,
        renderTotalsRow,
        renderRow,
        className,
        tableClassName,
        style,
        border,
        prepend,
        append,
    } = props

    const tableProps: Partial<DataGridTableProps<RowDataType>> = Object.assign({
        striped: true,
        hover: true,
        verticalAlign: 'top',
    }, tablePropsCustom)

    const footerProps: Partial<DataGridFooterProps> = Object.assign({
        shadow: false,
        border: true,
    } as Partial<DataGridFooterProps>, footerPropsCustom)

    return (
        <div
            className={clsx('data-grid-wrapper', className)}
            style={style}
            id={id}
        >
            {typeof prepend === 'function' ? prepend() : prepend}
            {typeof filtersPanel === 'function' ? filtersPanel() : filtersPanel}
            <DataGridTable<RowDataType>
                {...tableProps}
                renderHeaders={renderHeaders}
                renderRow={renderRow}
                renderTotalsRow={renderTotalsRow}
                wrapperClass={clsx(
                    border || border === undefined ? 'border' : null,
                    footerProps.border ? 'border-bottom-0' : null,
                    tableClassName
                )}
            />
            <DataGridFooter {...footerProps}/>
            {typeof append === 'function' ? append() : append}
        </div>
    )
}

export default withStable(
    ['prepend', 'append', 'filtersPanel'],
    DataGridDefaultLayout
) as typeof DataGridDefaultLayout
