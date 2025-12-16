import {
    useEffect,
    useEffectEvent,
    useMemo,
    useRef,
} from 'react'
import {useUrlQueryParams} from '../../helpers/useUrlQueryParams'
import {AnyObject} from '../../types'
import {DataGridOrderingDirection} from '../DataGrid/DataGridTypes'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {
    AsyncDataGridStateForUrlQuery,
    AsyncDataGridUrlQueryManagerProps,
} from './AsyncDataGridTypes'

// Хранение и восстановление состояния таблицы из URL query.
export function AsyncDataGridUrlQueryManager<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject,
>(props: AsyncDataGridUrlQueryManagerProps) {

    const {
        urlQueryParamName = 'state',
        onReady,
    } = props

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
    const [
        urlQueryParams,
        setUrlQueryParams,
    ] = useUrlQueryParams({})

    const urlQueryParamProcessed = useRef<boolean>(false)

    // Хеш настроек "по умолчанию".
    const defaultHash: string = useMemo(
        () => encodeAsyncDataGridState(
            defaultLimit,
            0,
            defaultOrderBy,
            defaultOrderDirection,
            defaultFilters
        ),
        [defaultLimit, defaultOrderBy, defaultOrderDirection, defaultFilters]
    )

    // Предыдущий хеш.
    const contextHash = useMemo(
        () => encodeAsyncDataGridState(limit, offset, orderBy, orderDirection, filters),
        [limit, offset, orderBy, orderDirection, JSON.stringify(filters)]
    )

    // Новый хеш.
    const urlQueryHash = urlQueryParams.get(urlQueryParamName) ?? defaultHash

    // Обрабатываем изменение состояния в AsyncDataGridContext.
    // и обновляем состояние URL Query, если требуется.
    const onContextStateChange = () => {
        if (
            urlQueryParamProcessed.current
            && contextHash !== urlQueryParams.get(urlQueryParamName)
        ) {
            urlQueryParams.set(urlQueryParamName, contextHash)
            setUrlQueryParams(urlQueryParams)
        }
    }

    // Обрабатываем изменение состояния в AsyncDataGridContext.
    // Возможно, нужно обновить состояние URL Query.
    useEffect(
        onContextStateChange,
        // Не нужно тут реагировать на изменение urlQueryHash или urlQueryParams!
        // Будет бесконечное обновление.
        [contextHash, urlQueryParamName]
    )

    // Обработка изменения состояния в URL Query
    // и обновление состояния AsyncDataGridContext, если требуется.
    // Не перемещать выше onContextStateChange()!
    const onUrlQueryHashChange = useEffectEvent(() => {
        urlQueryParamProcessed.current = true
        if (contextHash === urlQueryHash) {
            // Ничего не изменилось.
            return
        }
        const data = decodeAsyncDataGridState<FiltersDataType>(
            urlQueryHash,
            defaultLimit,
            defaultOrderBy,
            defaultOrderDirection
        )
        if (!data) {
            // Не удалось декодировать состояние: сбрасываем в состояние "по умолчанию".
            urlQueryParams.delete(urlQueryParamName)
            setUrlQueryParams(urlQueryParams)
            return
        }
        // Никогда не передавать true в resetOffset в applyFilters/resetFilters!
        if (data.filters) {
            applyFilters(data.filters, false)
        } else {
            resetFilters(false)
        }
        setLimit(data.limit)
        setOffset(data.offset)
        if (data.orderBy) {
            setOrder(data.orderBy, data.orderDirection)
        }
    })

    // Отлавливаем изменения состояния в URL Query.
    // Не перемещать выше onContextStateChange()!
    useEffect(
        onUrlQueryHashChange,
        [urlQueryHash]
    )

    // При монтировании компонента выполнить props.onReady после небольшого тайм-аута.
    useEffect(() => {
        if (onReady) {
            setTimeout(() => onReady(), 100)
        }
    }, [urlQueryParamName])

    return null
}

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
export function decodeAsyncDataGridState<FiltersDataType extends object = object>(
    value: string | null,
    defaultLimit: number,
    defaultOrderBy: string | null,
    defaultOrderDirection: DataGridOrderingDirection
): NormalizedAsyncDataGridState<FiltersDataType> | null {
    if (!value || value.trim() === '') {
        return null
    }
    try {
        const data: AsyncDataGridStateForUrlQuery<FiltersDataType> = JSON.parse(value)
        if (typeof data !== 'object') {
            return null
        }
        return normalizeAsyncDataGridState<FiltersDataType>(
            data,
            defaultLimit,
            defaultOrderBy,
            defaultOrderDirection
        )
    } catch (_e) {
        return null
    }
}

export interface NormalizedAsyncDataGridState<FiltersDataType extends object = object> {
    limit: number
    offset: number
    orderBy: string | null
    orderDirection: DataGridOrderingDirection
    filters: FiltersDataType | null
}

// Нормализация значений состояния таблицы данных.
export function normalizeAsyncDataGridState<FiltersDataType extends object = object>(
    data: AsyncDataGridStateForUrlQuery<FiltersDataType>,
    defaultLimit: number,
    defaultOrderBy: string | null,
    defaultOrderDirection: DataGridOrderingDirection
): NormalizedAsyncDataGridState<FiltersDataType> {
    const ret: NormalizedAsyncDataGridState<FiltersDataType> = {
        limit: defaultLimit,
        offset: 0,
        orderBy: defaultOrderBy,
        orderDirection: defaultOrderDirection,
        filters: null,
    }
    // noinspection SuspiciousTypeOfGuard
    if (data.l && typeof data.l !== 'number' && data.l > 0) {
        ret.limit = data.l
    }
    // noinspection SuspiciousTypeOfGuard
    if (data.o && typeof data.o === 'number' && data.o >= 0) {
        ret.offset = data.o
    }
    // noinspection SuspiciousTypeOfGuard
    if (
        data.sb
        && typeof data.sb === 'string'
    ) {
        ret.orderBy = data.sb
    }

    if (
        data.sd
        && (data.sd === 'asc' || data.sd === 'desc')
    ) {
        ret.orderDirection = data.sd
    }
    // noinspection SuspiciousTypeOfGuard
    if (data.f && typeof data.f === 'object') {
        ret.filters = {...data.f}
    }
    return ret
}
