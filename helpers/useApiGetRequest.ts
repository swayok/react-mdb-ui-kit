import React, {useCallback, useEffect, useState} from 'react'
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
    // Обработка ошибки загрузки данных.
    onError?: (error: ApiError, silent: boolean) => void
}

export interface UseApiGetRequestHookReturn<DataType> {
    data?: DataType
    loading: boolean
    error: ApiError | null
    setError: React.Dispatch<React.SetStateAction<ApiError | null>>
    reload: (silent?: boolean) => Promise<DataType>
    setData: React.Dispatch<React.SetStateAction<DataType | undefined>>
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

    // Запуск запроса и обработка ответа.
    const executeRequest = useCallback((silent?: boolean): Promise<DataType> => {
        if (!silent) {
            setIsLoading(true)
            setError(null)
            if (resetDataBeforeReload) {
                setData(initialData)
            }
        }
        return sendRequest()
            .then((data: DataType) => {
                if (modifyLoadedData) {
                    data = modifyLoadedData(data)
                }
                setData(data)
                setIsLoading(false)
                setError(null)
                return data
            })
            .catch((error: ApiError) => {
                if (!silent) {
                    setError(error)
                }
                setIsLoading(false)
                onError?.(error, !!silent)
            }) as Promise<DataType>
    }, [key])

    // Запуск запроса при монтировании или изменении key (через executeRequest).
    useEffect(() => {
        if (autoStart) {
            void executeRequest()
        }
    }, [executeRequest])

    return {
        data,
        loading: isLoading,
        error,
        setError,
        reload: executeRequest,
        setData,
    }
}
