import NavigationService from '../services/NavigationService'
import ToastService from '../services/ToastService'
import {ApiError, ApiResponse, ValidationErrorsResponseData} from '../services/ApiRequestService'
import {AnyObject, ApiResponseData, HttpErrorsTranslations} from '../types/Common'

export const TimeoutErrorHttpCode: number = 408
export const ValidationErrorHttpCode: number = 422
export const UnauthorisedErrorHttpCode: number = 401
export const AccessDeniedErrorHttpCode: number = 403

export type ApiRequestErrorHelpersConfig = {
    logoutRoute: string,
    translator: () => HttpErrorsTranslations
}

let config: ApiRequestErrorHelpersConfig = {
    logoutRoute: '/logout',
    translator(): HttpErrorsTranslations {
        return {} as HttpErrorsTranslations
    },
}

export function configureApiRequestErrorHelpers(newConfig: ApiRequestErrorHelpersConfig): void {
    config = newConfig
}

export type ErrorHandlers = {
    suppressValidationErrorMessage?: boolean,
    suppressUnauthorisedErrorMessage?: boolean,
    suppressErrorMessagesForHttpCodes?: number[],
    requestSendingError?: null | ((error: ApiError, handlers: ErrorHandlers) => void),
    responseParsingError?: null | ((error: ApiError, handlers: ErrorHandlers) => void),
    timeoutError?: null | ((error: ApiError, handlers: ErrorHandlers) => void),
    // next 2 handlers triggered only by default http4xxError - handleHttp4xxErrorResponse()
    validationErrors?: null | ((errors: AnyObject<string>, response: ApiError) => void),
    unauthorisedError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    accessDeniedError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    // replaces validationErrors and unauthorisedError handlers - use handleHttp4xxErrorResponse() inside to trigger that handlers
    http4xxError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    http5xxError?: null | ((response: ApiError, handlers: ErrorHandlers) => void),
    handleMessage?: null | ((response: ApiResponse | ApiError, message?: string, messageType?: ApiResponseData['_message_type']) => void),
    anyHttpError?: ((response: ApiError, handlers: ErrorHandlers) => void),
};

const defaultErrorHandlers: ErrorHandlers = {
    suppressValidationErrorMessage: false,
    suppressUnauthorisedErrorMessage: false,
    validationErrors: null,
    requestSendingError: handleRequestSendingError,
    responseParsingError: handleResponseParsingError,
    timeoutError: handleRequestTimeoutResponse,
    unauthorisedError: handleAuthorisationErrorResponse,
    accessDeniedError: handleAccessDeniedErrorErrorResponse,
    http5xxError: handleHttp5xxErrorResponse,
    http4xxError: handleHttp4xxErrorResponse,
    handleMessage: handleMessageFromResponse,
}

/**
 * Обработка ошибочного ответа от сервера.
 * @param {ApiError} error
 * @param {ErrorHandlers} handlers Позволяет переопределить обработчики ошибок используемые по умолчанию.
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
export function handleAccessDeniedErrorErrorResponse(response: ApiError, handlers: ErrorHandlers): void {
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

// Отображает сообщение через ToastService если есть параметр response.data._message.
// Тип сообщения по умолчанию success для HTTP code >= 100 и < 400 или error для HTTP code < 100 и >= 400.
// Тип сообщения может быть изменен параметром response.data._message_type
export function handleMessageFromResponse(
    response: ApiResponse | ApiError,
    message?: string,
    messageType?: ApiResponseData['_message_type']
): void {
    if (message === undefined) {
        message = response.data._message
    }
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
            for (let i = 0; i < errorsForKey.length; i++) {
                normalizedErrorsList.push(String(errorsForKey[i]).trim().replace(/[.;]$/, ''))
            }
            errors[key] = normalizedErrorsList.join('; ') + '.'
        }
    }
    return errors as AnyObject<string>
}

export type NormalizedNestedLaravelValidationErrors = AnyObject<string | NormalizedNestedLaravelValidationErrors>

/**
 * Нормализация ошибок валидации данных полученных из Laravel для массивов и объектов.
 * Laravel возвращает ошибки в виде {'array.0': messages, 'array.1': messages, 'object.key': messages}.
 * Этот метод конвертирует:
 * 1. {'array.0': 'string1', 'array.3': 'string2'} в {array: {0: 'string1', 3: 'string2'}}
 * 2. {'object.key1': 'string1', 'object.key2': 'string2'} в {object: {key1: 'string1', key2: 'string2'}}
 * Рекурсивно.
 * @param errors
 */
export function normalizeValidationErrorsKeysForArraysAndObjects(
    errors: AnyObject<string>
): NormalizedNestedLaravelValidationErrors {
    const ret: NormalizedNestedLaravelValidationErrors = {}
    for (const errorsKey in errors) {
        const parts = errorsKey.split('.', 2)
        if (parts.length === 0) {
            // Обычный ключ
            ret[errorsKey] = errors[errorsKey]
            continue
        }
        if (!(parts[0] in ret)) {
            ret[parts[0]] = {}
        } else if (typeof ret[parts[0]] !== 'object') {
            // Конфликт с другим ключом содержащим строку
            ret[errorsKey] = errors[errorsKey]
            continue
        }

        (ret[parts[0]] as AnyObject<string>)[parts[1]] = errors[errorsKey]
    }
    for (const retKey in ret) {
        if (typeof retKey === 'object') {
            // Рекурсивно конвертируем в объекты
            ret[retKey] = normalizeValidationErrorsKeysForArraysAndObjects(
                ret[retKey] as AnyObject<string>
            )
        }
    }
    return ret
}
