import {AsyncDataGridRows} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import {ApiRequestService} from '../../services/ApiRequestService'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {DataGridOrderingDirection} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

// Имя ключа, используемого для отправки фильтров в API.
export const asyncDataGridApiFiltersKey = 'filters'

// Сервис для загрузки данных с сервера для таблицы.
export const AsyncDataGridApi = {

    /**
     * Запросить список строк для таблицы через GET запрос.
     */
    async getRows<
        RowDataType extends object = AnyObject,
        FiltersDataType extends object = AnyObject,
    >(
        url: string,
        apiMethod: 'GET' | 'POST',
        config: {
            limit?: number,
            offset?: number,
            order?: { column: string, direction: DataGridOrderingDirection }[]
        },
        filters?: FiltersDataType,
        abortController?: AbortController
    ): Promise<AsyncDataGridRows<RowDataType>> {
        const effectiveFilters: AnyObject = removeEmptyFiltersForAsyncDataGrid(filters)
        return ApiRequestService[apiMethod === 'POST' ? 'post' : 'get']<
            AsyncDataGridRows<RowDataType>
        >(
            url,
            {
                ...config,
                [asyncDataGridApiFiltersKey]: effectiveFilters,
            },
            {timeout: 60000},
            abortController
        )
            .then(response => response.data)
    },

    /**
     * Запросить список строк для таблицы через POST запрос.
     */
    async getRowsAsPost<
        RowDataType extends object = AnyObject,
        FiltersDataType extends object = AnyObject,
    >(
        url: string,
        config: {
            limit?: number,
            offset?: number,
            order?: { column: string, direction: DataGridOrderingDirection }[]
        },
        filters?: FiltersDataType,
        abortController?: AbortController
    ): Promise<AsyncDataGridRows<RowDataType>> {
        const effectiveFilters: AnyObject = removeEmptyFiltersForAsyncDataGrid(filters)
        return ApiRequestService
            .post<AsyncDataGridRows<RowDataType>>(
                url,
                {
                    ...config,
                    [asyncDataGridApiFiltersKey]: effectiveFilters,
                },
                {timeout: 60000},
                abortController
            )
            .then(response => response.data)
    },
}

// Получить набор фильтров, которые имеют не пустое значение.
export function removeEmptyFiltersForAsyncDataGrid(filters?: object | null): AnyObject {
    const notEmptyFilters: AnyObject = {}
    if (filters) {
        for (const filterName in filters) {
            const value = (filters as AnyObject)[filterName]
            // Удаляем фильтры с пустыми значениями (null, пустая строка, пустой массив).
            if (
                value === null
                || (
                    typeof value === 'string'
                    && String(value).trim() === ''
                )
                || (
                    Array.isArray(value)
                    && (value as unknown[]).length === 0
                )
            ) {
                continue
            }
            notEmptyFilters[filterName] = value
        }
    }
    return notEmptyFilters
}
