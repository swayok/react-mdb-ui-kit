import React, {useCallback, useEffect, useState} from 'react'
import {ApiError} from '../services/ApiRequestService'

// Настройки хука.
export interface UseApiGetRequestWithPaginationHookConfig<RecordType> {
    // Количество загружаемых элементов на страницу.
    // По умолчанию: 20.
    limit?: number
    // Стартовая страница списка загружаемых элементов.
    // По умолчанию: 1.
    page?: number
    // Запустить загрузку сразу же при монтировании компонента?
    // По умолчанию: true.
    autoStart?: boolean
    // Начальное значение состояния isLoading.
    // По умолчанию: true.
    isLoading?: boolean
    // Сбрасывать список элементов перед запуском запроса к API через loadPage()?
    // Если false - данные не сбрасываются перед запросом, а перезаписываются
    // после получения списка из API.
    // По умолчанию: false.
    resetDataBeforeLoadPageRequest?: boolean
    // Начальные данные.
    initialRecords?: RecordType[]
}

// Данные, возвращаемые из sendRequest().
export interface PaginationResponseData<RecordType> {
    // Список элементов для запрошенной страницы.
    records: RecordType[]
    // Общее количество элементов в списке.
    count?: number
}

// API хука.
export interface UseApiGetRequestWithPaginationHookReturn<RecordType> {
    // Список элементов списка.
    records: RecordType[]
    // Задание списка элементов
    setRecords: React.Dispatch<React.SetStateAction<RecordType[]>>
    // Общее количество элементов в списке.
    totalCount?: number
    // Задание общего количества элементов в списке.
    setTotalCount: React.Dispatch<React.SetStateAction<number | undefined>>
    // Количество элементов на страницу списка.
    limit: number
    // Текущая страница списка.
    page: number
    // Первая страница?
    isFirstPage: boolean
    // Последняя страница?
    isLastPage: boolean
    // Задание количества элементов на страницу списка.
    setLimit: React.Dispatch<React.SetStateAction<number>>
    // Смещение списка.
    offset: number
    // Задание смещения списка.
    setOffset: React.Dispatch<React.SetStateAction<number>>
    // Состояние отправки запроса в API.
    // Устанавливается в true при каждой отправке запроса в API.
    isLoading: boolean
    // Состояние отправки запроса в API для загрузки следующей части списка.
    // Устанавливается в true при вызове loadNextPage.
    isLoadingNextPage: boolean
    // Ошибка при загрузке данных.
    error: ApiError | null
    // Задание ошибка загрузки данных.
    setError: React.Dispatch<React.SetStateAction<ApiError | null>>
    // Загрузить список для указанной страницы.
    // Если silent === true, то loading не переводится в true.
    // Список элементов будет перезаписан новым спискам, полученным из API.
    // Подходит для навигации по списку с произвольным выбором страницы,
    // когда отображаются только элементы текущей страницы.
    loadPage: (page: number, silent?: boolean) => Promise<PaginationResponseData<RecordType>>
    // Загрузить следующую страницу списка.
    // Если append = true, то список элементов будет дополнен новым списком, полученным из API.
    // Этот режим подходит для организации infinite scroll или списка с догрузкой
    // элементов по кнопке типа "Загрузить ещё".
    // Если append = false, то будет работать так же как loadPage(page + 1).
    loadNextPage: (append?: boolean) => Promise<PaginationResponseData<RecordType>>
    // Загрузить предыдущую страницу списка.
    // Если prepend = true, то перед списком элементов будут добавлены элементы из загруженного из API списка.
    // Этот режим подходит для организации реверсивного infinite scroll или списка с догрузкой
    // элементов по кнопке типа "Загрузить предыдущие".
    // Если prepend = false, то будет работать так же как loadPage(page - 1).
    loadPrevPage: (prepend?: boolean) => Promise<PaginationResponseData<RecordType>>
    // Сбросить список c offset = options.offset.
    reset: () => Promise<PaginationResponseData<RecordType>>
}

// Хук для отправки GET запроса в API с limit и offset.
// Реализует вариант запроса части списка с индикатором загрузки и обработкой ошибок.
export function useApiGetRequestWithPagination<RecordType>(
    sendRequest: (offset: number, limit: number) => Promise<PaginationResponseData<RecordType>>,
    options: UseApiGetRequestWithPaginationHookConfig<RecordType> = {},
    // Отвечает за пересоздание функции запроса данных из API.
    key?: string | number
): UseApiGetRequestWithPaginationHookReturn<RecordType> {

    const {
        limit: initialLimit = 20,
        page: initialPage = 1,
        autoStart = true,
        isLoading: initialIsLoading = true,
        resetDataBeforeLoadPageRequest = false,
        initialRecords = [],
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
    ] = useState<RecordType[]>(initialRecords)
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

    // Запуск запроса и обработка ответа.
    const executeRequest = useCallback((
        page: number | 'prev' | 'next' | 'same',
        limit: number,
        modificationMode: 'replace' | 'append' | 'prepend',
        silent?: boolean
    ): Promise<PaginationResponseData<RecordType>> => {
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
            if (modificationMode !== 'replace') {
                setIsLoadingNextPage(true)
            }
            if (
                modificationMode === 'replace'
                && resetDataBeforeLoadPageRequest
            ) {
                setRecords([])
            }
        }
        return sendRequest(offset, limit)
            .then((data: PaginationResponseData<RecordType>) => {
                setRecords(records => {
                    switch (modificationMode) {
                        case 'append':
                            return [...records, ...data.records]
                        case 'prepend':
                            return [...data.records,...records]
                        default:
                            return data.records
                    }
                })
                setIsLoading(false)
                setError(null)
                setIsLoadingNextPage(false)
                setIsAllRecordsLoaded(data.records.length < limit)
                if (data.count) {
                    setTotalCount(data.count)
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
            }) as Promise<PaginationResponseData<RecordType>>
    }, [key])

    // Запуск запроса при монтировании или изменении key (через executeRequest).
    useEffect(() => {
        if (autoStart) {
            void executeRequest('same', limit, 'replace')
        }
    }, [executeRequest])

    // Загрузить список для указанной страницы.
    const reset: UseApiGetRequestWithPaginationHookReturn<RecordType>['reset'] = useCallback(
        (): Promise<PaginationResponseData<RecordType>> => executeRequest(
            initialPage,
            limit,
            'replace'
        ),
        [executeRequest, limit]
    )

    // Загрузка списка для конкретной страницы.
    const loadPage = useCallback(
        (
            page: number | 'prev' | 'next',
            silent?: boolean,
            modificationMode: 'replace' | 'append' | 'prepend' = 'replace'
        ): Promise<PaginationResponseData<RecordType>> => executeRequest(
            page,
            limit,
            modificationMode,
            silent
        ),
        [executeRequest, limit]
    )

    // Загрузка списка для следующей страницы.
    const loadNextPage: UseApiGetRequestWithPaginationHookReturn<RecordType>['loadNextPage'] = useCallback(
        (
            append?: boolean
        ): Promise<PaginationResponseData<RecordType>> => loadPage(
            'next',
            false,
            append ? 'append' : 'replace'
        ),
        [loadPage]
    )

    // Загрузка списка для предыдущей страницы.
    const loadPrevPage: UseApiGetRequestWithPaginationHookReturn<RecordType>['loadNextPage'] = useCallback(
        (
            prepend?: boolean
        ): Promise<PaginationResponseData<RecordType>> => loadPage(
            'prev',
            false,
            prepend ? 'prepend' : 'replace'
        ),
        [loadPage]
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
        isLoadingNextPage,
        isFirstPage: offset <= 0,
        isLastPage: isAllRecordsLoaded,
        error,
        setError,
        page: Math.floor(offset / limit) + 1,
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
