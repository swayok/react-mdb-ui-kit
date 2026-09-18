import type {AnyObject} from '../types'

// Удаляет из объекта все пустые значения (null и пустые строки).
// Возвращает массив пар ключ-значение, подходящий для использования
// в new URLSearchParams(ret) или Object.fromEntries(ret).
export function getCleanUrlSearchParamsEntries<T extends AnyObject>(
    urlQueryParams: T,
    // Нужно ли сортировать ключи?
    sort?: boolean
): [string, string][] {
    let entries = Object.entries(urlQueryParams)
        .filter(([, value]) => (
            value !== undefined
            && value != null
            && String(value).trim() !== ''
        ))
    if (sort) {
        entries = entries.sort(([key1], [key2]) => key1.localeCompare(key2))
    }
    return entries.map(entry => [entry[0], String(entry[1])])
}
