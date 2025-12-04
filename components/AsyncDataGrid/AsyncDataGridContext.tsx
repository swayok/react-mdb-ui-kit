import {
    Context,
    createContext,
    useContext,
} from 'react'
import {AnyObject} from '../../types'
import {dataGridDefaultTranslations} from '../DataGrid/DataGridContext'
import {AsyncDataGridContextProps} from './AsyncDataGridTypes'

// Лимиты количества строк в таблице.
export const asyncDataGridDefaultLimits: AsyncDataGridContextProps['limits'] = [10, 20, 50]

export const asyncDataGridDefaultLimit: AsyncDataGridContextProps['limit'] = 20

// Контекст для таблиц с данными, получаемыми с сервера (<AsyncDataGrid>).
export const AsyncDataGridContext = createContext<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AsyncDataGridContextProps<any, any>
>({
    translations: dataGridDefaultTranslations,

    initialized: false,
    drawsCount: 0,
    loading: false,
    setIsLoading() {
    },
    loadingError: false,
    validationErrors: null,
    storeStateInUrlQuery: false,

    apiUrl: '',

    filters: {},
    defaultFilters: {},
    forcedFilters: {},
    applyFilters() {
    },
    resetFilters() {
    },
    isFiltersPanelOpened: false,
    setIsFiltersPanelOpened() {
    },

    rows: [],
    totalCount: null,
    setRows() {
    },
    updateRows() {
    },
    updateRow() {
    },
    setTotalCount() {
    },
    permissions: {},
    setPermissions() {
    },
    selectedRows: [],
    setSelectedRows() {
    },
    selectRow() {
    },

    reload() {
    },

    offset: 0,
    setOffset() {
    },

    limits: asyncDataGridDefaultLimits,
    defaultLimit: asyncDataGridDefaultLimit,
    limit: asyncDataGridDefaultLimit,
    setLimit() {
    },

    defaultOrderBy: null,
    defaultOrderDirection: 'asc',
    orderBy: null,
    orderDirection: 'asc',
    setOrder() {
    },
})

// Получить контекст для асинхронных таблиц данных (<AsyncDataGrid>) с правильной типизацией.
export function getAsyncDataGridContextInstance<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject,
>(): Context<AsyncDataGridContextProps<RowDataType, FiltersDataType>> {
    return AsyncDataGridContext as Context<AsyncDataGridContextProps<RowDataType, FiltersDataType>>
}

// Хук для получения контекста.
export function useAsyncDataGridContext<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject,
>(): AsyncDataGridContextProps<RowDataType, FiltersDataType> {
    return useContext(AsyncDataGridContext as Context<AsyncDataGridContextProps<RowDataType, FiltersDataType>>)
}
