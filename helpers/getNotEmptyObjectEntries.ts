import type {AnyObject} from '../types'

// Удаляет из объекта все пустые значения (null и пустые строки).
// Возвращает массив пар ключ-значение, подходящий для использования
// в Object.fromEntries(ret).
export function getNotEmptyObjectEntries<T extends AnyObject>(
    obj: T | [string, unknown][],
    // Нужно ли сортировать ключи?
    sort?: boolean
): [string, unknown][] {
    let entries: [string, unknown][] = Array.isArray(obj) ? obj : Object.entries(obj)
    entries = entries.filter(([, value]) => (
        value !== undefined
        && value != null
        && (typeof value !== 'string' || value.trim() !== '')
    ))
    if (sort) {
        entries = entries.sort(
            ([key1], [key2]) => key1.localeCompare(key2)
        )
    }
    return entries
}
