import clsx from 'clsx'
import type {AnyObject} from '../../types'
import {AsyncDataGridEvents} from './AsyncDataGridEvents'
import {AsyncDataGridFooter} from './AsyncDataGridFooter'
import {AsyncDataGridTable} from './AsyncDataGridTable'
import type {
    AsyncDataGridDefaultLayoutProps,
} from './AsyncDataGridTypes'

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
        noItemsMessage,
        footerProps = {},
        tableProps = {},
    } = props

    const fillHeight: boolean = !inline

    return (
        <div
            className={clsx(
                'data-grid-wrapper d-flex flex-column align-items-stretch justify-content-start',
                fillHeight ? 'full-height overflow-hidden' : null,
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
                striped={striped}
                hover={hover}
                bordered={bordered}
                small={small}
                verticalAlign="top"
                wrapperClassName={tableWrapperClassName}
                fillHeight={fillHeight}
                noItemsMessage={noItemsMessage}
                {...tableProps}
                Headers={Headers}
                renderRow={renderRow}
            />
            {!hideFooter
                && <AsyncDataGridFooter
                    shadow={!inline}
                    border={!!inline}
                    {...footerProps}
                />}
            {Append}
        </div>
    )
}
