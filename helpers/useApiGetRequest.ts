import React, {useCallback, useEffect, useRef, useState} from 'react'
import {ApiError} from '../services/ApiRequestService'

export interface UseApiGetRequestHookConfig<DataType> {
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
    initialData?: DataType
    // Модификация загруженных данных.
    modifyLoadedData?: (data: DataType) => DataType
    // Замена стандартного обработчика успешной загрузки данных.
    // Вызов modifyLoadedData() не выполняется.
    onSuccess?: (
        responseData: DataType,
        hookState: Readonly<UseApiGetRequestHookState<DataType>>,
    ) => void
    // Обработка ошибки загрузки данных.
    onError?: (error: ApiError, silent: boolean) => void
}

export interface UseApiGetRequestHookReturn<DataType> {
    data?: DataType
    loading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    error: ApiError | null
    setError: React.Dispatch<React.SetStateAction<ApiError | null>>
    reload: (silent?: boolean) => Promise<DataType>
    setData: React.Dispatch<React.SetStateAction<DataType | undefined>>
}

export interface UseApiGetRequestHookState<DataType> extends Omit<UseApiGetRequestHookReturn<DataType>, 'reload'> {
    sendRequest: () => Promise<DataType>
    defaultOnSuccess: (data: DataType) => void
    options: Omit<Readonly<
        UseApiGetRequestHookConfig<DataType>>,
        'onSuccess' | 'autoStart' | 'defaultIsLoadingState' | 'resetDataBeforeReload'
    >
}

// Хук для отправки GET запроса в API.
// Реализует стандартный вариант запроса данных с индикатором загрузки и обработкой ошибок.
export function useApiGetRequest<DataType>(
    sendRequest: () => Promise<DataType>,
    options?: UseApiGetRequestHookConfig<DataType>,
    // Отвечает за пересоздание функции запроса данных из API.
    key?: string | number | null
): UseApiGetRequestHookReturn<DataType> {

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
    ] = useState<DataType | undefined>(initialData)
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

    const hookState = useRef<UseApiGetRequestHookState<DataType>>(null)
    hookState.current = {
        data,
        setData,
        loading: isLoading,
        setIsLoading,
        error,
        setError,
        sendRequest,
        defaultOnSuccess(data: DataType) {
            if (modifyLoadedData) {
                data = modifyLoadedData(data)
            }
            setData(data)
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
        (silent?: boolean): Promise<DataType> => {
            if (!silent) {
                setIsLoading(true)
                setError(null)
                if (resetDataBeforeReload) {
                    setData(initialData)
                }
            }
            return sendRequest()
                .then((data: DataType) => {
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
                }) as Promise<DataType>
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
        data,
        setData,
        loading: isLoading,
        setIsLoading,
        error,
        setError,
        reload: executeRequest,
    }
}
