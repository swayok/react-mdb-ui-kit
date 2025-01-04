import React from 'react'
import DataGridFooter from './DataGridFooter'
import DataGridTable from './DataGridTable'
import clsx from 'clsx'
import {AnyObject} from '../../types/Common'
import {DataGridDefaultLayoutProps, DataGridFooterProps, DataGridTableProps} from '../../types/DataGrid'
import withStable from '../../helpers/withStable'

// Стандартная разметка таблицы с данными.
// Сверху вниз:
// - фильтры (если заданы)
// - таблица
// - подвал (кол-во строк, пагинация, выбор лимита строк)
function DataGridDefaultLayout<
    RowDataType extends object = AnyObject
>(props: DataGridDefaultLayoutProps<RowDataType>) {

    const tableProps: Partial<DataGridTableProps<RowDataType>> = Object.assign({
        striped: true,
        hover: true,
        verticalAlign: 'top',
    }, props.tableProps || {})

    const footerProps: Partial<DataGridFooterProps> = Object.assign({
        shadow: false,
        border: true,
    } as Partial<DataGridFooterProps>, props.footerProps || {})

    return (
        <div
            className={clsx('data-grid-container', props.className)}
            style={props.style}
            id={props.id}
        >
            {typeof props.prepend === 'function' ? props.prepend() : props.prepend}
            {typeof props.filtersPanel === 'function' ? props.filtersPanel() : props.filtersPanel}
            <DataGridTable<RowDataType>
                {...tableProps}
                renderHeaders={props.renderHeaders}
                renderRow={props.renderRow}
                renderTotalsRow={props.renderTotalsRow}
                wrapperClass={clsx(
                    props.border || props.border === undefined ? 'border' : null,
                    footerProps.border ? 'border-bottom-0' : null,
                    props.tableClassName
                )}
            />
            <DataGridFooter {...footerProps}/>
            {typeof props.append === 'function' ? props.append() : props.append}
        </div>
    )
}

export default withStable(
    ['prepend', 'append', 'filtersPanel'],
    DataGridDefaultLayout
) as typeof DataGridDefaultLayout
