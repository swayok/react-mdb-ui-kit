import React, {useContext} from 'react'
import {AnyObject} from '../../types/Common'
import {DataGridContextProps, DataGridTranslations} from '../../types/DataGrid'

// Лимиты количества строк в таблице.
export const dataGridDefaultLimits: DataGridContextProps['limits'] = [10, 20, 50]
export const dataGridDefaultLimit: DataGridContextProps['limit'] = 20

// Стандартная локализация таблицы.
export const dataGridDefaultTranslations: DataGridTranslations = {
    filters: {
        header: 'Filters',
        apply: 'Apply',
        reset: 'Reset',
    },
    ordering: {
        header: 'Order by',
        ascending: 'In ascending order',
        descending: 'In descending order',
    },
    items_count: {
        items_total: (totalCount: number): string =>
            `Total: ${totalCount}`,
        items_filtered: (totalCount: number, filteredCount: number): string =>
            `Filtered: ${filteredCount} of ${totalCount}`,
        items_shown: (min: number, max: number): string =>
            `Displayed: from ${min} to ${max}`,
        items_per_page: (value: number): string =>
            `${value} per page`,
    },
    no_items: 'No records',
    loading: 'Loading data...',
    loading_error: 'Failed to load data for table.',
    retry_loading: 'Retry',
    actions: {
        add: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        clone: 'Clone',
    },
}

// Стандартные значения для контекста.
export function getDataGridContextDefaults<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(
    props?: Partial<DataGridContextProps<RowDataType, FiltersDataType>>
): DataGridContextProps<RowDataType, FiltersDataType> {
    const mergedProps: DataGridContextProps<RowDataType, FiltersDataType> = {
        translations: dataGridDefaultTranslations,
        loading: false,
        setIsLoading() {
        },

        filters: {} as FiltersDataType,
        defaultFilters: {} as FiltersDataType,
        applyFilters() {
        },

        unfilteredRowsCount: 0,

        rows: [],
        setRows() {
        },
        updateVisibleRows() {
        },

        visibleRows: [],
        setVisibleRows() {
        },

        offset: 0,
        setOffset() {
        },

        limits: dataGridDefaultLimits,
        limit: dataGridDefaultLimit,
        setLimit() {
        },

        orderBy: null,
        orderDirection: 'asc',
        defaultOrderBy: null,
        defaultOrderDirection: 'asc',
        setOrder() {
        },
    }
    if (props) {
        let propsKey: keyof DataGridContextProps
        for (propsKey in props) {
            if (props[propsKey] !== undefined) {
                // @ts-ignore - shitty ts error
                mergedProps[propsKey] = props[propsKey]
            }
        }
    }
    return mergedProps
}

const DataGridContextInstance = React.createContext<DataGridContextProps>(getDataGridContextDefaults())

// Контекст для таблиц данных (<DataGrid>).
function DataGridContext<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(): React.Context<DataGridContextProps<RowDataType, FiltersDataType>> {
    return DataGridContextInstance as unknown as React.Context<DataGridContextProps<RowDataType, FiltersDataType>>
}

export default DataGridContext

// Хук для получения контекста.
export function useDataGridContext<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(): DataGridContextProps<RowDataType, FiltersDataType> {
    return useContext(DataGridContext<RowDataType, FiltersDataType>())
}
