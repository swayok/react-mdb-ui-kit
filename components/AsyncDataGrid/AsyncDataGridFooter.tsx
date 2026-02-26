import {DataGridFooterWrapper} from '../DataGrid/DataGridFooterWrapper'
import {DataGridItemsCount} from '../DataGrid/DataGridItemsCount'
import {DataGridPagination} from '../DataGrid/DataGridPagination'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AsyncDataGridFooterReload} from './AsyncDataGridFooterReload'
import {AsyncDataGridFooterProps} from './AsyncDataGridTypes'

// Подвал таблицы с данными.
// Слева:
// - количество строк в таблице;
// - диапазон отображаемых строк;
// - выбор лимита кол-ва строк, отображаемых на странице.
// Справа:
// - пагинация;
// - кнопка перезагрузки данных.
export function AsyncDataGridFooter(props: AsyncDataGridFooterProps) {

    const {
        disabled,
        reloader = true,
        autoReloadMs,
        limitChanger = true,
        paginationProps = {
            numbers: true,
        },
        shadow = true,
        border = false,
        ...otherProps
    } = props

    const {
        limit,
        offset,
        limits,
        totalCount,
        setLimit,
        setOffset,
        loading,
    } = useAsyncDataGridContext()

    const isDisabled: boolean = !!disabled || loading

    return (
        <DataGridFooterWrapper
            {...otherProps}
            shadow={shadow}
            border={border}
        >
            <DataGridItemsCount
                totalCount={totalCount ?? 0}
                offset={offset}
                limit={limit}
                limits={limitChanger ? limits : undefined}
                onLimitChange={setLimit}
                disabled={isDisabled}
            />
            <div className="d-flex flex-row align-items-center justify-content-end">
                <DataGridPagination
                    {...paginationProps}
                    totalCount={totalCount ?? 0}
                    offset={offset}
                    limit={limit}
                    disabled={isDisabled}
                    onOffsetChange={setOffset}
                />
                {reloader && (
                    <AsyncDataGridFooterReload
                        disabled={disabled}
                        autoReloadMs={autoReloadMs}
                    />
                )}
            </div>
        </DataGridFooterWrapper>
    )
}
