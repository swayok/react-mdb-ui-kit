import {HtmlErrorResponseData, OtherErrorResponseData} from '../services/ApiRequestService'
import {HttpErrorsTranslations} from 'swayok-react-mdb-ui-kit/types/Translations'
import {NavigationService} from '../services/NavigationService'
import {ToastService} from '../services/ToastService'
import {ApiError, ApiResponse, ValidationErrorsResponseData} from '../services/ApiRequestService'
import {AnyObject, ApiResponseData} from 'swayok-react-mdb-ui-kit/types/Common'

export const TimeoutErrorHttpCode: number = 408
export const ValidationErrorHttpCode: number = 422
export const UnauthorisedErrorHttpCode: number = 401
export const AccessDeniedErrorHttpCode: number = 403

/**
 * Глобальные настройки обработки ошибок от API.
 */
export interface ApiRequestErrorHelpersConfig {
    logoutRoute: string,
    translator: () => HttpErrorsTranslations
}

let config: ApiRequestErrorHelpersConfig = {
    logoutRoute: '/logout',
    translator(): HttpErrorsTranslations {
        return {} as HttpErrorsTranslations
    },
}

/**
 * Задать глобальные настройки обработки ошибок от API.
 */
export function configureApiRequestErrorHelpers(newConfig: ApiRequestErrorHelpersConfig): void {
    config = newConfig
}

/**
 * Обработчики ошибок и настройки обработки ошибок от API.
 */
export interface ErrorHandlers {
    /**
     * Если true, то отключает вызов handleMessage при ошибке валидации данных (HTTP 422).
     * По умолчанию: false.
     *
     * @see handleErrorResponse()
     */
    suppressValidationErrorMessage?: boolean,
    /**
     * Если true, то отключает вызов handleMessage при ошибке авторизации (HTTP 401).
     * По умолчанию: false.
     *
     * @see handleErrorResponse()
     */
    suppressUnauthorisedErrorMessage?: boolean,
    /**
     * Отключает обработку ошибок для указанных HTTP кодов.
     *
     * @see handleErrorResponse()
     */
    suppressErrorMessagesForHttpCodes?: number[],
    /**
     * Обработчик ошибки при отправке запроса.
     *
     * @see handleRequestSendingError()
     */
    requestSendingError?: null | ((error: ApiError, handlers: ErrorHandlers) => void),
    /**
     * Обработчик ошибки при парсинге данных ответа.
     *
     * @see handleResponseParsingError()
     */
    responseParsingError?: null | ((error: ApiError, handlers: ErrorHandlers) => void),
    /**
     * Обработчик ошибки 408 (Request Timeout).
     *
     * @see handleRequestTimeoutResponse()
     * @see TimeoutErrorHttpCode
     */
    timeoutError?: null | ((error: ApiError, handlers: ErrorHandlers) => void),
    /**
     * Следующие 3 обработчика вызываются в стандартном http4xxError обработчике.
     *
     * @see handleHttp4xxErrorResponse()
     */
    /**
     * Обработчик ошибки валидации данных (HTTP 422).
     * По умолчанию: null.
     *
     * @see ValidationErrorHttpCode
     */
    validationErrors?: null | ((errors: AnyObject<string>, response: ApiError) => void),
    /**
     * Обработчик ошибки HTTP 403 (Access Denied).
     *
     * @see handleAuthorisationErrorResponse()
     * @see AccessDeniedErrorHttpCode
     */
    unauthorisedError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    /**
     * Обработчик ошибки HTTP 401 (Unauthorized).
     *
     * @see handleAccessDeniedErrorResponse()
     * @see UnauthorisedErrorHttpCode
     */
    accessDeniedError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    /**
     * Обработчик ошибок HTTP 4xx (400-499).
     * Задание этого обработчика отключит использование обработчиков
     * validationErrors, unauthorisedError, accessDeniedError, которые вызываются
     * в стандартном http4xxError обработчике.
     *
     * @see handleHttp4xxErrorResponse()
     */
    http4xxError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    /**
     * Обработчик ошибок HTTP 5xx (500-599).
     * @see handleHttp5xxErrorResponse()
     */
    http5xxError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    /**
     * @see handleMessageFromResponse()
     */
    handleMessage?: null | ((response: ApiResponse | ApiError, message?: string, messageType?: ApiResponseData['_message_type']) => void),
    /**
     * Вызывается при любой HTTP ошибке (HTTP код >= 400), даже если ошибка
     * уже была обработана другим обработчиком HTTP ошибок.
     * Если произошла на HTTP ошибка, то не вызывается.
     */
    anyHttpError?: ((response: ApiError, handlers: ErrorHandlers) => void),
}

// Стандартные обработчики ошибок и настройки обработки ошибок.
const defaultErrorHandlers: ErrorHandlers = {
    suppressValidationErrorMessage: false,
    suppressUnauthorisedErrorMessage: false,
    validationErrors: null,
    requestSendingError: handleRequestSendingError,
    responseParsingError: handleResponseParsingError,
    timeoutError: handleRequestTimeoutResponse,
    unauthorisedError: handleAuthorisationErrorResponse,
    accessDeniedError: handleAccessDeniedErrorResponse,
    http5xxError: handleHttp5xxErrorResponse,
    http4xxError: handleHttp4xxErrorResponse,
    handleMessage: handleMessageFromResponse,
}

/**
 * Обработка ошибочного ответа от сервера.
 * @param {ApiError} error
 * @param {ErrorHandlers} handlers Позволяет переопределить обработчики ошибок, используемые по умолчанию.
 */
export function handleErrorResponse(error: ApiError, handlers: ErrorHandlers = {}): void {
    if (error.request) {
        console.log('[API][ERROR]', {
            request: error.request,
            response: error.response,
        })
    } else {
        console.log('[API][ERROR]', error)
        console.trace()
    }
    handlers = Object.assign({}, defaultErrorHandlers, handlers)
    if (error.errorType === 'timeout' || error.status === TimeoutErrorHttpCode) {
        handlers.timeoutError?.(error, handlers)
        return
    } else if (error.errorType === 'abort') {
        return
    } else if (error.status < 100 || error.errorType === 'network_error' || !error.response) {
        handlers.requestSendingError?.(error, handlers)
        return
    } else if (error.data.html || error.errorType === 'parse_error') {
        handlers.responseParsingError?.(error, handlers)
        return
    }
    const response: Response = error.response
    if (error.data._message) {
        if (
            !(handlers.suppressValidationErrorMessage && response.status === ValidationErrorHttpCode)
            && !(handlers.suppressUnauthorisedErrorMessage && response.status === UnauthorisedErrorHttpCode)
            && !handlers.suppressErrorMessagesForHttpCodes?.includes(response.status)
        ) {
            handlers.handleMessage?.(error, error.data._message, 'error')
        }
    }
    if (response.status >= 500) {
        // server errors
        handlers.http5xxError?.(error, handlers)
    } else if (response.status >= 400) {
        // request errors
        handlers.http4xxError?.(error, handlers)
    } else if (response.status >= 300 && error.data && (error.data._redirect || error.data._redirect_back)) {
        // redirects
        if (error.data._redirect_back) {
            NavigationService.goBack(error.data._redirect_back)
        } else if (error.data._redirect) {
            NavigationService.replace(error.data._redirect)
        }
    }

    handlers.anyHttpError?.(error, handlers)
}

// Добавить сообщение к API ошибке, если в данных из API нет сообщения (_message).
export function addFallbackMessageToApiError(error: ApiError, message: string): void {
    if (!error.data._message) {
        error.data._message = message
        error.data._message_type = 'error'
    }
}

// Добавить сообщение к данным ответа из API, если там нет сообщения (_message).
export function addFallbackMessageToResponseData(
    data: ApiResponseData,
    message: string,
    type: ApiResponseData['_message_type'] = 'success'
): void {
    if (!data._message) {
        data._message = message
        data._message_type = type
    }
}

// Обработка ошибки при отправке запроса на сервер.
export function handleRequestSendingError(error: ApiError, handlers: ErrorHandlers): void {
    console.error('[API][ERROR][Internal]')
    handlers.handleMessage?.(error, config.translator().axios.toast, 'error')
    // todo: Раскомментировать если будем использовать Sentry
    // if (Config.isProduction && error.status !== 0) {
    //     Sentry.captureMessage('Failed to send API request to server', {
    //         extra: JSON.parse(JSON.stringify(error)),
    //     })
    // }
}

// Обработка ошибки при обработке данных ответа от сервера.
export function handleResponseParsingError(error: ApiError, handlers: ErrorHandlers): void {
    console.error('[API][ERROR][Response]: data parsing failed')
    handlers.handleMessage?.(error, config.translator().response_parsing.toast, 'error')
}

// Обработка ошибки, когда запрос отменен по тайм-ауту.
export function handleRequestTimeoutResponse(error: ApiError, handlers: ErrorHandlers): void {
    console.log('[API][ERROR][Timeout]')
    handlers.handleMessage?.(error, config.translator().code408.toast, 'error')
}

// Обработка ошибок с HTTP code >= 400 и < 500.
export function handleHttp4xxErrorResponse(response: ApiError, handlers: ErrorHandlers): boolean {
    console.log('[API][ERROR][4xx]', JSON.stringify({
        http_code: response.status,
        data: response.data,
    }, null, 2))
    // Ошибки, имеющие специальные обработчики.
    switch (response.status) {
        case UnauthorisedErrorHttpCode:
            // Пользователь не авторизован.
            handlers.unauthorisedError?.(response, handlers)
            return true
        case AccessDeniedErrorHttpCode:
            // Пользователь не имеет доступа к функционалу.
            handlers.accessDeniedError?.(response, handlers)
            return true
        case ValidationErrorHttpCode:
            // Ошибки валидации данных.
            if (!response.data._message) {
                handlers.handleMessage?.(response, config.translator().code422.toast, 'error')
            }
            if (handlers.validationErrors) {
                const errors = extractAndNormalizeValidationErrorsFromResponseData(response.data)
                handlers.validationErrors(errors, response)
            }
            return true
        case 426:
            // Требуется перезагрузка страницы.
            ToastService.error(config.translator().code426.toast, 8000)
            setTimeout(() => document.location.reload(), 8000)
            return true
    }
    if (!handlers.handleMessage) {
        // Нет обработчика отображения сообщения.
        return false
    }
    if (response.data._message) {
        // В ответе уже есть сообщение, не нужно его заменять.
        return true
    }
    let message: string
    switch (response.status) {
        case 403:
            message = config.translator().code403.toast
            break
        case 404:
            message = config.translator().code404.toast
            break
        case 419:
            message = config.translator().code419.toast
            break
        case 429:
            message = config.translator().code429.toast
            break
        default:
            message = config.translator().code4xx.toast
            break
    }
    handlers.handleMessage(response, message, 'error')
    return true
}

// Обработка ошибок с HTTP code >= 500.
export function handleHttp5xxErrorResponse(response: ApiError, handlers: ErrorHandlers): boolean {
    console.log('[API][ERROR][5xx]', JSON.stringify({
        http_code: response.status,
        data: response.data,
    }, null, 2))
    if (!handlers.handleMessage) {
        return false
    }
    if (response.data._message) {
        return true
    }
    let message: string
    switch (response.status) {
        case 500:
            message = config.translator().code500.toast
            break
        case 501:
            message = config.translator().code501.toast
            break
        case 502:
            message = config.translator().code502.toast
            break
        case 503:
            message = config.translator().code503.toast
            break
        case 504:
            message = config.translator().code504.toast
            break
        default:
            message = config.translator().code5xx.toast
            break
    }
    handlers.handleMessage(response, message, 'error')
    return true
}

// Обработка ошибки авторизации пользователя.
export function handleAuthorisationErrorResponse(response: ApiError, handlers: ErrorHandlers): void {
    if (!response.data._message) {
        handlers.handleMessage?.(response, config.translator().code401.toast, 'error')
    }
    NavigationService.navigate(config.logoutRoute)
}

// Обработка ошибки ограничения доступа.
export function handleAccessDeniedErrorResponse(response: ApiError, handlers: ErrorHandlers): void {
    if (!response.data._message) {
        handlers.handleMessage?.(response, config.translator().code403.toast, 'error')
    }
}

// Обработка ответа после успешного запроса на сервер (code >= 100 и < 400).
export function handleSuccessResponse<T extends ApiResponseData = ApiResponseData>(response: ApiResponse<T>): void {
    if (response.data._message) {
        handleMessageFromResponse(response)
    }
    if (response.data._redirect_back) {
        NavigationService.goBack(response.data._redirect_back)
    } else if (response.data._redirect) {
        NavigationService.replace(response.data._redirect)
    }
}

// Обработка данных ответа после успешного запроса на сервер (code >= 100 и < 400).
export function handleSuccessResponseData<T extends ApiResponseData = ApiResponseData>(data: T): void {
    if (data._message) {
        handleMessageFromResponse({
            status: 200,
            data,
        } as ApiResponse<T>)
    }
    if (data._redirect_back) {
        NavigationService.goBack(data._redirect_back)
    } else if (data._redirect) {
        NavigationService.replace(data._redirect)
    }
}

// Отображает сообщение через ToastService, если есть параметр response.data._message.
// Тип сообщения по умолчанию success для HTTP code >= 100 и < 400 или error для HTTP code < 100 и >= 400.
// Тип сообщения может быть изменен параметром response.data._message_type
export function handleMessageFromResponse(
    response: ApiResponse | ApiError,
    message?: string,
    messageType?: ApiResponseData['_message_type']
): void {
    message ??= response.data._message
    if (!message) {
        return
    }
    if (!messageType) {
        messageType = 'success'
        if (response.data._message_type) {
            messageType = response.data._message_type
        } else if (response.status >= 400 || response.status < 100) {
            messageType = 'error'
        }
    }
    console.log(`[API][${messageType.toUpperCase()}][Message]`, {
        message,
        messageType,
        http_code: response.status,
    })
    let duration: number | undefined
    if (message.length > 100) {
        duration = 1000 + Math.ceil(message.length / 50) * 1800
    }
    switch (messageType) {
        case 'info':
        case 'notice':
            ToastService.info(message, duration)
            break
        case 'error':
            ToastService.error(message, duration)
            break
        case 'success':
        default:
            ToastService.success(message, duration)
    }
}

// Нормализация списка ошибок валидации данных полученных из Laravel.
// Сообщения могут быть массивами, что не подходит для удобного использования в JS.
export function extractAndNormalizeValidationErrorsFromResponseData(responseData: ApiError['data']): AnyObject<string> {
    const errors = (responseData.errors ?? {}) as ValidationErrorsResponseData['errors']
    for (const key in errors) {
        const errorsForKey = errors[key]
        if (Array.isArray(errorsForKey)) {
            const normalizedErrorsList = []
            for (const item of errorsForKey) {
                normalizedErrorsList.push(String(item).trim().replace(/[.;]$/, ''))
            }
            errors[key] = normalizedErrorsList.join('; ') + '.'
        }
    }
    return errors as AnyObject<string>
}

// Нормализованный набор ошибок валидации данных полученных из Laravel для массивов и объектов.
export interface NormalizedNestedLaravelValidationErrors {
    [Key: string]: (string | NormalizedNestedLaravelValidationErrors)
}

/**
 * Нормализация ошибок валидации данных полученных из Laravel для массивов и объектов.
 * Laravel возвращает ошибки в виде {'array.0': messages, 'array.1': messages, 'object.key': messages}.
 * Этот метод конвертирует:
 * 1. {'array.0': 'string1', 'array.3': 'string2'} в {array: {0: 'string1', 3: 'string2'}}
 * 2. {'object.key1': 'string1', 'object.key2': 'string2'} в {object: {key1: 'string1', key2: 'string2'}}
 * 2. {'object.0.key1': 'string1', 'object.0.key2': 'string2'} в {object: {0: {key2: 'string1', key3: 'string2'}}}
 * Рекурсивно.
 *
 * Внимание! Вызывать только после extractAndNormalizeValidationErrorsFromResponseData().
 * @param errors
 */
export function normalizeValidationErrorsKeysForArraysAndObjects<ErrorsType extends object = AnyObject<string>>(
    errors: ErrorsType
): NormalizedNestedLaravelValidationErrors {
    const ret: AnyObject = {}
    for (const errorsKey in errors) {
        const parts: string[] = errorsKey.split('.')
        const maxDepth: number = parts.length
        if (maxDepth === 1) {
            // Обычный ключ.
            ret[errorsKey] = errors[errorsKey] as string
            continue
        }
        let tmp: AnyObject = ret;
        for (let depth = 0; depth < maxDepth; depth++) {
            const subKey: string = parts[depth]
            if (subKey in tmp && typeof tmp[subKey] !== 'object') {
                // Конфликт: ключ parts[i] уже существует в tmp и
                // Конфликт с другим ключом, содержащим строку.
                tmp[parts.slice(depth).join('.')] = errors[errorsKey] as string
                break;
            }
            if (depth === maxDepth - 1) {
                // Достигнута максимальная глубина: сохраняем сообщение об ошибке.
                tmp[parts[depth]] = errors[errorsKey] as string
                break;
            }
            if (!(subKey in tmp)) {
                tmp[parts[depth]] = {}
            }
            // Перемещаемся глубже.
            tmp = tmp[parts[depth]]
        }
    }
    return ret as NormalizedNestedLaravelValidationErrors
}

const defaultApiErrorData: ApiError = {
    data: {},
    errorType: 'http_error',
    message: 'Unknown error',
    name: 'Unknown error',
    request: {},
    response: null,
    status: 0,
    success: false,
    url: '',
}

// Создать объект ApiError с указанным статусом и данными.
export function createApiError<
    T extends ApiResponseData = ApiResponseData | ValidationErrorsResponseData | HtmlErrorResponseData | OtherErrorResponseData
>(status: number, errorData?: Partial<Omit<ApiError<T>, 'status'>>): ApiError<T> {
    return {
        ...(defaultApiErrorData as ApiError<T>),
        ...(errorData ?? {}),
        status,
    }
}
