import React, {useContext} from 'react'
import {AnyObject} from '../../types/Common'
import {dataGridDefaultTranslations} from '../DataGrid/DataGridContext'
import {AsyncDataGridContextProps} from '../../types/AsyncDataGrid'

// Лимиты количества строк в таблице.
export const asyncDataGridDefaultLimits: AsyncDataGridContextProps['limits'] = [10, 20, 50]
export const asyncDataGridDefaultLimit: AsyncDataGridContextProps['limit'] = 20

// Стандартные значения для контекста.
const defaultProps: AsyncDataGridContextProps<AnyObject, AnyObject> = {
    translations: dataGridDefaultTranslations,

    initialized: false,
    drawsCount: 0,
    loading: false,
    setIsLoading(){},
    loadingError: false,
    validationErrors: null,
    storeStateInUrlQuery: false,

    apiUrl: '',

    filters: {},
    defaultFilters: {},
    forcedFilters: {},
    applyFilters() {},
    resetFilters() {},
    isFiltersPanelOpened: false,
    setIsFiltersPanelOpened() {},

    rows: [],
    totalCount: null,
    setRows() {},
    updateRows() {},
    updateRow() {},
    setTotalCount() {},
    permissions: {},
    setPermissions() {},
    selectedRows: [],
    setSelectedRows() {},
    selectRow() {},

    reload() {},

    offset: 0,
    setOffset() {},

    limits: asyncDataGridDefaultLimits,
    defaultLimit: asyncDataGridDefaultLimit,
    limit: asyncDataGridDefaultLimit,
    setLimit() {},

    defaultOrderBy: null,
    defaultOrderDirection: 'asc',
    orderBy: null,
    orderDirection: 'asc',
    setOrder() {},
}

// Стандартные значения для контекста, объединенные с опционально переданными значениями.
export function getAsyncDataGridContextDefaults<RowDataType extends object = AnyObject, FiltersDataType extends object = AnyObject>(
    props?: Partial<AsyncDataGridContextProps<RowDataType, FiltersDataType>>
): AsyncDataGridContextProps<RowDataType, FiltersDataType> {
    return {
        ...defaultProps as unknown as AsyncDataGridContextProps<RowDataType, FiltersDataType>,
        ...Object.fromEntries(
            Object.entries(props ?? {})
                .filter(entry => entry[1] !== undefined)
        ),
    }
}

// Контекст для таблиц с данными, получаемыми с сервера (<AsyncDataGrid>).
const AsyncDataGridContextInstance = React.createContext<AsyncDataGridContextProps>(
    getAsyncDataGridContextDefaults()
)

// Правильная типизация контекста.
function AsyncDataGridContext<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(): React.Context<AsyncDataGridContextProps<RowDataType, FiltersDataType>> {
    return AsyncDataGridContextInstance as unknown as React.Context<AsyncDataGridContextProps<RowDataType, FiltersDataType>>
}

export default AsyncDataGridContext

// Хук для получения контекста.
export function useAsyncDataGridContext<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(): AsyncDataGridContextProps<RowDataType, FiltersDataType> {
    return useContext(AsyncDataGridContext<RowDataType, FiltersDataType>())
}
