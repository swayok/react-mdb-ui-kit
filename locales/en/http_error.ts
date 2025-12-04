import {HttpErrorsTranslations} from '../../types'

const translations: HttpErrorsTranslations = {
    go_back: 'Go back',
    code401: {
        toast: 'There was an authorization error. Please login to your account again.',
    },
    code403: {
        title: 'Access denied',
        message: 'Access denied',
        toast: 'Access to requested data is prohibited.',
    },
    code404: {
        title: 'Page not found',
        message: 'Page not found',
        toast: 'Requested data was not found in database.',
    },
    code408: {
        toast: 'Request timeout. Try again.',
    },
    code419: {
        toast: 'This page is outdated. Please refresh the page.',
    },
    code422: {
        toast: 'Invalid data received.',
    },
    code426: {
        toast: 'Outdated version of account detected. The page will be refreshed to apply updates.',
    },
    code429: {
        toast: 'Requests limit per minute exceeded. Try again later.',
    },
    code4xx: {
        toast: 'Request was rejected by server. Try to refresh the page and repeat the action.',
    },
    code500: {
        title: 'Internal server error.',
        message: 'Internal server error.<br>Error was reported to administrators.<br>Try again later.',
        toast: 'Internal server error. Error was reported to administrators. Try again later.',
    },
    unknown: {
        toast: 'Unknown error happened while processing the request.',
    },
    js_error: {
        title: 'Failed to render the content.',
        message: 'Failed to render the content.<br>Error was reported to administrators.<br>Try again later.',
        toast: 'Error happened while rendering the content. Error was reported to administrators. Try again later.',
    },
    code503: {
        title: 'Under maintenance.',
        message: 'Under maintenance.',
        toast: 'Under maintenance. Try again later.',
    },
    code501: {
        toast: 'The server have rejected the request. Try to refresh the page and repeat the action.',
    },
    code502: {
        toast: 'The server is not available. Try again later.',
    },
    code504: {
        toast: 'The server is not available. Try again later.',
    },
    code5xx: {
        toast: 'Unknown error happened while sending the request to server. Try again later.',
    },
    axios: {
        toast: 'Failed to send request to the server: unknown error happened during request preparation. Try to refresh the page and repeat the action.',
    },
    response_parsing: {
        toast: 'Failed to precess response from the server: received data have invalid format. Try to refresh the page and repeat the action.',
    },
}

export default translations
