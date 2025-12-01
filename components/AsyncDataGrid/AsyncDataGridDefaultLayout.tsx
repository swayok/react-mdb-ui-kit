import clsx from 'clsx'
import React from 'react'
import {
    AsyncDataGridDefaultLayoutProps,
    AsyncDataGridFooterProps,
    AsyncDataGridTableProps,
} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {AsyncDataGridEvents} from './AsyncDataGridEvents'
import {AsyncDataGridFooter} from './AsyncDataGridFooter'
import {AsyncDataGridTable} from './AsyncDataGridTable'

// Стандартная разметка таблицы с данными, получаемыми с сервера.
// Сверху вниз:
// - фильтры (если заданы)
// - таблица
// - подвал (кол-во строк, пагинация, выбор лимита строк)
export function AsyncDataGridDefaultLayout<
    RowDataType extends object = AnyObject,
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
        Prepend,
        Append,
        FiltersPanel,
        Headers,
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
                <AsyncDataGridEvents {...events} />
            )}
            {Prepend}
            {FiltersPanel}
            <AsyncDataGridTable<RowDataType>
                {...tableProps}
                Headers={Headers}
                renderRow={renderRow}
            />
            {!hideFooter
                && <AsyncDataGridFooter {...footerProps} />}
            {Append}
        </div>
    )
}
