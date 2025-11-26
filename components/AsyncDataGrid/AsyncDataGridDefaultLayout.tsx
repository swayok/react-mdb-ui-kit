import React from 'react'
import {
    AsyncDataGridDefaultLayoutProps,
    AsyncDataGridFooterProps,
    AsyncDataGridTableProps,
} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
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

    const {
        id,
        events,
        striped = true,
        hover = true,
        bordered,
        small,
        inline,
        tableWrapperClassName = inline ? 'border' : '',
        className,
        prepend,
        append,
        filtersPanel,
        renderHeaders,
        renderRow,
        hideFooter,
    } = props

    const tableProps: Partial<AsyncDataGridTableProps<RowDataType>> = Object.assign({
        striped,
        hover,
        bordered,
        small,
        verticalAlign: 'top',
        wrapperClass: tableWrapperClassName,
        fillHeight: !inline,
    }, props.tableProps ?? {})

    const footerProps: Partial<AsyncDataGridFooterProps> = Object.assign({
        shadow: !inline,
        border: !!inline,
    } as Partial<AsyncDataGridFooterProps>, props.footerProps ?? {})

    return (
        <div
            className={clsx(
                'data-grid-wrapper d-flex flex-column align-items-stretch justify-content-start',
                tableProps.fillHeight ? 'full-height overflow-hidden' : null,
                className
            )}
            id={id}
        >
            {/* Отслеживание событий. */}
            {events && (
                <AsyncDataGridEvents {...events}/>
            )}
            {typeof prepend === 'function' ? prepend() : prepend}
            {typeof filtersPanel === 'function' ? filtersPanel() : filtersPanel}
            <AsyncDataGridTable<RowDataType>
                {...tableProps}
                renderHeaders={renderHeaders}
                renderRow={renderRow}
            />
            {!hideFooter &&
                <AsyncDataGridFooter {...footerProps}/>
            }
            {typeof append === 'function' ? append() : append}
        </div>
    )
}

export default withStable(
    ['filtersPanel', 'prepend', 'append'],
    AsyncDataGridDefaultLayout
) as typeof AsyncDataGridDefaultLayout
