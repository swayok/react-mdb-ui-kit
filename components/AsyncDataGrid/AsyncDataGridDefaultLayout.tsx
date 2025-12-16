import clsx from 'clsx'
import {AnyObject} from '../../types'
import {AsyncDataGridEvents} from './AsyncDataGridEvents'
import {AsyncDataGridFooter} from './AsyncDataGridFooter'
import {AsyncDataGridTable} from './AsyncDataGridTable'
import {
    AsyncDataGridDefaultLayoutProps,
    AsyncDataGridFooterProps,
    AsyncDataGridTableProps,
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
        footerProps = {} as Partial<AsyncDataGridFooterProps>,
        tableProps = {} as Partial<AsyncDataGridTableProps<RowDataType>>,
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
