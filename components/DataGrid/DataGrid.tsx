import React, {useCallback, useEffect, useState} from 'react'
import DataGridContext, {dataGridDefaultLimit, getDataGridContextDefaults} from './DataGridContext'
import {normalizeOffset, reorderDataGridRows} from './dataGridHelpers'
import {AnyObject} from '../../types/Common'
import {
    DataGridContextProps,
    DataGridOrderByValuesType,
    DataGridOrdering,
    DataGridOrderingDirection,
    DataGridProps,
} from '../../types/DataGrid'

// Обертка таблицы с данными (настройка контекста).
function DataGrid<
    RowDataType extends object,
    FiltersDataType extends object = AnyObject
>(props: DataGridProps<RowDataType, FiltersDataType>) {

    const [limit, setLimit] = useState<DataGridContextProps['limit']>(props.defaultLimit || props.limits?.[0] || dataGridDefaultLimit)
    const [offset, setOffset] = useState<DataGridContextProps['offset']>(props.startingOffset || 0)
    const [ordering, setOrdering] = useState<DataGridOrdering>({
        column: props.defaultOrderBy || null,
        direction: props.defaultOrderDirection || 'asc',
        valuesType: props.defaultOrderByValuesType,
    })
    const [filters, setFilters] = useState<FiltersDataType>(Object.assign(
        {},
        props.defaultFilters || {},
        props.startingFilters || {}
    ) as FiltersDataType)

    // Фильтрация и сортировка строк.
    const filterAndOrderRows = (allRows: RowDataType[]) => {
        let rows: RowDataType[]
        if (props.onFilter) {
            rows = props.onFilter(allRows, filters)
        } else {
            rows = allRows.slice()
        }
        return (props.onOrder || reorderDataGridRows)(rows, ordering.column, ordering.direction)
    }

    // Получение строк для отображения на текущей странице.
    const getRowsForCurrentPage = (allRows: RowDataType[]): RowDataType[] =>
        allRows.slice(offset, limit)

    // Отфильтрованные и отсортированные строки (все).
    const [
        filteredOrderedRows,
        setFilteredOrderedRows,
    ] = useState<RowDataType[]>(filterAndOrderRows(props.rows))

    // Отфильтрованные и отсортированные строки (текущая страница).
    const [
        visibleRows,
        setVisibleRows,
    ] = useState<RowDataType[]>(getRowsForCurrentPage(filteredOrderedRows))

    // Фильтрация и сортировка данных при изменениях.
    useEffect(() => {
        const rows: RowDataType[] = filterAndOrderRows(props.rows)
        setFilteredOrderedRows(rows)
        setVisibleRows(getRowsForCurrentPage(rows))
    }, [props.rows, filters, ordering, props.onFilter, props.onOrder])

    // Задать полный набор строк в таблице (включая скрытые).
    const onSetRows = useCallback((rows: RowDataType[]): void => {
        setFilteredOrderedRows(rows)
        setOffset(0)
        setVisibleRows(rows.slice(0, limit))
    }, [limit])

    // Обновить данные видимых строк.
    // Используется если после какого-то действия нужно отобразить изменения.
    // Внимание: таким образом нельзя внести изменения в props.rows!
    const updateVisibleRows = useCallback((callback: (rows: RowDataType[]) => RowDataType[]): void => {
        setVisibleRows(callback(visibleRows))
    }, [visibleRows, filteredOrderedRows])

    // Установить лимит строк на странице.
    const onSetLimit = useCallback((newLimit: number): void => {
        setLimit(newLimit)
        const newOffset = normalizeOffset(newLimit, offset)
        setOffset(newOffset)
        setVisibleRows(filteredOrderedRows.slice(newOffset, newOffset + newLimit))
    }, [offset])

    // Изменить смещение отображаемых строк (по сути перейти на другую страницу).
    const onSetOffset = useCallback((newOffset: number): void => {
        setOffset(newOffset)
        setVisibleRows(filteredOrderedRows.slice(newOffset, newOffset + limit))
    }, [limit])

    // Изменить сортировку.
    const onSetOrder = useCallback((
        column: string,
        direction: DataGridOrderingDirection,
        resetOffset: boolean = false,
        valuesType?: DataGridOrderByValuesType
    ): void => {
        if (resetOffset) {
            setOffset(0)
        }
        setOrdering({column, direction, valuesType})
    }, [])

    // Применить фильтры.
    const applyFilters = useCallback((filters: FiltersDataType, resetOffset: boolean = false): void => {
        if (resetOffset) {
            setOffset(0)
        }
        setFilters(filters)
    }, [])

    const contextProps: DataGridContextProps<RowDataType, FiltersDataType> = getDataGridContextDefaults<RowDataType, FiltersDataType>(
        {
            translations: props.translations,

            limits: props.limits,
            limit,
            setLimit: onSetLimit,

            offset,
            setOffset: onSetOffset,

            orderBy: ordering.column,
            orderDirection: ordering.direction,
            setOrder: onSetOrder,

            filters,
            defaultFilters: props.defaultFilters || {} as FiltersDataType,
            applyFilters,

            rows: filteredOrderedRows,
            setRows: onSetRows,
            updateVisibleRows,
            unfilteredRowsCount: props.rows.length,

            visibleRows,
            setVisibleRows,
        })

    const Context = DataGridContext<RowDataType, FiltersDataType>()

    return (
        <Context.Provider
            value={contextProps}
        >
            {props.children}
        </Context.Provider>
    )
}

export default React.memo(DataGrid) as typeof DataGrid
