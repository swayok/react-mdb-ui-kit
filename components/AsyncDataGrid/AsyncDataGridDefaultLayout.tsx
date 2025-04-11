import React from 'react'
import {
    AsyncDataGridDefaultLayoutProps,
    AsyncDataGridFooterProps,
    AsyncDataGridTableProps,
} from '../../types/AsyncDataGrid'
import {AnyObject} from '../../types/Common'
import AsyncDataGridTable from './AsyncDataGridTable'
import {AsyncDataGridFooter} from './AsyncDataGridFooter'
import clsx from 'clsx'
import AsyncDataGridEvents from './AsyncDataGridEvents'
import withStable from '../../helpers/withStable'

// Стандартная разметка таблицы с данными получаемыми с сервера.
// Сверху вниз:
// - фильтры (если заданы)
// - таблица
// - подвал (кол-во строк, пагинация, выбор лимита строк)
function AsyncDataGridDefaultLayout<
    RowDataType extends object = AnyObject
>(props: AsyncDataGridDefaultLayoutProps<RowDataType>) {

    const tableProps: Partial<AsyncDataGridTableProps<RowDataType>> = Object.assign({
        striped: props.striped === undefined ? true : props.striped,
        hover: props.hover === undefined ? true : props.hover,
        bordered: props.bordered,
        small: props.small,
        verticalAlign: 'top',
        wrapperClass: props.tableWrapperClassName || (props.inline ? 'border' : ''),
        fillHeight: !props.inline,
    }, props.tableProps || {})

    const footerProps: Partial<AsyncDataGridFooterProps> = Object.assign({
        shadow: !props.inline,
        border: !!props.inline,
    } as Partial<AsyncDataGridFooterProps>, props.footerProps || {})

    return (
        <div
            className={clsx(
                'data-grid-container d-flex flex-column align-items-stretch justify-content-start',
                tableProps.fillHeight ? 'full-height overflow-hidden' : null,
                props.className
            )}
            id={props.id}
        >
            {/* Отслеживание событий. */}
            {props.events && (
                <AsyncDataGridEvents {...props.events}/>
            )}
            {typeof props.prepend === 'function' ? props.prepend() : props.prepend}
            {typeof props.filtersPanel === 'function' ? props.filtersPanel() : props.filtersPanel}
            <AsyncDataGridTable<RowDataType>
                {...tableProps}
                renderHeaders={props.renderHeaders}
                renderRow={props.renderRow}
            />
            {!props.hideFooter &&
                <AsyncDataGridFooter {...footerProps}/>
            }
            {typeof props.append === 'function' ? props.append() : props.append}
        </div>
    )
}

export default withStable(
    ['filtersPanel', 'prepend', 'append'],
    AsyncDataGridDefaultLayout
) as typeof AsyncDataGridDefaultLayout
