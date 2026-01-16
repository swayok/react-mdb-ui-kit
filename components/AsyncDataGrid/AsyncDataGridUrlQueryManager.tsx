import {
    useEffect,
    useEffectEvent,
    useMemo,
} from 'react'
import {decodeAsyncDataGridState} from '../../helpers/data_grid/decodeAsyncDataGridState'
import {encodeAsyncDataGridState} from '../../helpers/data_grid/encodeAsyncDataGridState'
import {useUrlQueryParams} from '../../helpers/useUrlQueryParams'
import {AnyObject} from '../../types'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AsyncDataGridUrlQueryManagerProps} from './AsyncDataGridTypes'

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
        drawsCount,
    } = useAsyncDataGridContext<RowDataType, FiltersDataType>()

    // Параметры URL.
    const [
        urlQueryParams,
        setUrlQueryParams,
    ] = useUrlQueryParams({})

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

    // Обрабатываем изменение состояния в AsyncDataGridContext
    // и обновляем состояние URL Query, если требуется.
    const onContextStateChange = () => {
        if (
            drawsCount > 0
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
        [drawsCount]
    )

    // Обработка изменения состояния в URL Query
    // и обновление состояния AsyncDataGridContext, если требуется.
    // Не перемещать выше onContextStateChange()!
    const onUrlQueryHashChange = useEffectEvent(() => {
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
