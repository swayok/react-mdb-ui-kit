import {
    useCallback,
    useEffect,
    useState,
} from 'react'
import {AnyObject} from '../../types'
import {
    DataGridContext,
    dataGridDefaultLimit,
    dataGridDefaultLimits,
    dataGridDefaultTranslations,
} from './DataGridContext'
import {
    normalizeOffset,
    reorderDataGridRows,
} from './dataGridHelpers'
import {
    DataGridContextProps,
    DataGridOrderByValuesType,
    DataGridOrdering,
    DataGridOrderingDirection,
    DataGridProps,
} from './DataGridTypes'

// Обертка таблицы с данными (настройка контекста).
export function DataGrid<
    RowDataType extends object,
    FiltersDataType extends object = AnyObject,
>(props: DataGridProps<RowDataType, FiltersDataType>) {

    const {
        children,
        translations = dataGridDefaultTranslations,
        rows,
        limits = dataGridDefaultLimits,
        defaultLimit,
        startingOffset = 0,
        startingFilters = {} as FiltersDataType,
        defaultFilters = {} as FiltersDataType,
        onFilter,
        defaultOrderBy = null,
        defaultOrderByValuesType,
        defaultOrderDirection = 'asc',
        onOrder,
        loading = false,
        setIsLoading = () => {
        },
    } = props

    const [
        limit,
        setLimit,
    ] = useState<DataGridContextProps['limit']>(() => (
        defaultLimit ?? limits?.[0] ?? dataGridDefaultLimit
    ))

    const [
        offset,
        setOffset,
    ] = useState<DataGridContextProps['offset']>(startingOffset)

    const [
        ordering,
        setOrdering,
    ] = useState<DataGridOrdering>(() => ({
        column: defaultOrderBy,
        direction: defaultOrderDirection,
        valuesType: defaultOrderByValuesType,
    }))

    const [
        filters,
        setFilters,
    ] = useState<FiltersDataType>(
        () => ({
            ...defaultFilters,
            ...startingFilters,
        })
    )

    // Отфильтрованные и отсортированные строки (все).
    const [
        filteredOrderedRows,
        setFilteredOrderedRows,
    ] = useState<RowDataType[]>(
        () => filterAndOrderRows(
            rows,
            filters,
            ordering,
            onFilter,
            onOrder
        )
    )

    // Отфильтрованные и отсортированные строки (текущая страница).
    const [
        visibleRows,
        setVisibleRows,
    ] = useState<RowDataType[]>(
        () => getRowsForCurrentPage(filteredOrderedRows, offset, limit)
    )

    // Фильтрация и сортировка данных при изменениях.
    useEffect(
        () => {
            const filteredRows: RowDataType[] = filterAndOrderRows(
                rows,
                filters,
                ordering,
                onFilter,
                onOrder
            )
            setFilteredOrderedRows(filteredRows)
            setVisibleRows(getRowsForCurrentPage(filteredRows, offset, limit))
        },
        [rows, filters, ordering, onFilter, onOrder]
    )

    // Задать полный набор строк в таблице (включая скрытые).
    const onSetRows = useCallback(
        (rows: RowDataType[]): void => {
            setFilteredOrderedRows(rows)
            setOffset(0)
            setVisibleRows(rows.slice(0, limit))
        },
        [limit]
    )

    // Обновить данные видимых строк.
    // Используется, если после какого-то действия нужно отобразить изменения.
    // Внимание: таким образом нельзя внести изменения в rows!
    const updateVisibleRows = useCallback(
        (callback: (rows: RowDataType[]) => RowDataType[]): void => {
            setVisibleRows(callback(visibleRows))
        },
        [visibleRows, filteredOrderedRows]
    )

    // Установить лимит строк на странице.
    const onSetLimit = useCallback(
        (newLimit: number): void => {
            setLimit(newLimit)
            const newOffset = normalizeOffset(newLimit, offset)
            setOffset(newOffset)
            setVisibleRows(filteredOrderedRows.slice(newOffset, newOffset + newLimit))
        },
        [offset]
    )

    // Изменить смещение отображаемых строк (по сути перейти на другую страницу).
    const onSetOffset = useCallback(
        (newOffset: number): void => {
            setOffset(newOffset)
            setVisibleRows(filteredOrderedRows.slice(newOffset, newOffset + limit))
        },
        [limit]
    )

    // Изменить сортировку.
    const onSetOrder = useCallback(
        (
            column: string,
            direction: DataGridOrderingDirection,
            resetOffset: boolean = false,
            valuesType?: DataGridOrderByValuesType
        ): void => {
            if (resetOffset) {
                setOffset(0)
            }
            setOrdering({column, direction, valuesType})
        },
        []
    )

    // Применить фильтры.
    const applyFilters = useCallback(
        (filters: FiltersDataType, resetOffset: boolean = false): void => {
            if (resetOffset) {
                setOffset(0)
            }
            setFilters(filters)
        },
        []
    )

    const contextProps: DataGridContextProps<RowDataType, FiltersDataType> = {
        translations,

        limits,
        limit,
        setLimit: onSetLimit,

        offset,
        setOffset: onSetOffset,

        orderBy: ordering.column,
        orderDirection: ordering.direction,
        setOrder: onSetOrder,

        filters,
        defaultFilters,
        applyFilters,

        rows: filteredOrderedRows,
        setRows: onSetRows,
        updateVisibleRows,
        unfilteredRowsCount: rows.length,

        visibleRows,
        setVisibleRows,

        loading,
        setIsLoading,
        defaultOrderBy,
        defaultOrderDirection,
    }

    return (
        <DataGridContext.Provider
            value={contextProps}
        >
            {children}
        </DataGridContext.Provider>
    )
}

// Получение строк для отображения на текущей странице.
export function getRowsForCurrentPage<RowDataType extends object>(
    allRows: RowDataType[],
    offset: number,
    limit: number
): RowDataType[] {
    return allRows.slice(offset, limit)
}

// Фильтрация и сортировка строк.
export function filterAndOrderRows<
    RowDataType extends object,
    FiltersDataType extends object = AnyObject,
>(
    allRows: RowDataType[],
    filters: FiltersDataType,
    ordering: DataGridOrdering,
    onFilter?: DataGridProps<RowDataType, FiltersDataType>['onFilter'],
    onOrder?: DataGridProps<RowDataType, FiltersDataType>['onOrder']
) {
    let rows: RowDataType[]
    if (onFilter) {
        rows = onFilter(allRows, filters)
    } else {
        rows = allRows.slice()
    }
    return (onOrder || reorderDataGridRows)(
        rows,
        ordering.column,
        ordering.direction
    )
}
