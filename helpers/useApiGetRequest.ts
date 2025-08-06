import React, {useCallback, useEffect, useRef, useState} from 'react'
import {ApiError} from '../services/ApiRequestService'

export interface UseApiGetRequestHookConfig<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined
> {
    // Запустить загрузку сразу же при монтировании компонента?
    // По умолчанию: true.
    autoStart?: boolean
    // Начальное значение состояния isLoading.
    // По умолчанию: true.
    defaultIsLoadingState?: boolean
    // Сбрасывать данные в initialData перед запуском перезагрузи?
    // По умолчанию: true.
    resetDataBeforeReload?: boolean
    // Начальные данные.
    initialData?: ModifiedDataType
    // Модификация загруженных данных.
    modifyLoadedData?: (data: ApiDataType) => ModifiedDataType
    // Замена стандартного обработчика успешной загрузки данных.
    // Вызов modifyLoadedData() не выполняется.
    onSuccess?: (
        responseData: ApiDataType,
        hookState: Readonly<UseApiGetRequestHookState<ApiDataType, ModifiedDataType>>,
    ) => void
    // Обработка ошибки загрузки данных.
    onError?: (error: ApiError, silent: boolean) => void
}

export interface UseApiGetRequestHookReturn<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined
> {
    data: ModifiedDataType
    loading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    error: ApiError | null
    setError: React.Dispatch<React.SetStateAction<ApiError | null>>
    reload: (silent?: boolean) => Promise<ApiDataType>
    setData: React.Dispatch<React.SetStateAction<ModifiedDataType | undefined>>
}

export interface UseApiGetRequestHookState<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined
> extends Omit<UseApiGetRequestHookReturn<ApiDataType, ModifiedDataType>, 'reload'> {
    sendRequest: () => Promise<ApiDataType>
    defaultOnSuccess: (data: ApiDataType) => void
    options: Omit<Readonly<
        UseApiGetRequestHookConfig<ApiDataType, ModifiedDataType>>,
        'onSuccess' | 'autoStart' | 'defaultIsLoadingState' | 'resetDataBeforeReload'
    >
}

// Хук для отправки GET запроса в API.
// Реализует стандартный вариант запроса данных с индикатором загрузки и обработкой ошибок.
export function useApiGetRequest<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined
>(
    sendRequest: () => Promise<ApiDataType>,
    options?: UseApiGetRequestHookConfig<ApiDataType, ModifiedDataType>,
    // Отвечает за пересоздание функции запроса данных из API.
    key?: string | number | null
): UseApiGetRequestHookReturn<ApiDataType, ModifiedDataType> {

    const {
        autoStart = true,
        defaultIsLoadingState = true,
        resetDataBeforeReload = true,
        initialData,
        modifyLoadedData,
        onSuccess,
        onError,
    } = (options ?? {})

    // Данные.
    const [
        data,
        setData,
    ] = useState<ModifiedDataType | undefined>(initialData as ModifiedDataType)
    // Ошибки.
    const [
        error,
        setError,
    ] = useState<ApiError | null>(null)
    // Состояние загрузки данных.
    const [
        isLoading,
        setIsLoading,
    ] = useState(defaultIsLoadingState)

    const hookState = useRef<
        UseApiGetRequestHookState<ApiDataType, ModifiedDataType>
    >(null)
    hookState.current = {
        data: data!,
        setData,
        loading: isLoading,
        setIsLoading,
        error,
        setError,
        sendRequest,
        defaultOnSuccess(data: ApiDataType) {
            if (modifyLoadedData) {
                setData(modifyLoadedData(data))
            } else {
                setData(data as unknown as ModifiedDataType)
            }
            setIsLoading(false)
            setError(null)
        },
        options: {
            initialData,
            modifyLoadedData,
            onError,
        },
    }

    // Запуск запроса и обработка ответа.
    const executeRequest = useCallback(
        (silent?: boolean): Promise<ApiDataType> => {
            if (!silent) {
                setIsLoading(true)
                setError(null)
                if (resetDataBeforeReload) {
                    setData(initialData)
                }
            }
            return sendRequest()
                .then((data: ApiDataType) => {
                    if (onSuccess) {
                        onSuccess(data, hookState.current!)
                    } else {
                        hookState.current!.defaultOnSuccess(data)
                    }
                    return data
                })
                .catch((error: ApiError) => {
                    if (!silent) {
                        setError(error)
                    }
                    setIsLoading(false)
                    onError?.(error, !!silent)
                }) as Promise<ApiDataType>
        },
        [key]
    )

    // Запуск запроса при монтировании или изменении key (через executeRequest).
    useEffect(() => {
        if (autoStart) {
            void executeRequest()
        }
    }, [executeRequest])

    return {
        data: data!,
        setData,
        loading: isLoading,
        setIsLoading,
        error,
        setError,
        reload: executeRequest,
    }
}
