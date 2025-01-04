import ApiRequestService from '../../services/ApiRequestService'
import {AnyObject} from '../../types/Common'
import {DataGridOrderingDirection} from '../../types/DataGrid'
import {AsyncDataGridRows} from '../../types/AsyncDataGrid'

// Сервис для загрузки данных с сервера для таблицы.
export default class AsyncDataGridService {

    /**
     * Запросить список строк для таблицы через GET запрос.
     */
    static async getRows<
        RowDataType extends object = AnyObject,
        FiltersDataType extends object = AnyObject,
    >(
        url: string,
        apiMethod: 'GET' | 'POST',
        config: {
            limit?: number,
            offset?: number,
            order?: Array<{ column: string, direction: DataGridOrderingDirection }>
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
                filters: effectiveFilters,
            },
            {timeout: 60000},
            abortController
        )
            .then(response => response.data)
    }

    /**
     * Запросить список строк для таблицы через POST запрос.
     */
    static async getRowsAsPost<
        RowDataType extends object = AnyObject,
        FiltersDataType extends object = AnyObject,
    >(
        url: string,
        config: {
            limit?: number,
            offset?: number,
            order?: Array<{ column: string, direction: DataGridOrderingDirection }>
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
                    filters: effectiveFilters,
                },
                {timeout: 60000},
                abortController
            )
            .then(response => response.data)
    }
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
                    && (value as Array<unknown>).length === 0
                )
            ) {
                continue
            }
            notEmptyFilters[filterName] = value
        }
    }
    return notEmptyFilters
}
