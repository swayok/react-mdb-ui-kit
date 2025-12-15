import {
    useCallback,
    useEffect,
    useState,
    MouseEvent,
} from 'react'
import {
    AsyncDataGridContextMenuProps,
    AsyncDataGridContextProps,
    AsyncDataGridProps,
    AsyncDataGridRows,
} from './AsyncDataGridTypes'
import {
    DataGridContextProps,
    DataGridOrderingDirection,
} from '../DataGrid/DataGridTypes'
import {AnyObject} from '../../types'
import {handleErrorResponse} from '../../helpers/ApiRequestErrorHelpers'
import {toggleValueInArray} from '../../helpers/toggleValueInArray'
import {ApiError} from '../../services/ApiRequestService'
import {
    DataGridContext,
    dataGridDefaultTranslations,
} from '../DataGrid/DataGridContext'
import {normalizeOffset} from '../DataGrid/dataGridHelpers'
import {AsyncDataGridApi} from './AsyncDataGridApi'
import {
    AsyncDataGridContext,
    asyncDataGridDefaultLimit,
    asyncDataGridDefaultLimits,
} from './AsyncDataGridContext'
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

    const selectRow = useCallback(
        (rowId: number | string, selected: boolean) => {
            setSelectedRows(ids => toggleValueInArray(ids, rowId, selected))
        },
        []
    )

    // Контекстное меню для строк.
    const [
        contextMenuProps,
        setContextMenuProps,
    ] = useState<Omit<AsyncDataGridContextMenuProps<RowDataType>, 'onClose' | 'permissions'>>(
        () => ({
            show: false,
            setIsProcessing() {
            },
        })
    )

    // Открыть контекстное меню для строки.
    const openContextMenu: AsyncDataGridContextProps<RowDataType>['openContextMenu'] = useCallback(
        (
            event: MouseEvent<HTMLTableRowElement>,
            rowData: RowDataType,
            rowIndex: number,
            setIsProcessing: (isProcessing: boolean) => void
        ) => {
            setContextMenuProps({
                mouseEvent: event,
                rowData,
                rowIndex,
                show: true,
                setIsProcessing,
            })
        },
        []
    )

    // Закрыть контекстное меню для строки.
    const closeContextMenu: AsyncDataGridContextProps<RowDataType>['closeContextMenu'] = useCallback(
        () => setContextMenuProps({
            show: false,
            setIsProcessing() {
            },
        }),
        []
    )

    // Контроллер отмены запроса к API.
    const [
        abortController,
        setAbortController,
    ] = useState<AbortController | null>(null)

    // Установить лимит строк на странице.
    const onSetLimit = useCallback(
        (newLimit: number): void => {
            setLimit(newLimit)
            setOffset(normalizeOffset(newLimit, offset))
            setDrawsCount(drawsCount => drawsCount + 1)
        },
        [offset]
    )

    // Изменить смещение отображаемых строк (по сути перейти на другую страницу).
    const onSetOffset = useCallback(
        (offset: number): void => {
            setOffset(offset)
            setDrawsCount(drawsCount => drawsCount + 1)
        },
        []
    )

    // Изменить сортировку.
    const onSetOrder = useCallback(
        (
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
        },
        []
    )

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
                {...defaultFilters},
                resetOffset
            )
        },
        [applyFilters]
    )

    // Получен новый набор строк.
    const onSetRows = useCallback(
        (newRows: RowDataType[], newTotalCount?: number) => {
            setRows(newRows)
            if (newTotalCount !== undefined) {
                setTotalCount(newTotalCount)
            }
            // Сбрасываем выбранные строки.
            setSelectedRows([])
        },
        []
    )

    // Обновление данные в текущем наборе строк.
    // Так можно внести изменения в одну или несколько строк,
    // не перезагружая данные из API.
    const updateRows = useCallback(
        (callback: (rows: RowDataType[]) => RowDataType[]): void => {
            setRows(callback)
        },
        []
    )

    // Изменение данных одной строки.
    const updateRow = useCallback(
        (
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
        },
        []
    )

    // Загрузить новый набор строк.
    const loadData = useCallback(
        (silent: boolean = false): void => {
            abortController?.abort()
            const newAbortController: AbortController = new AbortController()
            setAbortController(newAbortController)
            setLoadingError(false)
            setValidationErrors(null)
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
        },
        [apiUrl, filters, limit, offset, orderBy, orderDirection]
    )

    // Перезагрузка набора строк из API.
    const reload = useCallback(
        (silent?: boolean) => {
            loadData(silent)
        },
        [loadData]
    )

    // Загрузка данных при изменении URL, фильтров или кол-ва выборок.
    useEffect(() => {
        if (initialized) {
            loadData()
        }
    }, [apiUrl, filters, drawsCount, initialized])

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
        closeContextMenu: ContextMenu ? closeContextMenu : undefined,
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
                        {...contextMenuProps}
                        permissions={permissions}
                        onClose={closeContextMenu}
                    />
                )}
                {children}
            </AsyncDataGridContext.Provider>
        </DataGridContext.Provider>
    )
}

/** @deprecated */
export default AsyncDataGrid
