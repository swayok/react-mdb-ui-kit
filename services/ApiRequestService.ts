import {ApiRequestDebugService} from './ApiRequestDebugService'
import {
    AnyObject,
    ApiResponseData,
} from '../types'

export interface ApiRequestServiceConfig {
    // Базовый URL API. Полный URL: {baseApiUrl}  + '/' +  {requestUrl}.
    baseApiUrl: string
    // Максимальное время ожидания ответа от API.
    timeout: number
    // Можно ли выводить логи запросов?
    allowRequestsLogs: boolean
    // Список запросов, которые не нужно выводить в консоль.
    // Формат: pathname без baseApiUrl, точно такие же, какие передаются в
    // ApiRequestService.get(pathname) / ApiRequestService.post(pathname)
    notLoggableRequests?: string[]
    // Добавить опции или заголовки к вопросу.
    beforeSend?: (headers: Headers, request: RequestInit) => void
}

export interface ValidationErrorsResponseData extends ApiResponseData {
    errors: AnyObject<string | string[]>
}

export interface HtmlErrorResponseData extends ApiResponseData {
    html: string
}

export interface OtherErrorResponseData extends ApiResponseData {
    error: DOMException | SyntaxError | unknown
}

export interface ApiResponse<T extends ApiResponseData = ApiResponseData> {
    url: string
    request: ApiRequestOptions
    response: Response
    success: true
    status: number
    data: T
}

export interface ApiError<
    T extends ApiResponseData = ApiResponseData
        | ValidationErrorsResponseData
        | HtmlErrorResponseData
        | OtherErrorResponseData,
> extends Error, Omit<ApiResponse, 'data' | 'response' | 'success'> {
    response: Response | null
    errorType: 'abort' | 'timeout' | 'network_error' | 'http_error' | 'parse_error' | 'js_error'
    success: false
    status: number
    data: T
}

export interface ApiRequestOptions extends Omit<
    RequestInit, 'signal' | 'body' | 'method'
> {
    // Длительность ожидания ответа от сервера.
    timeout?: number | false
}

export type ApiRequestMethod = 'get' | 'post' | 'put' | 'delete'

// Сервис отправки запросов к API.
export class ApiRequestService {

    // Настройки сервиса.
    private static config: ApiRequestServiceConfig = {
        baseApiUrl: '/api',
        timeout: 20000,
        allowRequestsLogs: true,
        notLoggableRequests: [],
    }

    // Настройка сервиса.
    static configure(config: ApiRequestServiceConfig): void {
        this.config = config
    }

    // Выполнить HTTP GET запрос.
    static get<T extends ApiResponseData = ApiResponseData>(
        url: string,
        searchParams: AnyObject = {},
        options: ApiRequestOptions = {},
        abortController?: AbortController | null
    ): Promise<ApiResponse<T>> {
        return this.request<T>('get', url, searchParams, options, abortController)
    }

    // Выполнить HTTP POST запрос.
    static post<T extends ApiResponseData = ApiResponseData>(
        url: string,
        data?: object | FormData,
        options: ApiRequestOptions = {},
        abortController?: AbortController | null
    ): Promise<ApiResponse<T>> {
        return this.request<T>('post', url, data, options, abortController)
    }

    // Выполнить HTTP PUT запрос.
    static put<T extends ApiResponseData = ApiResponseData>(
        url: string,
        data?: AnyObject | FormData,
        options: ApiRequestOptions = {},
        abortController?: AbortController | null
    ): Promise<ApiResponse<T>> {
        return this.request<T>('put', url, data, options, abortController)
    }

    // Выполнить HTTP DELETE запрос.
    static delete<T extends ApiResponseData = ApiResponseData>(
        url: string,
        data?: AnyObject | FormData,
        options: ApiRequestOptions = {},
        abortController?: AbortController | null
    ): Promise<ApiResponse<T>> {
        return this.request<T>('delete', url, data, options, abortController)
    }

    // Проверить можно ли выводить логи для этого запроса.
    private static isLoggableRequest(relativeUrl: string, fullUrl: string): boolean {
        if (!this.config.allowRequestsLogs) {
            return false
        }
        if (!this.config.notLoggableRequests) {
            return true
        }
        return (
            !this.config.notLoggableRequests.includes(relativeUrl.replace(/\?.*/, ''))
            && !this.config.notLoggableRequests.includes(fullUrl.replace(/\?.*/, ''))
        )
    }

    // Выполнить HTTP запрос.
    static request<T extends ApiResponseData = ApiResponseData>(
        type: ApiRequestMethod,
        url: string,
        data?: AnyObject | FormData,
        options: ApiRequestOptions = {},
        abortController?: AbortController | null
    ): Promise<ApiResponse<T>> {
        return new Promise<ApiResponse<T>>((resolve, reject) => {
            const requestInit: RequestInit = {
                keepalive: false, // Если true, то виснет при отправке файлов.
                mode: 'same-origin',
                ...options,
            }
            const relativeUrl = '/' + url.replace(/^(\/)+/, '')
            let fullUrl: string = this.config.baseApiUrl + relativeUrl

            // Контроллер отмены выполнения запроса извне или по тайм-ауту.
            requestInit.signal = this.getAbortSignal(abortController, options.timeout)

            data ??= {}
            const typeToLog = type
            if (type === 'delete') {
                type = 'post'
                if (data instanceof FormData) {
                    data.append('_method', 'DELETE')
                } else {
                    data._method = 'DELETE'
                }
            } else if (type === 'put') {
                type = 'post'
                if (data instanceof FormData) {
                    data.append('_method', 'PUT')
                } else {
                    data._method = 'PUT'
                }
            }
            requestInit.method = type

            const logData = (action: 'Request' | string, data: AnyObject, isError: boolean = false) => {
                if (isError && 'type' in data && data.type === 'abort') {
                    return
                }
                if (isError || this.isLoggableRequest(relativeUrl, fullUrl)) {
                    const logTime: string = (new Date()).toLocaleTimeString('en', {hour12: false})
                    const requestMethod: string = ((data._method ?? typeToLog) as string).toUpperCase()
                    console[isError ? 'error' : 'log'](
                        `[API][${logTime}][${action}][${requestMethod}] ${decodeURI(fullUrl)}`,
                        requestInit,
                        data
                    )
                }
            }

            if (!requestInit.headers || !(requestInit.headers instanceof Headers)) {
                requestInit.headers = new Headers(requestInit.headers)
            }
            requestInit.headers.set('Accept', 'application/json')

            if (data instanceof FormData) {
                requestInit.body = data
            } else if (type === 'get') {
                const queryArgs: string = this.convertDataObjectToUrlSearchParams(data).toString()
                if (queryArgs.length) {
                    fullUrl += '?' + this.convertDataObjectToUrlSearchParams(data).toString()
                }
            } else {
                requestInit.body = JSON.stringify(data)
                requestInit.headers.set('Content-Type', 'application/json; charset=utf-8')
                logData('Request', data)
            }

            this.config.beforeSend?.(requestInit.headers, requestInit)

            this.sendRequest<T>(fullUrl, requestInit, logData)
                .then((response: ApiResponse<T> | ApiError) => {
                    if (response.success) {
                        resolve(response)
                    } else {
                        reject(response)
                    }
                })
                .catch((reason: unknown) => {
                    // Что-то совсем пошло не так.
                    const rejectInfo: ApiError = {
                        name: 'JS Error',
                        message: 'Error in JavaScript code occurred.',
                        url: fullUrl,
                        request: requestInit,
                        response: null,
                        success: false,
                        status: 0,
                        data: {
                            error: reason,
                        },
                        errorType: 'js_error',
                    }
                    logData('JS Error', {
                        type: rejectInfo.errorType,
                        details: reason,
                    }, true)
                    reject(rejectInfo)
                })
        })
    }

    // Создать и настроить сигнал отмены запроса.
    private static getAbortSignal(
        abortController?: AbortController | null,
        customTimeout?: ApiRequestOptions['timeout']
    ): AbortSignal {
        const timeout: number = customTimeout === false
            ? 86400000
            : (customTimeout ?? this.config.timeout)
        const timeoutSignal: AbortSignal = AbortSignal.timeout(timeout)
        if (abortController) {
            return AbortSignal.any([
                timeoutSignal,
                abortController.signal,
            ])
        }
        return timeoutSignal
    }

    // Отправить запрос и обработать ответ.
    private static async sendRequest<T extends ApiResponseData = ApiResponseData>(
        fullUrl: string,
        requestInit: RequestInit,
        logData: (action: 'Request' | string, data: AnyObject, isError?: boolean) => void
    ): Promise<ApiResponse<T> | ApiError> {
        try {
            const response: Response = await fetch(fullUrl, requestInit)

            if (response.status >= 200 && response.status < 400) {
                // Успешное выполнение.
                try {
                    const data: T = await response.json() as T
                    logData('Response: ' + response.status, data)
                    return {
                        url: fullUrl,
                        request: requestInit,
                        response,
                        success: true,
                        status: response.status,
                        data,
                    }
                } catch (_e) {
                    // Не JSON.
                    const responseText: string = await response.text()
                    const rejectInfo: ApiError = {
                        name: 'JSON Parsing Error',
                        message: 'Failed to parse response data into JSON object.',
                        url: fullUrl,
                        request: requestInit,
                        response,
                        success: false,
                        status: response.status,
                        data: {
                            text: responseText,
                        },
                        errorType: 'parse_error',
                    }
                    logData(
                        'Parse error:',
                        {
                            response,
                            responseText,
                        },
                        true
                    )
                    return rejectInfo
                }
            }

            // Ошибка HTTP >= 400 или < 200.
            const rejectInfo: ApiError = {
                name: `HTTP Error ${response.status}`,
                message: `API request failed with status ${response.status}.`,
                url: fullUrl,
                request: requestInit,
                response,
                success: false,
                status: response.status,
                data: {},
                errorType: 'http_error',
            }
            if (response.status < 100) {
                // Что-то пошло не так. Вообще такое должно было уйти в catch(),
                // но лучше перестраховаться.
                rejectInfo.errorType = 'network_error'
                rejectInfo.name = 'Network Error'
                rejectInfo.message = 'Failed to send request to API: network malfunction.'
                rejectInfo.data = {
                    text: await response.text(),
                }
            } else if (response.status >= 400) {
                // Нормальная HTTP ошибка.
                // Нужно проверить, что там в ответе.
                const responseText: string | object = await response.text()
                try {
                    rejectInfo.data = JSON.parse(responseText)
                } catch (_e) {
                    // Не JSON.
                    rejectInfo.data = {
                        text: responseText,
                    }
                }
                try {
                    if (
                        rejectInfo.data
                        && 'text' in rejectInfo.data
                        && String(rejectInfo.data.text)
                            .slice(0, 1000)
                            .includes('class="html-exception-content"')
                    ) {
                        ApiRequestDebugService.setExceptionHtml(String(rejectInfo.data.text))
                    }

                    logData(
                        response.status >= 100
                            ? `HTTP ${response.status} ${response.statusText} error`
                            : rejectInfo.errorType,
                        {
                            type: rejectInfo.errorType,
                            message: response.statusText,
                            response,
                        },
                        true
                    )

                } catch (_e) {
                    // todo: Раскомментировать если будем использовать Sentry
                    // if (Config.isProduction) {
                    //     Sentry.captureException(exception, {extra: rejectInfo as any});
                    // }
                }
            }

            return rejectInfo
        } catch (error) {
            /** @var {DOMException|SyntaxError|unknown} error **/

            let errorType: ApiError['errorType'] = 'network_error'
            let errorName: string = 'Network Error'
            let errorMessage: string = 'Failed to send request to API: network malfunction.'

            if (error instanceof SyntaxError) {
                // Ошибка декодирования JSON.
                errorType = 'parse_error'
                errorName = 'JSON Parsing Error'
                errorMessage = 'Failed to parse response data into JSON object.'
            } else if (
                error instanceof DOMException
                && (
                    error.name === 'AbortError'
                    || error.name === 'TimeoutError'
                )
                && requestInit.signal
            ) {
                // Запрос отменён извне или по тайм-ауту.
                if (
                    requestInit.signal.reason === 'timeout'
                    || requestInit.signal.reason?.name === 'TimeoutError'
                ) {
                    errorType = 'timeout'
                    errorName = 'Request Timeout'
                    errorMessage = 'API request execution took to long.'
                } else if (
                    requestInit.signal.reason instanceof DOMException
                    || requestInit.signal.reason === 'abort'
                    || requestInit.signal.reason?.name === 'AbortError'
                ) {
                    errorType = 'abort'
                    errorName = 'Request Aborted'
                    errorMessage = 'API request was explicitly aborted.'
                }
            }
            // Тайм-аут, отмена запроса, проблемы с доступом к интернету или серверу.
            const rejectInfo: ApiError = {
                name: errorName,
                message: errorMessage,
                url: fullUrl,
                request: requestInit,
                response: null,
                success: false,
                status: 0,
                data: {
                    error,
                },
                errorType,
            }
            logData(
                rejectInfo.errorType,
                {
                    type: rejectInfo.errorType,
                    error,
                    details: rejectInfo,
                },
                true
            )

            return rejectInfo
        }
    }

    // Проверить объект на наличие Blob значений.
    static isObjectContainBlobs(data: AnyObject): boolean {
        for (const key in data) {
            const value: unknown | unknown[] | AnyObject = data[key]
            if (value instanceof Blob) {
                return true
            }
            if (Array.isArray(value)) {
                if (this.isObjectContainBlobs({...value})) {
                    return true
                }
                continue
            }
            if (
                typeof value === 'object'
                && this.isObjectContainBlobs(value as AnyObject)
            ) {
                return true
            }
        }
        return false
    }

    // Создать объект FormData с данными из объекта data.
    static formDataFromObject(data: AnyObject): FormData {
        const formData = new FormData()
        for (const key in data) {
            this.addValueToFormData(formData, key, data[key])
        }
        return formData
    }

    // Добавить значение любого базового типа в объект FormData.
    // Поддерживаемые типы: null, string, boolean, number, object, array.
    // Значение конвертируется в строку или набор строк
    // вида key[index] если массив или key[subkey] если объект.
    static addValueToFormData(
        formData: FormData,
        key: string,
        value: unknown
    ): void {
        if (value === undefined) {
            return
        }
        if (value === null) {
            formData.append(key, '')
        } else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0')
        } else if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                this.addValueToFormData(formData, `${key}[${i}]`, value[i])
            }
        } else if (value?.constructor === Object) {
            // Обычный объект.
            for (const subKey in value) {
                const subValue: unknown = (value as AnyObject)[subKey]
                this.addValueToFormData(formData, `${key}[${subKey}]`, subValue)
            }
        } else if (value instanceof Blob) {
            // Файл.
            // Имя файла не существует в Blob, но может существовать в обертке над Blob.
            formData.append(key, value, (value as unknown as {name: string;}).name)
        } else {
            formData.append(key, String(value as string | number))
        }
    }

    // Создание URLSearchParams из объекта с данными. Рекурсивный вариант.
    static convertDataObjectToUrlSearchParams(data: AnyObject): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams()

        const fillParams = (obj: object | unknown[], prefix?: string) => {
            // Индекс массива или ключ объекта.
            let p: number | string
            // eslint-disable-next-line @typescript-eslint/no-for-in-array
            for (p in obj) {
                if (p in obj) {
                    const key: string = prefix ? prefix + '[' + String(p) + ']' : String(p)
                    // @ts-ignore - и для object и для array obj.hasOwnProperty(p) проверяет наличие значения для ключа
                    let value: unknown = obj[p]
                    if (value === undefined) {
                        // Такое вполне может быть если объект содержит вот такое: obj = {v: undefined, q: 'test'}.
                        // В этом случае obj.hasOwnProperty('v') вернет true, но obj['v'] или obj.v вернет undefined.
                        // Аналогично для массивов:
                        // arr = ['test', undefined]; arr.hasOwnProperty(1) => true; arr[1] => undefined.
                        continue
                    }
                    if (value !== null && typeof value === 'object') {
                        // Объект или массив: уходим в рекурсию.
                        fillParams(value, key)
                    } else {
                        // Простое значение.
                        if (value === null) {
                            value = ''
                        } else if (typeof value === 'boolean') {
                            value = value ? '1' : '0'
                        }
                        params.set(key, String(value))
                    }
                }
            }
        }

        fillParams(data)

        return params
    }

    // Вывод данных из FormData в консоль.
    static logFormData(data: FormData) {
        const test: AnyObject = {}
        data.forEach((v, k) => test[k] = v)
        console.log(test)
    }
}
