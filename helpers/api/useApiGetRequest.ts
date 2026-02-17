import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react'
import {ApiError} from '../../services/ApiRequestService'
import {useEventCallback} from '../useEventCallback'

export interface UseApiGetRequestHookConfig<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined,
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
    // Сбрасывать данные в initialData при ошибке загрузки?
    resetDataOnError?: boolean
    // Замена стандартного обработчика успешной загрузки данных.
    // Вызов modifyLoadedData() не выполняется.
    onSuccess?: (
        responseData: ApiDataType,
        hookState: Readonly<UseApiGetRequestHookState<ApiDataType, ModifiedDataType>>
    ) => void
    // Обработка ошибки загрузки данных.
    onError?: (error: ApiError, silent: boolean) => void
}

export interface UseApiGetRequestHookReturn<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined,
> {
    // Данные, полученные из API.
    data: Readonly<ModifiedDataType>
    // Задание данных.
    setData: Dispatch<SetStateAction<ModifiedDataType>>
    // Состояние отправки запроса в API.
    // Устанавливается в true при каждой отправке запроса в API.
    isLoading: boolean
    setIsLoading: Dispatch<SetStateAction<boolean>>
    // Ошибка при загрузке данных.
    error: ApiError | null
    // Задание ошибки загрузки данных.
    setError: Dispatch<SetStateAction<ApiError | null>>
    // Перезагрузка данных.
    // Если silent === true, то loading не переводится в true.
    reload: (silent?: boolean) => Promise<ApiDataType>
}

export interface UseApiGetRequestHookState<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined,
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
// Не поддерживает AbortSignal, поэтому при включенном Strict Mode отрабатывает 2 раза.
export function useApiGetRequest<
    ApiDataType,
    ModifiedDataType = ApiDataType | undefined,
>(
    sendRequest: () => Promise<ApiDataType>,
    options?: UseApiGetRequestHookConfig<ApiDataType, ModifiedDataType>,
    // Отвечает за перезагрузку данных при изменении значения, если options.autoStart === true.
    key?: string | number | null
): UseApiGetRequestHookReturn<ApiDataType, ModifiedDataType> {

    const {
        autoStart = true,
        defaultIsLoadingState = true,
        resetDataBeforeReload = true,
        initialData,
        modifyLoadedData,
        resetDataOnError = false,
        onSuccess,
        onError,
    } = (options ?? {})

    // Данные.
    const [
        data,
        setData,
    ] = useState<ModifiedDataType>(initialData as ModifiedDataType)
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
        data,
        setData,
        isLoading,
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
            initialData: initialData!,
            modifyLoadedData,
            onError,
        },
    }

    // Запуск запроса и обработка ответа.
    const executeRequest = useEventCallback(
        (silent?: boolean): Promise<ApiDataType> => {
            if (!silent) {
                setIsLoading(true)
                setError(null)
                if (resetDataBeforeReload) {
                    setData(initialData!)
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
                    if (resetDataOnError) {
                        setData(initialData!)
                    }
                    onError?.(error, !!silent)
                }) as Promise<ApiDataType>
        }
    )

    // Запуск запроса при монтировании или изменении key (через executeRequest).
    useEffect(() => {
        if (autoStart) {
            void executeRequest()
        }
    }, [key])

    return {
        data,
        setData,
        isLoading,
        setIsLoading,
        error,
        setError,
        reload: executeRequest,
    }
}
