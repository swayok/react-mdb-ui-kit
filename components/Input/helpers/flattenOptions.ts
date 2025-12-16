import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionsAndGroupsList,
} from '../../../types'
import {FlattenedOptionOrGroup} from '../SelectInput/SelectInputTypes'

// Преобразование многомерного списка опций в плоский массив.
export function flattenOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
>(
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>,
    // Ожидается, что flat передается как "ссылка" на массив.
    // Т.е. в flattenOptions производится модификация этого массива, не создавая новые.
    flat: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[],
    groupIndex: number | null = null
): FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[] {
    for (let i = 0; i < options.length; i++) {
        if ('options' in options[i]) {
            const {
                options: nestedOptions,
                ...groupOption
            } = options[i]
            flat.push({
                isGroup: true,
                data: groupOption,
                index: i,
            })
            // Нам нужно модифицировать массив flat, не перезаписывая его.
            // Это позволит использовать всего 1 массив во всех рекурсиях.
            flattenOptions(
                nestedOptions as FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>,
                flat,
                i
            )
        } else {
            flat.push({
                isGroup: false,
                data: options[i] as FormSelectOption<OptionValueType, OptionExtrasType>,
                index: i,
                groupIndex,
            })
        }
    }
    return flat
}
