import {
    Context,
    createContext,
    useContext,
} from 'react'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {
    DataGridContextProps,
    DataGridTranslations,
} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

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

// Контекст для таблиц данных (<DataGrid>).
export const DataGridContext = createContext<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DataGridContextProps<any, any>
>({
    translations: dataGridDefaultTranslations,
    loading: false,
    setIsLoading() {
    },

    filters: {},
    defaultFilters: {},
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
})

// Получить контекст для таблиц данных (<DataGrid>) с правильной типизацией.
export function getDataGridContextInstance<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject,
>(): Context<DataGridContextProps<RowDataType, FiltersDataType>> {
    return DataGridContext as Context<DataGridContextProps<RowDataType, FiltersDataType>>
}

// Хук для получения контекста.
export function useDataGridContext<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject,
>(): DataGridContextProps<RowDataType, FiltersDataType> {
    return useContext(DataGridContext as Context<DataGridContextProps<RowDataType, FiltersDataType>>)
}
