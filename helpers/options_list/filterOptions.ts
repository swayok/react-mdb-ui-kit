/* eslint-disable @typescript-eslint/no-explicit-any */
import {FormSelectOption} from '../../types'

// Фильтрация опций по ключевым словам.
export function filterOptions<
    T extends string | FormSelectOption<any> = string | FormSelectOption<any>,
>(
    keywords: string,
    options?: T[],
    // Показывать все опции, если keywords полностью совпадает с value одной из опций.
    showAllOnFullMatch: boolean = false,
    // Если value полностью совпадает с keywords и оно единственное осталось
    // в списке, то нужно вернуть пустой массив.
    emptyOnSingleFullMatch: boolean = false
): T[] {
    if (!options || options.length === 0) {
        return []
    }
    if (keywords.trim() === '') {
        return options
    }
    const filtered: T[] = []
    const regex: RegExp = new RegExp(
        keywords.trim().replace(/[*.?$^(){}\][]+/, '.'),
        'iu'
    )
    for (const option of options) {
        const label = typeof option === 'string'
            ? option
            : option.label
        if (showAllOnFullMatch && label === keywords.trim()) {
            // Введено значение, которое полностью соответствует одной из опций.
            // В этом случае не нужно фильтровать ничего, нужно показать все опции.
            return options
        }
        if (regex.test(String(label))) {
            filtered.push(option)
        }
    }
    if (
        emptyOnSingleFullMatch
        && filtered.length === 1
        && (
            typeof filtered[0] === 'string'
                ? filtered[0] === keywords
                : filtered[0].label === keywords
        )
    ) {
        return []
    }
    return filtered
}
