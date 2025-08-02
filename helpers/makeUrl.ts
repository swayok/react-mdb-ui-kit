import {generatePath} from 'react-router-dom'
import {ExtractRouteParams} from 'swayok-react-mdb-ui-kit/services/NavigationService'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'

// Сборка URL из частей.
export function makeUrl<QueryArgsType = AnyObject<string>>(
    // Путь к странице (/path/to/page или /path/to/resource/:id).
    urlPath: string,
    // Параметры, которые нужно вставить в path.
    // Пример: {id: 1} для urlPath = /path/to/resource/:id
    params: ExtractRouteParams<string> | null = null,
    // URL Query аргументы, которые нужно добавить в URL.
    queryArgs: QueryArgsType | null = null
) {
    if (params && Object.keys(params).length > 0) {
        urlPath = generatePath(urlPath, params)
    }
    if (queryArgs && Object.keys(queryArgs).length > 0) {
        const queryString: URLSearchParams = new URLSearchParams(queryArgs)
        urlPath += '?' + queryString.toString()
    }
    return urlPath
}
