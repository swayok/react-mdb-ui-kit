import React, {useCallback, useEffect, useRef, useState} from 'react'
import {ApiError} from '../services/ApiRequestService'

type HookConfig<DataType> = {
    autoStart?: boolean,
    cleanDataBeforeReload?: boolean,
    initialData?: DataType
}

type HookReturn<DataType> = {
    data?: DataType,
    loading: boolean,
    error: ApiError | null,
    setError: React.Dispatch<React.SetStateAction<ApiError | null>>,
    reload: (silent?: boolean) => Promise<DataType>,
    setData: React.Dispatch<React.SetStateAction<DataType | undefined>>,
}

const defaultConfig: HookConfig<unknown> = {
    autoStart: true,
    cleanDataBeforeReload: true,
}

// Хук для отправки GET запроса в API.
// Реализует стандартный вариант запроса данных с индикатором загрузки и обработкой ошибок.
export default function useApiGetRequest<DataType>(
    sendRequest: () => Promise<DataType>,
    options?: HookConfig<DataType>,
    key?: string | number
): HookReturn<DataType> {

    // Настройки.
    const config = useRef<HookConfig<DataType>>({
        ...defaultConfig as HookConfig<DataType>,
        ...options,
    })
    // Данные.
    const [
        data,
        setData,
    ] = useState<DataType | undefined>(config.current.initialData)
    // Ошибки.
    const [
        error,
        setError,
    ] = useState<ApiError | null>(null)
    // Состояние загрузки данных.
    const [
        isLoading,
        setIsLoading,
    ] = useState(!!config.current.autoStart)

    // Обновление опций.
    useEffect(() => {
        config.current = {...defaultConfig as HookConfig<DataType>, ...options}
    }, [key])

    // Запуск запроса и обработка ответа.
    const executeRequest = useCallback((silent?: boolean): Promise<DataType> => {
        if (!silent) {
            setIsLoading(true)
            setError(null)
            if (config.current.cleanDataBeforeReload) {
                setData(config.current.initialData)
            }
        }
        return sendRequest()
            .then((data: DataType) => {
                setData(data)
                setIsLoading(false)
                return data
            })
            .catch((error: ApiError) => {
                if (!silent) {
                    setError(error)
                }
                setIsLoading(false)
            }) as Promise<DataType>
    }, [key])

    // Запуск запроса при монтировании или изменении key (через executeRequest).
    useEffect(() => {
        if (config.current.autoStart) {
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
