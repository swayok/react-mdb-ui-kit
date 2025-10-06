import {generatePath, PathParam} from 'react-router-dom'

// Сборка URL из частей.
export function makeUrl<QueryArgsType extends object, Path extends string = string>(
    // Путь к странице (/path/to/page или /path/to/resource/:id).
    urlPath: Path,
    // Параметры, которые нужно вставить в path.
    // Пример: {id: 1} для urlPath = /path/to/resource/:id
    params: {
        [key in PathParam<Path>]: string | null;
    } | null = null,
    // URL Query аргументы, которые нужно добавить в URL.
    queryArgs: QueryArgsType | null = null
): string {
    try {
        if (params && Object.keys(params).length > 0) {
            urlPath = generatePath(urlPath, params) as Path
        }
        if (queryArgs && Object.keys(queryArgs).length > 0) {
            const queryString: URLSearchParams = new URLSearchParams(queryArgs as Record<string, string>)
            urlPath = (urlPath + '?' + queryString.toString()) as Path
        }
        return urlPath
    } catch (error) {
        console.error('[makeUrl] Error', error, {urlPath, params, queryArgs})
        return '#'
    }
}
