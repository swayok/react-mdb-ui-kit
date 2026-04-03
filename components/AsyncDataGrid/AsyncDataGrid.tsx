import {
    type MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import {handleErrorResponse} from '../../helpers/api/ApiRequestErrorHelpers'
import {toggleValueInArray} from '../../helpers/form/toggleValueInArray'
import {useEventCallback} from '../../helpers/useEventCallback'
import type {ApiError} from '../../services/ApiRequestService'
import type {AnyObject} from '../../types'
import {
    DataGridContext,
    dataGridDefaultTranslations,
} from '../DataGrid/DataGridContext'
import {normalizeOffset} from '../DataGrid/dataGridHelpers'
import type {
    DataGridContextProps,
    DataGridOrderingDirection,
} from '../DataGrid/DataGridTypes'
import {AsyncDataGridApi} from './AsyncDataGridApi'
import {
    AsyncDataGridContext,
    asyncDataGridDefaultLimit,
    asyncDataGridDefaultLimits,
} from './AsyncDataGridContext'
import type {
    AsyncDataGridContextMenuApi,
    AsyncDataGridContextProps,
    AsyncDataGridProps,
    AsyncDataGridRows,
} from './AsyncDataGridTypes'
import {AsyncDataGridUrlQueryManager} from './AsyncDataGridUrlQueryManager'

// Обертка таблицы с данными, получаемыми с сервера (настройка контекста).
export function AsyncDataGrid<
    RowDataType extends object,
    FiltersDataType extends object = AnyObject,
>(props: AsyncDataGridProps<FiltersDataType, RowDataType>) {

    const {
        storeStateInUrlQuery,
        startingOffset = 0,
        limits = asyncDataGridDefaultLimits,
        defaultLimit = limits?.[0] ?? asyncDataGridDefaultLimit,
        defaultOrderBy = null,
        defaultOrderDirection = 'asc',
        showFiltersPanelByDefault = false,
        forcedFilters = {} as FiltersDataType,
        defaultFilters = {} as FiltersDataType,
        startingFilters = {} as FiltersDataType,
        apiUrl,
        apiMethod = 'GET',
        preloaderProps,
        translations = dataGridDefaultTranslations,
        ContextMenu,
        children,
    } = props

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
    // Количество изменений свойств, приводящих к запуску запроса к API.
    const [
        changesCount,
        setChangesCount,
    ] = useState<number>(0)
    // Состояние загрузки данных из API.
    const [
        loading,
        setIsLoading,
    ] = useState<AsyncDataGridContextProps['loading']>(!!storeStateInUrlQuery)
    const [
        loadingError,
        setLoadingError,
    ] = useState<AsyncDataGridContextProps['loadingError']>(false)
    const [
        validationErrors,
        setValidationErrors,
    ] = useState<AnyObject | null>(null)
    // Ограничение количества строк.
    const [
        limit,
        setLimit,
    ] = useState<AsyncDataGridContextProps['limit']>(defaultLimit)
    // Смещение выборки строк.
    const [
        offset,
        setOffset,
    ] = useState<AsyncDataGridContextProps['offset']>(startingOffset)

    // Сортировка.
    const [
        orderBy,
        setOrderBy,
    ] = useState<AsyncDataGridContextProps['orderBy']>(defaultOrderBy)
    const [
        orderDirection,
        setOrderDirection,
    ] = useState<AsyncDataGridContextProps['orderDirection']>(defaultOrderDirection)
    // Фильтры.
    const [
        isFiltersPanelOpened,
        setIsFiltersPanelOpened,
    ] = useState<boolean>(showFiltersPanelByDefault)
    const [
        filters,
        setFilters,
    ] = useState<FiltersDataType>(() => ({
        ...defaultFilters,
        ...startingFilters,
    }))
    // Строки.
    const [
        rows,
        setRows,
    ] = useState<RowDataType[]>([])
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
    ] = useState<(number | string)[]>([])

    // Пометить строку как выбранную.
    const selectRow = useEventCallback(
        (rowId: number | string, selected: boolean) => {
            setSelectedRows(ids => toggleValueInArray(ids, rowId, selected))
        }
    )

    const contextMenuApiRef = useRef<
        AsyncDataGridContextMenuApi<RowDataType>
    >(null)

    // Открыть контекстное меню для строки.
    const openContextMenu: AsyncDataGridContextProps<RowDataType>['openContextMenu'] = useEventCallback((
        event: MouseEvent<HTMLTableRowElement>,
        rowData: RowDataType,
        rowIndex: number,
        setIsProcessing: (isProcessing: boolean) => void
    ) => {
        contextMenuApiRef.current?.open(event, rowData, rowIndex, setIsProcessing)
    })

    // Контроллер отмены запроса к API.
    const [
        abortController,
        setAbortController,
    ] = useState<AbortController | null>(null)

    // Установить лимит строк на странице.
    const onSetLimit = useEventCallback((
        newLimit: number
    ): void => {
        setLimit(newLimit)
        setOffset(normalizeOffset(newLimit, offset))
        setChangesCount(changesCount => changesCount + 1)
    })

    // Изменить смещение отображаемых строк (по сути перейти на другую страницу).
    const onSetOffset = useEventCallback((
        offset: number
    ): void => {
        setOffset(offset)
        setChangesCount(changesCount => changesCount + 1)
    })

    // Изменить сортировку.
    const onSetOrder = useEventCallback((
        column: string,
        direction: DataGridOrderingDirection,
        resetOffset: boolean = false
    ): void => {
        if (resetOffset) {
            setOffset(0)
        }
        setOrderBy(column)
        setOrderDirection(direction)
        setChangesCount(changesCount => changesCount + 1)
    })

    // Применить фильтры.
    const applyFilters = useEventCallback((
        filters: FiltersDataType,
        resetOffset: boolean = false
    ): void => {
        if (resetOffset) {
            setOffset(0)
        }
        setFilters(filters)
        setChangesCount(changesCount => changesCount + 1)
    })

    // Сбросить фильтры к значениям "по умолчанию".
    const resetFilters = useEventCallback((
        resetOffset: boolean = false
    ): void => {
        applyFilters(
            {...defaultFilters},
            resetOffset
        )
    })

    // Получен новый набор строк.
    const onSetRows = useEventCallback((
        newRows: RowDataType[],
        newTotalCount?: number
    ) => {
        setRows(newRows)
        if (newTotalCount !== undefined) {
            setTotalCount(newTotalCount)
        }
        // Сбрасываем выбранные строки.
        setSelectedRows([])
    })

    // Обновление данные в текущем наборе строк.
    // Так можно внести изменения в одну или несколько строк,
    // не перезагружая данные из API.
    const updateRows = useEventCallback((
        callback: (rows: RowDataType[]) => RowDataType[]
    ): void => {
        setRows(callback)
    })

    // Изменение данных одной строки.
    const updateRow = useEventCallback((
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
        updateRows((rows: RowDataType[]) => rows.map(
            (row: RowDataType) => {
                if (!matcherFn(row, updates)) {
                    return row
                }
                return replace
                    ? updates as RowDataType
                    : {...row, ...updates}
            }
        ))
    })

    // Загрузить новый набор строк.
    const loadData = useEventCallback((
        silent: boolean = false
    ): void => {
        abortController?.abort()
        const newAbortController: AbortController = new AbortController()
        setAbortController(newAbortController)
        setLoadingError(false)
        setValidationErrors(null)
        setDrawsCount(drawsCount => drawsCount + 1)
        if (!silent) {
            setIsLoading(true)
        }
        AsyncDataGridApi.getRows<RowDataType, FiltersDataType>(
            apiUrl,
            apiMethod,
            {
                limit,
                offset,
                order: orderBy
                    ? [{column: orderBy, direction: orderDirection}]
                    : undefined,
            },
            {...filters, ...forcedFilters},
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
                    handleErrorResponse(error, {
                        validationErrors(errors) {
                            setValidationErrors(errors)
                        },
                    })
                    setLoadingError(true)
                    setIsLoading(false)
                }
            })
    })

    // Перезагрузка набора строк из API.
    const reload = useEventCallback((
        silent?: boolean
    ) => {
        loadData(silent)
    })

    // Загрузка данных при изменении URL, фильтров или кол-ва выборок.
    useEffect(() => {
        if (initialized) {
            loadData()
        }
    }, [apiUrl, filters, changesCount, initialized])

    // Изменено общее количество строк или смещение.
    useEffect(() => {
        if (totalCount && offset > totalCount) {
            // Общее количество строк в БД стало меньше чем смещение.
            // Нужно изменить смещение, чтобы отображалась последняя страница.
            setOffset((Math.ceil(totalCount / limit) - 1) * limit)
            setChangesCount(changesCount => changesCount + 1)
        }
    }, [offset, totalCount])

    // Монтаж/демонтаж компонента.
    useEffect(() => {
        if (!storeStateInUrlQuery) {
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

    const dummyFn = useCallback(() => {
    }, [])

    // Свойства контекста DataGridContext.
    const simpleContextProps: DataGridContextProps<
        RowDataType,
        FiltersDataType
    > = {
        translations,

        limits,
        limit,
        setLimit: onSetLimit,

        offset,
        setOffset: onSetOffset,

        orderBy,
        orderDirection,
        setOrder: onSetOrder,

        filters,
        defaultFilters,
        applyFilters,

        rows,
        setRows: onSetRows,
        unfilteredRowsCount: totalCount ?? 0,

        visibleRows: rows,
        setVisibleRows: dummyFn,
        updateVisibleRows: dummyFn,

        loading,
        setIsLoading,
        defaultOrderBy,
        defaultOrderDirection,
    }

    // Свойства контекста AsyncDataGridContext.
    const asyncContextProps: AsyncDataGridContextProps<
        RowDataType,
        FiltersDataType
    > = {
        ...simpleContextProps,

        apiUrl,

        initialized,
        drawsCount,
        loadingError,
        validationErrors,
        preloaderProps,
        storeStateInUrlQuery,

        defaultLimit,

        forcedFilters,
        resetFilters,
        isFiltersPanelOpened,
        setIsFiltersPanelOpened,

        totalCount,
        updateRows,
        updateRow,
        setTotalCount,
        permissions,
        setPermissions,
        selectedRows,
        setSelectedRows,
        selectRow,
        openContextMenu: ContextMenu ? openContextMenu : undefined,
        closeContextMenu: ContextMenu ? contextMenuApiRef.current?.close : undefined,
        reload,
    }

    // Тут придется обернуть контекст в контекст т.к. некоторые общие
    // компоненты используют данные из контекста DataGridContext.
    return (
        <DataGridContext.Provider
            value={simpleContextProps}
        >
            <AsyncDataGridContext.Provider
                value={asyncContextProps}
            >
                {asyncContextProps.storeStateInUrlQuery && (
                    <AsyncDataGridUrlQueryManager
                        urlQueryParamName={
                            asyncContextProps.storeStateInUrlQuery === true
                                ? undefined
                                : asyncContextProps.storeStateInUrlQuery
                        }
                        onReady={() => {
                            if (!initialized) {
                                setIsInitialized(true)
                            }
                        }}
                    />
                )}
                {ContextMenu && !loading && (
                    // Контекстное меню должно быть в начале, чтобы можно было вычислить
                    // смещения таблицы относительно страницы.
                    <ContextMenu
                        apiRef={contextMenuApiRef}
                        permissions={permissions}
                    />
                )}
                {children}
            </AsyncDataGridContext.Provider>
        </DataGridContext.Provider>
    )
}
