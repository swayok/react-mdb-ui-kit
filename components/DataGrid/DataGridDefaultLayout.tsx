import React from 'react'
import {DataGridFooter} from './DataGridFooter'
import {DataGridTable} from './DataGridTable'
import clsx from 'clsx'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {
    DataGridDefaultLayoutProps,
    DataGridFooterProps,
    DataGridTableProps,
} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

// Стандартная разметка таблицы с данными.
// Сверху вниз:
// - фильтры (если заданы)
// - таблица
// - подвал (кол-во строк, пагинация, выбор лимита строк)
export function DataGridDefaultLayout<
    RowDataType extends object = AnyObject,
>(props: DataGridDefaultLayoutProps<RowDataType>) {

    const {
        id,
        tableProps: tablePropsCustom = {},
        footerProps: footerPropsCustom = {},
        FiltersPanel,
        Headers,
        renderTotalsRow,
        renderRow,
        className,
        tableClassName,
        style,
        border,
        Prepend,
        Append,
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
            {Prepend}
            {FiltersPanel}
            <DataGridTable<RowDataType>
                {...tableProps}
                Headers={Headers}
                renderRow={renderRow}
                TotalsRow={renderTotalsRow}
                wrapperClass={clsx(
                    border || border === undefined ? 'border' : null,
                    footerProps.border ? 'border-bottom-0' : null,
                    tableClassName
                )}
            />
            <DataGridFooter {...footerProps} />
            {Append}
        </div>
    )
}
