import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionsAndGroupsList,
} from '../../../types'
import {FlattenedOptionOrGroup} from '../SelectInput/SelectInputTypes'

export type InfoCollectorFn<
    GroupInfoType extends AnyObject = AnyObject,
    OptionExtrasType extends AnyObject = AnyObject,
    OptionValueType = string,
> = (
    group: FormSelectOptionGroup<OptionValueType, OptionExtrasType>,
    flatIndex: number,
    depth: number
) => GroupInfoType | undefined | null

// Преобразование многомерного списка опций в плоский массив.
export function flattenOptions<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
    GroupInfoType extends AnyObject = AnyObject,
>(
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>,
    // Ожидается, что flat передается как "ссылка" на массив.
    // Т.е. в flattenOptions производится модификация этого массива, не создавая новые.
    flat: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType, GroupInfoType>[],
    groupIndex: number | null = null,
    depth: number = 0,
    // Сборщик дополнительной информации о группе для вложенных в нее опций.
    groupInfoCollector?: InfoCollectorFn<GroupInfoType, OptionExtrasType, OptionValueType>,
    // Дополнительная информация о группе для переданных опций (options).
    groupInfo?: GroupInfoType | null
): FlattenedOptionOrGroup<OptionValueType, OptionExtrasType, GroupInfoType>[] {
    for (let i = 0; i < options.length; i++) {
        if ('options' in options[i]) {
            const {
                options: nestedOptions,
                ...flatGroupData
            } = options[i]
            if (nestedOptions.length === 0) {
                continue
            }
            flat.push({
                isGroup: true,
                data: flatGroupData,
                index: i,
                depth,
            })
            const groupInfo = groupInfoCollector?.(
                options[i] as FormSelectOptionGroup<OptionValueType, OptionExtrasType>,
                flat.length,
                depth
            )
            const lengthBefore = flat.length
            // Нам нужно модифицировать массив flat, не перезаписывая его.
            // Это позволит использовать всего 1 массив во всех рекурсиях.
            flattenOptions(
                nestedOptions as FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>,
                flat,
                i,
                depth + 1,
                groupInfoCollector,
                groupInfo
            )
            if (lengthBefore === flat.length) {
                // Ни одной опции не добавлено: скрываем группу.
                flat.pop()
            }
        } else {
            flat.push({
                isGroup: false,
                data: options[i] as FormSelectOption<OptionValueType, OptionExtrasType>,
                index: i,
                depth,
                groupIndex,
                groupInfo,
            })
        }
    }
    return flat
}
