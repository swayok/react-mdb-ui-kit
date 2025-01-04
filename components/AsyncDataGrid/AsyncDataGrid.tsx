import React, {useCallback, useEffect, useState} from 'react'
import AsyncDataGridContext, {asyncDataGridDefaultLimit, getAsyncDataGridContextDefaults} from './AsyncDataGridContext'
import AsyncDataGridService from './AsyncDataGridService'
import {ApiError} from '../../services/ApiRequestService'
import {handleErrorResponse} from '../../helpers/ApiRequestErrorHelpers'
import {normalizeOffset} from '../DataGrid/dataGridHelpers'
import {AsyncDataGridContextProps, AsyncDataGridProps, AsyncDataGridRows} from '../../types/AsyncDataGrid'
import {AnyObject} from '../../types/Common'
import {DataGridOrderingDirection} from '../../types/DataGrid'
import DataGridContext from '../DataGrid/DataGridContext'
import AsyncDataGridUrlQueryManager from './AsyncDataGridUrlQueryManager'
import toggleValueInArray from '../../helpers/toggleValueInArray'

// Обертка таблицы с данными, получаемыми с сервера (настройка контекста).
function AsyncDataGrid<
    RowDataType extends object,
    FiltersDataType extends object = AnyObject
>(props: AsyncDataGridProps<FiltersDataType>) {

    // Состояние готовности компонента.
    const [
        initialized,
        setIsInitialized,
    ] = useState<boolean>(false)
    // Количество запросов к API.
    const [
        drawsCount,
        setDrawsCount,
    ] = useState<AsyncDataGridContextProps['drawsCount']>(0)
    // Состояние загрузки данных из API.
    const [
        loading,
        setIsLoading,
    ] = useState<AsyncDataGridContextProps['loading']>(!!props.storeStateInUrlQuery)
    const [
        loadingError,
        setLoadingError,
    ] = useState<AsyncDataGridContextProps['loadingError']>(false)
    // Ограничение количества строк.
    const [
        limit,
        setLimit,
    ] = useState<AsyncDataGridContextProps['limit']>(props.defaultLimit || props.limits?.[0] || asyncDataGridDefaultLimit)
    // Смещение выборки строк.
    const [
        offset,
        setOffset,
    ] = useState<AsyncDataGridContextProps['offset']>(props.startingOffset || 0)
    // Сортировка.
    const [
        orderBy,
        setOrderBy,
    ] = useState<AsyncDataGridContextProps['orderBy']>(props.defaultOrderBy || null)
    const [
        orderDirection,
        setOrderDirection,
    ] = useState<AsyncDataGridContextProps['orderDirection']>(props.defaultOrderDirection || 'asc')
    // Фильтры.
    const [
        isFiltersPanelOpened,
        setIsFiltersPanelOpened,
    ] = useState<boolean>(!!props.showFiltersPanelByDefault)
    const [
        filters,
        setFilters,
    ] = useState<FiltersDataType>({
        ...(props.defaultFilters || {}),
        ...(props.startingFilters || {}),
    } as FiltersDataType)
    // Строки.
    const [
        rows,
        setRows,
    ] = useState<Array<RowDataType>>([])
    // Всего строк.
    const [
        totalCount,
        setTotalCount,
    ] = useState<number | null>(null)
    // Разрешения для действий со строками.
    const [
        permissions,
        setPermissions,
    ] = useState<AnyObject<boolean>>({})
    // Идентификаторы выбранных строк.
    const [
        selectedRows,
        setSelectedRows,
    ] = useState<Array<number | string>>([])

    const selectRow = useCallback(
        (rowId: number | string, selected: boolean) => {
            setSelectedRows(ids => toggleValueInArray(ids, rowId, selected))
        },
        []
    )

    // Контроллер отмены запроса к API.
    const [
        abortController,
        setAbortController,
    ] = useState<AbortController | null>(null)

    // Установить лимит строк на странице.
    const onSetLimit = useCallback((newLimit: number): void => {
        setLimit(newLimit)
        setOffset(normalizeOffset(newLimit, offset))
        setDrawsCount(drawsCount => drawsCount + 1)
    }, [offset])

    // Изменить смещение отображаемых строк (по сути перейти на другую страницу).
    const onSetOffset = useCallback((offset: number): void => {
        setOffset(offset)
        setDrawsCount(drawsCount => drawsCount + 1)
    }, [])

    // Изменить сортировку.
    const onSetOrder = useCallback((
        column: string,
        direction: DataGridOrderingDirection,
        resetOffset: boolean = false
    ): void => {
        if (resetOffset) {
            setOffset(0)
        }
        setOrderBy(column)
        setOrderDirection(direction)
        setDrawsCount(drawsCount => drawsCount + 1)
    }, [])

    // Применить фильтры.
    const applyFilters = useCallback(
        (
            filters: FiltersDataType,
            resetOffset: boolean = false
        ): void => {
            if (resetOffset) {
                setOffset(0)
            }
            setFilters(filters)
            setDrawsCount(drawsCount => drawsCount + 1)
        },
        []
    )

    // Сбросить фильтры к значениям "по умолчанию".
    const resetFilters = useCallback(
        (resetOffset: boolean = false): void => {
            applyFilters(
                (props.defaultFilters ? {...props.defaultFilters} : {}) as FiltersDataType,
                resetOffset
            )
        },
        [applyFilters]
    )

    // Получен новый набор строк.
    const onSetRows = useCallback((newRows: Array<RowDataType>, newTotalCount?: number) => {
        setRows(newRows)
        if (newTotalCount !== undefined) {
            setTotalCount(newTotalCount)
        }
        // Сбрасываем выбранные строки.
        setSelectedRows([])
    }, [])

    // Обновление данные в текущем наборе строк.
    // Так можно внести изменения в одну или несколько строк,
    // не перезагружая данные из API.
    const updateRows = useCallback((callback: (rows: Array<RowDataType>) => Array<RowDataType>): void => {
        setRows(callback)
    }, [])

    // Изменение данных одной строки.
    const updateRow = useCallback((
        updates: Partial<RowDataType>,
        matcher: string | ((row: RowDataType, updates: Partial<RowDataType>) => boolean) = 'id',
        replace: boolean = false
    ) => {
        let matcherFn: ((row: RowDataType, updates: Partial<RowDataType>) => boolean)
        if (!matcher || typeof matcher === 'string') {
            const key: string = matcher || 'id'
            matcherFn = (row: RowDataType, updates: Partial<RowDataType>): boolean => (
                key in updates
                && key in row
                && row[key as keyof RowDataType] === updates[key as keyof RowDataType]
            )
        } else {
            matcherFn = matcher
        }
        //const matcherFn = matcher || (row: RowDataType, updates: Partial<RowDataType>) => rowMatcherById<RowDataType>(row, updates, matcher || 'id')
        updateRows((rows: Array<RowDataType>) => rows.map(
            (row: RowDataType) => {
                if (!matcherFn(row, updates)) {
                    return row
                }
                return replace
                    ? updates as RowDataType
                    : {...row, ...updates}
            }
        ))
    }, [])

    // Загрузить новый набор строк.
    const loadData = useCallback((silent: boolean = false): void => {
        abortController?.abort()
        const newAbortController: AbortController = new AbortController()
        setAbortController(newAbortController)
        setLoadingError(false)
        if (!silent) {
            setIsLoading(true)
        }
        AsyncDataGridService.getRows<RowDataType, FiltersDataType>(
            props.apiUrl,
            props.apiMethod || 'GET',
            {
                limit,
                offset,
                order: orderBy
                    ? [{column: orderBy, direction: orderDirection}]
                    : undefined,
            },
            {...filters, ...props.forcedFilters},
            newAbortController
        )
            .then((response: AsyncDataGridRows<RowDataType>) => {
                onSetRows(response.records || [], response.count || 0)
                if (response.permissions) {
                    setPermissions(response.permissions)
                }
                setIsLoading(false)
            })
            .catch((error: ApiError) => {
                if (error.errorType !== 'abort') {
                    handleErrorResponse(error)
                    setLoadingError(true)
                    setIsLoading(false)
                }
            })
    }, [props.apiUrl, filters, limit, offset, orderBy, orderDirection])

    // Перезагрузка набора строк из API.
    const reload = useCallback((silent?: boolean) => {
        loadData(silent)
    }, [loadData])

    // Загрузка данных при изменении URL, фильтров или кол-ва выборок.
    useEffect(() => {
        if (initialized) {
            loadData()
        }
    }, [props.apiUrl, filters, drawsCount, initialized])

    // Изменено общее количество строк или смещение.
    useEffect(() => {
        if (totalCount && offset > totalCount) {
            // Общее количество строк в БД стало меньше чем смещение.
            // Нужно изменить смещение, чтобы отображалась последняя страница.
            setOffset((Math.ceil(totalCount / limit) - 1) * limit)
            setDrawsCount(drawsCount + 1)
        }
    }, [offset, totalCount])

    // Монтаж/демонтаж компонента.
    useEffect(() => {
        if (!props.storeStateInUrlQuery) {
            setIsInitialized(true)
        }
        return () => {
            // Отмена активного запроса к API при демонтаже таблицы.
            setAbortController(abortController => {
                abortController?.abort()
                return null
            })
        }
    }, [])

    // Свойства контекста.
    const contextProps: AsyncDataGridContextProps<
        RowDataType,
        FiltersDataType
    > = getAsyncDataGridContextDefaults<RowDataType, FiltersDataType>({
        translations: props.translations,

        apiUrl: props.apiUrl,

        initialized,
        drawsCount,
        loading,
        setIsLoading,
        loadingError,
        preloaderProps: props.preloaderProps,
        storeStateInUrlQuery: props.storeStateInUrlQuery,

        limits: props.limits,
        defaultLimit: props.defaultLimit || asyncDataGridDefaultLimit,
        limit,
        setLimit: onSetLimit,

        offset,
        setOffset: onSetOffset,

        filters,
        defaultFilters: props.defaultFilters || {} as FiltersDataType,
        forcedFilters: props.forcedFilters || {},
        applyFilters,
        resetFilters,
        isFiltersPanelOpened,
        setIsFiltersPanelOpened,

        defaultOrderBy: props.defaultOrderBy,
        defaultOrderDirection: props.defaultOrderDirection,
        orderBy,
        orderDirection,
        setOrder: onSetOrder,

        rows,
        totalCount,
        setRows: onSetRows,
        updateRows,
        updateRow,
        setTotalCount,
        permissions,
        setPermissions,
        selectedRows,
        setSelectedRows,
        selectRow,
        reload,
    })

    const AsyncContext = AsyncDataGridContext<RowDataType, FiltersDataType>()
    const SimpleContext = DataGridContext<RowDataType, FiltersDataType>()

    // Тут придется обернуть контекст в контекст т.к. некоторые общие
    // компоненты используют данные из контекста DataGridContext.
    return (
        <SimpleContext.Provider
            value={{
                ...contextProps,
                unfilteredRowsCount: totalCount || 0,
                visibleRows: rows,
                setVisibleRows(): void {
                },
                updateVisibleRows(): void {
                },
            }}
        >
            <AsyncContext.Provider
                value={contextProps}
            >
                {contextProps.storeStateInUrlQuery && (
                    <AsyncDataGridUrlQueryManager
                        urlQueryParamName={contextProps.storeStateInUrlQuery}
                        onReady={() => {
                            if (!initialized) {
                                setIsInitialized(true)
                            }
                        }}
                    />
                )}
                {props.children}
            </AsyncContext.Provider>
        </SimpleContext.Provider>
    )
}

export default React.memo(AsyncDataGrid) as typeof AsyncDataGrid
