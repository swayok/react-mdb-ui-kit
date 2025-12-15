import {stripTags} from '../../../helpers/stripTags'

// Определение нужно ли отображать опцию в выпадающем списке.
export function shouldDisplaySelectInputOption(
    label: string,
    value: unknown,
    hideEmptyOption: boolean = false,
    search: boolean = false,
    keywordsRegexp: RegExp | null = null,
    labelsContainHtml: boolean = false
): boolean {
    const isEmptyOption = value === null || value === ''
    if (hideEmptyOption && isEmptyOption) {
        // Не показываем опцию с пустым значением.
        return false
    }
    // Фильтрация опций по ключевым словам.
    if (search && keywordsRegexp) {
        const labelForFilter: string = labelsContainHtml
            ? stripTags(label)
            : label
        if (labelForFilter.match(keywordsRegexp) === null) {
            return false
        }
    }

    return true
}
