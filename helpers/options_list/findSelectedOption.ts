import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionsAndGroupsList,
} from '../../types'
import {isSameOptionValue} from './isSameOptionValue'

export interface SelectedOption<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> {
    expectedValue?: OptionValueType | null
    option: FormSelectOption<OptionValueType, OptionExtrasType>
    index: number
    groupIndex: number | null
}

/**
 * Найти выбранную опцию.
 * Если опция не найдена:
 * а) Возвращает emptyOption, если указано.
 * б) Если returnFirstIfNotFound === true, возвращает первый не disabled
 * FormSelectOption объект из options (не FormSelectOptionGroup).
 * в) Возвращает undefined, если returnFirstIfNotFound === false или
 * в options нет ни одного не disabled FormSelectOption объекта.
 */
export function findSelectedOption<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
>(
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>,
    value?: OptionValueType | null,
    emptyOption?: FormSelectOption<OptionValueType, OptionExtrasType>,
    permanentOption?: FormSelectOption<OptionValueType, OptionExtrasType>,
    returnFirstIfNotFound: boolean = false
): SelectedOption<OptionValueType, OptionExtrasType> | undefined {
    if (value !== undefined) {
        if (emptyOption && value === emptyOption.value) {
            return {
                expectedValue: value,
                option: emptyOption,
                index: -1,
                groupIndex: null,
            }
        }
        if (permanentOption && value === permanentOption.value) {
            return {
                expectedValue: value,
                option: permanentOption,
                index: -1,
                groupIndex: null,
            }
        }
        // Значение задано, и оно не соответствует опции с пустым значением.
        for (let i = 0; i < options.length; i++) {
            if ('options' in options[i]) {
                // options group
                const subOptions = options[i].options as FormSelectOptionGroup<OptionValueType, OptionExtrasType>['options']
                for (let j = 0; j < subOptions.length; j++) {
                    if (isSameOptionValue(value, subOptions[j].value)) {
                        return {
                            expectedValue: value,
                            option: subOptions[j],
                            index: j,
                            groupIndex: i,
                        }
                    }
                }
            } else if (isSameOptionValue(value, options[i].value)) {
                return {
                    expectedValue: value,
                    option: options[i] as FormSelectOption<OptionValueType, OptionExtrasType>,
                    index: i,
                    groupIndex: null,
                }
            }
        }
    }
    // Значение не найдено в списке опций.
    // Возвращаем опцию с пустым значением, если задана.
    if (emptyOption) {
        return {
            expectedValue: value,
            option: emptyOption,
            index: -1,
            groupIndex: null,
        }
    }
    if (returnFirstIfNotFound) {
        // Или ищем первую опцию в списке.
        // Учитываем, что может быть группировка опций и заблокированные (disabled) опции.
        for (let i = 0; i < options.length; i++) {
            if ('options' in options[i]) {
                // Группа опций.
                const subOptions = options[i].options as FormSelectOptionGroup<OptionValueType, OptionExtrasType>['options']
                if (subOptions.length > 0) {
                    for (let j = 0; j < subOptions.length; j++) {
                        if (!subOptions[j].disabled && !subOptions[j].attributes?.disabled) {
                            return {
                                expectedValue: value,
                                option: subOptions[0],
                                index: j,
                                groupIndex: i,
                            }
                        }
                    }
                }
            } else {
                // Опция.
                const option = options[i] as FormSelectOption<OptionValueType, OptionExtrasType>
                if (!option.disabled && !option.attributes?.disabled) {
                    return {
                        expectedValue: value,
                        option,
                        index: i,
                        groupIndex: null,
                    }
                }
            }
        }
    }
    // В списке нет активных опций.
    return undefined
}
