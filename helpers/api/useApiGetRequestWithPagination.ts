import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import {ApiError} from '../../services/ApiRequestService'
import {PaginationResponseData} from '../../types'
import {useEventCallback} from '../useEventCallback'

// Настройки хука.
export interface UseApiGetRequestWithPaginationHookConfig<
    ApiDataType,
    ModifiedDataType = ApiDataType,
> {
    // Количество загружаемых элементов на страницу.
    // По умолчанию: 20.
    limit?: number
    // Стартовая страница списка загружаемых элементов.
    // По умолчанию: 1.
    initialPage?: number
    // Запустить загрузку сразу же при монтировании компонента?
    // По умолчанию: true.
    autoStart?: boolean
    // Начальное значение состояния isLoading.
    // По умолчанию: true.
    defaultIsLoadingState?: boolean
    // Сбрасывать список элементов перед запуском запроса к API через loadPage()?
    // Если false - данные не сбрасываются перед запросом, а перезаписываются
    // после получения списка из API.
    // По умолчанию: false.
    resetDataBeforeLoadPageRequest?: boolean
    // Начальные данные.
    initialRecords?: ModifiedDataType[]
    // Модификация загруженных данных.
    modifyLoadedData?: (data: ApiDataType[]) => ModifiedDataType[]
    // Замена стандартного обработчика успешной загрузки данных.
    // Вызов modifyLoadedData() не выполняется.
    onSuccess?: (
        responseData: PaginationResponseData<ApiDataType>,
        listModificationMode: RecordsListModificationMode,
        hookState: Readonly<UseApiGetRequestWithPaginationHookState<ApiDataType, ModifiedDataType>>
    ) => void
    onAllRecordsLoaded?: (listModificationMode: RecordsListModificationMode, page: number) => void
    // Обработка ошибки загрузки данных.
    onError?: (error: ApiError, silent: boolean) => void
}

// API хука.
export interface UseApiGetRequestWithPaginationHookReturn<
    ApiDataType,
    ModifiedDataType = ApiDataType,
> {
    // Список элементов списка.
    records: Readonly<ModifiedDataType[]>
    // Задание списка элементов
    setRecords: Dispatch<SetStateAction<ModifiedDataType[]>>
    // Общее количество элементов в списке.
    totalCount?: number
    // Задание общего количества элементов в списке.
    setTotalCount: Dispatch<SetStateAction<number | undefined>>
    // Количество элементов на страницу списка.
    limit: number
    // Задание количества элементов на страницу списка.
    setLimit: Dispatch<SetStateAction<number>>
    // Смещение списка.
    offset: number
    // Задание смещения списка.
    setOffset: Dispatch<SetStateAction<number>>
    // Текущая страница списка.
    page: number
    // Первая страница?
    isFirstPage: boolean
    // Последняя страница?
    isLastPage: boolean
    // Задание смещения списка.
    setIsAllRecordsLoaded: Dispatch<SetStateAction<boolean>>
    // Состояние отправки запроса в API.
    // Устанавливается в true при каждой отправке запроса в API.
    isLoading: boolean
    // Задание значения isLoading.
    setIsLoading: Dispatch<SetStateAction<boolean>>
    // Состояние отправки запроса в API для загрузки следующей части списка.
    // Устанавливается в true при вызове loadNextPage.
    isLoadingNextPage: boolean
    // Задание значения isLoadingNextPage.
    setIsLoadingNextPage: Dispatch<SetStateAction<boolean>>
    // Ошибка при загрузке данных.
    error: ApiError | null
    // Задание ошибки загрузки данных.
    setError: Dispatch<SetStateAction<ApiError | null>>
    // Загрузить список для указанной страницы.
    // Если silent === true, то loading не переводится в true.
    // Список элементов будет перезаписан новым спискам, полученным из API.
    // Подходит для навигации по списку с произвольным выбором страницы,
    // когда отображаются только элементы текущей страницы.
    loadPage: (page: number, silent?: boolean) => Promise<PaginationResponseData<ApiDataType>>
    // Загрузить следующую страницу списка.
    // Если append = true, то список элементов будет дополнен новым списком, полученным из API.
    // Этот режим подходит для организации infinite scroll или списка с догрузкой
    // элементов по кнопке типа "Загрузить ещё".
    // Если append = false, то будет работать так же как loadPage(page + 1).
    loadNextPage: (append?: boolean) => Promise<PaginationResponseData<ApiDataType>>
    // Загрузить предыдущую страницу списка.
    // Если prepend = true, то перед списком элементов будут добавлены элементы из загруженного из API списка.
    // Этот режим подходит для организации реверсивного infinite scroll или списка с догрузкой
    // элементов по кнопке типа "Загрузить предыдущие".
    // Если prepend = false, то будет работать так же как loadPage(page - 1).
    loadPrevPage: (prepend?: boolean) => Promise<PaginationResponseData<ApiDataType>>
    // Перезагрузить список c offset = options.offset.
    reset: () => Promise<PaginationResponseData<ApiDataType>>
    // Сбросить состояние хука не выполняя запрос на сервер.
    resetState: (
        // Задать состояние isLoading.
        // По умолчанию: options.defaultIsLoadingState.
        loading?: boolean,
        // Сбросить records в options.initialRecords (true) или в пустой массив (false)?
        // По умолчанию: true.
        useInitialRecordsFromOptions?: boolean
    ) => void
}

export interface UseApiGetRequestWithPaginationHookState<
    ApiDataType,
    ModifiedDataType = ApiDataType,
> extends Omit<
        UseApiGetRequestWithPaginationHookReturn<ApiDataType, ModifiedDataType>,
        'loadPage' | 'loadNextPage' | 'loadPrevPage' | 'reset' | 'resetState'
    > {
    sendRequest: (offset: number, limit: number) => Promise<PaginationResponseData<ApiDataType>>
    defaultOnSuccess: (
        responseData: PaginationResponseData<ApiDataType>,
        listModificationMode: RecordsListModificationMode
    ) => PaginationResponseData<ApiDataType>
    options: Omit<Readonly<
        UseApiGetRequestWithPaginationHookConfig<ApiDataType, ModifiedDataType>>,
        'onSuccess' | 'autoStart' | 'initialPage' | 'defaultIsLoadingState' | 'resetDataBeforeLoadPageRequest'
    >
}

export type RecordsListModificationMode = 'replace' | 'append' | 'prepend'

// Хук для отправки GET запроса в API с limit и offset.
// Реализует вариант запроса части списка с индикатором загрузки и обработкой ошибок.
export function useApiGetRequestWithPagination<
    ApiDataType,
    ModifiedDataType = ApiDataType,
>(
    sendRequest: (offset: number, limit: number) => Promise<PaginationResponseData<ApiDataType>>,
    options: UseApiGetRequestWithPaginationHookConfig<ApiDataType, ModifiedDataType> = {}
): UseApiGetRequestWithPaginationHookReturn<ApiDataType, ModifiedDataType> {

    const {
        limit: initialLimit = 20,
        initialPage = 1,
        autoStart = true,
        defaultIsLoadingState: initialIsLoading = true,
        resetDataBeforeLoadPageRequest = false,
        initialRecords = [],
        modifyLoadedData,
        onSuccess,
        onAllRecordsLoaded,
        onError,
    } = options

    // Количество элементов на страницу списка.
    const [
        limit,
        setLimit,
    ] = useState<number>(Math.max(1, initialLimit))
    // Смещение списка.
    const [
        offset,
        setOffset,
    ] = useState<number>(calculateOffset(initialPage, limit))
    // Список элементов.
    const [
        records,
        setRecords,
    ] = useState<ModifiedDataType[]>(initialRecords)
    // Общее количество элементов в списке.
    const [
        totalCount,
        setTotalCount,
    ] = useState<number | undefined>(undefined)
    // Ошибки.
    const [
        error,
        setError,
    ] = useState<ApiError | null>(null)
    // Состояние загрузки данных.
    const [
        isLoading,
        setIsLoading,
    ] = useState(initialIsLoading)
    const [
        isLoadingNextPage,
        setIsLoadingNextPage,
    ] = useState<boolean>(false)
    const [
        isAllRecordsLoaded,
        setIsAllRecordsLoaded,
    ] = useState<boolean>(false)

    const page: number = Math.floor(offset / limit) + 1
    const isFirstPage: boolean = offset <= 0
    const isLastPage: boolean = isAllRecordsLoaded

    const hookState = useRef<
        UseApiGetRequestWithPaginationHookState<ApiDataType, ModifiedDataType>
    >(null)

    hookState.current = {
        limit,
        setLimit,
        offset,
        page,
        setOffset,
        records,
        setRecords,
        isLoading,
        setIsLoading,
        isLoadingNextPage,
        setIsLoadingNextPage,
        isFirstPage,
        isLastPage,
        setIsAllRecordsLoaded,
        totalCount,
        setTotalCount,
        error,
        setError,
        sendRequest,
        defaultOnSuccess(
            data: PaginationResponseData<ApiDataType>,
            listModificationMode: RecordsListModificationMode
        ) {
            const modifiedRecords = modifyLoadedData
                ? modifyLoadedData(data.records)
                : data.records as unknown as ModifiedDataType[]
            const isLastBatch: boolean = modifiedRecords.length < limit
            setRecords(records => {
                switch (listModificationMode) {
                    case 'append':
                        return [...records, ...modifiedRecords]
                    case 'prepend':
                        return [...modifiedRecords, ...records]
                    default:
                        return modifiedRecords
                }
            })
            setIsLoading(false)
            setError(null)
            setIsLoadingNextPage(false)
            setIsAllRecordsLoaded(isLastBatch)
            if (data.count) {
                setTotalCount(data.count)
            }
            if (
                onAllRecordsLoaded
                && !isAllRecordsLoaded
                && isLastBatch
            ) {
                onAllRecordsLoaded?.(listModificationMode, page)
            }
            return data
        },
        options: {
            initialRecords,
            modifyLoadedData,
            onError,
            limit,
        },
    }

    // Запуск запроса и обработка ответа.
    const executeRequest = useEventCallback((
        page: number | 'prev' | 'next' | 'same',
        limit: number,
        listModificationMode: RecordsListModificationMode,
        silent?: boolean
    ): Promise<PaginationResponseData<ApiDataType>> => {
        let oldOffset: number
        let offset: number = 0
        setOffset(stateOffset => {
            oldOffset = stateOffset
            switch (page) {
                case 'same':
                    offset = stateOffset
                    break
                case 'prev':
                    offset = Math.max(0, stateOffset - limit)
                    break
                case 'next':
                    offset = stateOffset + limit
                    break
                default:
                    offset = calculateOffset(page, limit)
            }
            return offset
        })
        if (!silent) {
            setIsLoading(true)
            setError(null)
            if (listModificationMode !== 'replace') {
                setIsLoadingNextPage(true)
            }
            if (
                listModificationMode === 'replace'
                && resetDataBeforeLoadPageRequest
            ) {
                setRecords([])
            }
        }
        return sendRequest(offset, limit)
            .then((data: PaginationResponseData<ApiDataType>) => {
                if (onSuccess) {
                    onSuccess(data, listModificationMode, hookState.current!)
                } else {
                    hookState.current!.defaultOnSuccess(data, listModificationMode)
                }
                return data
            })
            .catch((error: ApiError) => {
                if (!silent) {
                    setError(error)
                }
                setIsLoading(false)
                setIsLoadingNextPage(false)
                setOffset(oldOffset)
                onError?.(error, !!silent)
            }) as Promise<PaginationResponseData<ApiDataType>>
    })

    // Запуск запроса при монтировании или изменении key (через executeRequest).
    useEffect(() => {
        if (autoStart) {
            void executeRequest('same', limit, 'replace')
        }
    }, [executeRequest])

    // Загрузить список для указанной страницы.
    const reset: UseApiGetRequestWithPaginationHookReturn<ApiDataType>['reset'] = useEventCallback(
        (): Promise<PaginationResponseData<ApiDataType>> => executeRequest(
            initialPage,
            limit,
            'replace'
        )
    )

    // Загрузка списка для конкретной страницы.
    const loadPage = useEventCallback((
        page: number | 'prev' | 'next',
        silent?: boolean,
        modificationMode: 'replace' | 'append' | 'prepend' = 'replace'
    ): Promise<PaginationResponseData<ApiDataType>> => executeRequest(
        page,
        limit,
        modificationMode,
        silent
    ))

    // Загрузка списка для следующей страницы.
    const loadNextPage: UseApiGetRequestWithPaginationHookReturn<ApiDataType>['loadNextPage'] = useEventCallback((
        append?: boolean
    ): Promise<PaginationResponseData<ApiDataType>> => loadPage(
        'next',
        false,
        append ? 'append' : 'replace'
    ))

    // Загрузка списка для предыдущей страницы.
    const loadPrevPage: UseApiGetRequestWithPaginationHookReturn<ApiDataType>['loadNextPage'] = useEventCallback((
        prepend?: boolean
    ): Promise<PaginationResponseData<ApiDataType>> => loadPage(
        'prev',
        false,
        prepend ? 'prepend' : 'replace'
    ))

    // Сбросить состояния в начальные значения.
    const resetState: UseApiGetRequestWithPaginationHookReturn<ApiDataType>['resetState'] = useCallback(
        (
            loading: boolean = initialIsLoading,
            useInitialRecordsFromOptions: boolean = true
        ) => {
            setOffset(calculateOffset(initialPage, limit))
            setRecords(useInitialRecordsFromOptions ? initialRecords : [])
            setTotalCount(undefined)
            setError(null)
            setIsLoading(loading)
            setIsLoadingNextPage(false)
            setIsAllRecordsLoaded(false)
        },
        []
    )

    return {
        limit,
        setLimit,
        offset,
        setOffset,
        records,
        setRecords,
        totalCount,
        setTotalCount,
        isLoading,
        setIsLoading,
        isLoadingNextPage,
        setIsLoadingNextPage,
        isFirstPage,
        isLastPage,
        setIsAllRecordsLoaded,
        error,
        setError,
        page,
        resetState,
        reset,
        loadPage,
        loadPrevPage,
        loadNextPage,
    }
}

// Вычисление смещения.
function calculateOffset(page: number, limit: number): number {
    return Math.max(0, page - 1) * limit
}
