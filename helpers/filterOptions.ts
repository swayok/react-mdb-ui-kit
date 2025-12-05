import {FormSelectOption} from '../types'

// Фильтрация опций по ключевым словам.
export function filterOptions<T = unknown>(
    keywords: string,
    options?: FormSelectOption<T>[],
    // Показывать все опции, если keywords полностью совпадает с value одной из опций.
    showAllOnFullMatch: boolean = false
): FormSelectOption<T>[] {
    if (!options || options.length === 0) {
        return []
    }
    if (keywords.trim() === '') {
        return options
    }
    const filtered: FormSelectOption<T>[] = []
    const regex: RegExp = new RegExp(
        keywords.trim().replace(/[*.?$^(){}\][]+/, '.'),
        'iu'
    )
    for (let i = 0; i < options.length; i++) {
        if (showAllOnFullMatch && options[i].label === keywords.trim()) {
            // Введено значение, которое полностью соответствует одной из опций.
            // В этом случае не нужно фильтровать ничего, нужно показать все опции.
            return options
        }
        if (regex.test(String(options[i].label))) {
            filtered.push(options[i])
        }
    }
    return filtered
}

/** @deprecated */
export default filterOptions
