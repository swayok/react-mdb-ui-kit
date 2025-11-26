import React, {useEffect, useState} from 'react'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {DataGridOrderingDirection} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'
import {useUrlQueryParams} from '../../helpers/useUrlQueryParams'
import {AsyncDataGridStateForUrlQuery, AsyncDataGridUrlQueryManagerProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'

// Хранение и восстановление состояния таблицы из URL query.
function AsyncDataGridUrlQueryManager<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(props: AsyncDataGridUrlQueryManagerProps) {

    const {
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        defaultFilters,
        defaultLimit,
        defaultOrderBy,
        defaultOrderDirection,
        applyFilters,
        resetFilters,
        setOrder,
        setLimit,
        setOffset,
    } = useAsyncDataGridContext<RowDataType, FiltersDataType>()

    // Параметры URL.
    const [urlQueryParams, setUrlQueryParams] = useUrlQueryParams({})

    // Предыдущий хеш.
    const [prevHash, setPrevHash] = useState<string>(
        encodeAsyncDataGridState(limit, offset, orderBy, orderDirection, filters)
    )

    const urlQueryParamName: string = props.urlQueryParamName === true
        ? 'state'
        : props.urlQueryParamName

    // Проверяем есть ли в URL Query параметры для таблицы.
    useEffect(() => {
        if (urlQueryParams.has(urlQueryParamName)) {
            const hash: string = urlQueryParams.get(urlQueryParamName)!
            if (prevHash === hash) {
                // Ничего не изменилось.
                return
            }
            const data: Partial<AsyncDataGridStateForUrlQuery> | null = decodeAsyncDataGridState(hash)
            if (!data) {
                return
            }
            // Восстановление состояния выборки.
            // noinspection SuspiciousTypeOfGuard
            if (data.l && typeof data.l === 'number') {
                setLimit(data.l)
            } else {
                setLimit(defaultLimit)
            }
            // noinspection SuspiciousTypeOfGuard
            if (data.o && typeof data.o === 'number') {
                setOffset(data.o)
            } else {
                setOffset(0)
            }
            // noinspection SuspiciousTypeOfGuard
            if (
                data.sb && typeof data.sb === 'string'
                && data.sd
                && (data.sd === 'asc' || data.sd === 'desc')
            ) {
                setOrder(data.sb, data.sd)
            } else if (defaultOrderBy) {
                setOrder(defaultOrderBy, defaultOrderDirection)
            }
            // noinspection SuspiciousTypeOfGuard
            if (data.f && typeof data.f === 'object') {
                applyFilters({...(data.f as FiltersDataType)}, false)
            } else {
                resetFilters(false)
            }
            setPrevHash(hash)
        } else {
            // Параметра нет в URL query: проверяем хеш параметров по-умолчанию.
            const hash: string = encodeAsyncDataGridState(
                defaultLimit,
                0,
                defaultOrderBy,
                defaultOrderDirection,
                defaultFilters
            )
            if (prevHash === hash) {
                // Ничего не изменилось.
                return
            }
            // Применяем значения по умолчанию.
            setLimit(defaultLimit)
            setOffset(0)
            if (defaultOrderBy) {
                setOrder(defaultOrderBy, defaultOrderDirection)
            }
            resetFilters(false)
            setPrevHash(hash)
        }
    }, [urlQueryParams, prevHash, urlQueryParamName])

    // При монтировании компонента выполнить props.onReady после небольшого таймаута
    useEffect(() => {
        if (props.onReady) {
            setTimeout(props.onReady, 100)
        }
    }, [urlQueryParamName])

    // Получен новый набор данных.
    useEffect(() => {
        const hash: string = encodeAsyncDataGridState(limit, offset, orderBy, orderDirection, filters)
        if (hash !== prevHash) {
            setPrevHash(hash)
            urlQueryParams.set(urlQueryParamName, hash)
            setUrlQueryParams(urlQueryParams)
        }
    }, [limit, offset, orderBy, orderDirection, filters, prevHash, urlQueryParamName])

    return null
}

export default React.memo(AsyncDataGridUrlQueryManager) as typeof AsyncDataGridUrlQueryManager

// Конвертирует параметры выборки в строку.
export function encodeAsyncDataGridState(
    limit: number | null,
    offset: number | null,
    orderBy: string | null,
    orderDirection: DataGridOrderingDirection | null,
    filters: object | null
): string {
    const data: AsyncDataGridStateForUrlQuery = {}
    if (limit) {
        data.l = limit
    }
    if (offset) {
        data.o = offset
    }
    if (orderBy) {
        data.sb = orderBy
        data.sd = orderDirection ?? 'asc'
    }
    if (filters && Object.keys(filters).length > 0) {
        data.f = filters
    }
    return JSON.stringify(data)
}

// Конвертирует строку из URL query в параметры выборки.
export function decodeAsyncDataGridState(value: string | null): Partial<AsyncDataGridStateForUrlQuery> | null {
    if (!value || value.trim() === '') {
        return null
    }
    try {
        const data: AsyncDataGridStateForUrlQuery = JSON.parse(value)
        if (typeof data !== 'object') {
            return null
        }
        return data
    } catch (_e) {
        return null
    }
}
