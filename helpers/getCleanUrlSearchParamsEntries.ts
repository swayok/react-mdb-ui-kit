import type {AnyObject} from '../types'
import {getNotEmptyObjectEntries} from './getNotEmptyObjectEntries'

// Удаляет из объекта все пустые значения (null и пустые строки).
// Возвращает массив пар ключ-значение, подходящий для использования
// в new URLSearchParams(ret) или Object.fromEntries(ret).
export function getCleanUrlSearchParamsEntries<T extends AnyObject>(
    urlQueryParams: T,
    // Нужно ли сортировать ключи?
    sort?: boolean
): [string, string][] {
    return getNotEmptyObjectEntries(urlQueryParams, sort)
        .map(entry => [entry[0], String(entry[1])])
}
