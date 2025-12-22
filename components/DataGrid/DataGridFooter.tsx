import {useDataGridContext} from './DataGridContext'
import {DataGridFooterWrapper} from './DataGridFooterWrapper'
import {DataGridItemsCount} from './DataGridItemsCount'
import {DataGridPagination} from './DataGridPagination'
import {DataGridFooterProps} from './DataGridTypes'

// Подвал таблицы с данными.
// Слева:
// - количество строк в таблице
// - диапазон отображаемых строк
// - выбор лимита кол-ва строк, отображаемых на странице
// Справа:
// - пагинация
export function DataGridFooter(props: DataGridFooterProps) {

    const {
        disabled,
        limitChanger = true,
        paginationProps = {
            numbers: true,
        },
        shadow = false,
        border = true,
        ...otherProps
    } = props

    const {
        limit,
        offset,
        limits,
        setLimit,
        setOffset,
        rows,
        unfilteredRowsCount,
    } = useDataGridContext()

    return (
        <DataGridFooterWrapper
            shadow={shadow}
            border={border}
            {...otherProps}
        >
            <DataGridItemsCount
                totalCount={unfilteredRowsCount}
                filteredCount={rows.length}
                offset={offset}
                limit={limit}
                limits={limitChanger ? limits : undefined}
                onLimitChange={setLimit}
                disabled={!!disabled}
            />
            <DataGridPagination
                {...paginationProps}
                totalCount={rows.length}
                offset={offset}
                limit={limit}
                disabled={!!disabled}
                onOffsetChange={setOffset}
            />
        </DataGridFooterWrapper>
    )
}
