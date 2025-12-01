import {
    AnyObject,
    FormSelectOption,
    NumericKeysObject,
} from 'swayok-react-mdb-ui-kit/types/Common'

// Набор методов для конвертации различных типов объектов в опции для SelectInput.
export abstract class OptionsHelper {

    // Конвертирует список строк в список опций для использования в этом компоненте.
    static stringListToOptions(list: string[]): FormSelectOption<string>[] {
        const options: FormSelectOption<string>[] = []
        for (let i = 0; i < list.length; i++) {
            options.push({
                label: list[i],
                value: list[i],
            })
        }
        return options
    }

    // Конвертирует список объектов в список опций для использования в этом компоненте.
    static objectListToOptions<ObjectType extends object, ValueType = string>(
        list: ObjectType[],
        labelKey: keyof ObjectType,
        valueKey: keyof ObjectType
    ): FormSelectOption<ValueType>[] {
        const options: FormSelectOption<ValueType>[] = []
        for (let i = 0; i < list.length; i++) {
            options.push({
                label: list[i][labelKey] as string,
                value: list[i][valueKey] as ValueType,
            })
        }
        return options
    }

    // Конвертирует одномерный объект (ключ-значение) в список опций для использования в этом компоненте.
    // Ключ в объекте: строка или число (value для опции), значение: строка (label для опции).
    static keyValueObjectToOptions<T extends string | number = string>(
        assocObject: T extends number ? NumericKeysObject<string> : AnyObject<string>
    ): FormSelectOption<T>[] {
        const options: FormSelectOption<T>[] = []
        for (const objectKey in assocObject) {
            options.push({
                label: assocObject[objectKey] as string,
                value: objectKey as unknown as T,
            })
        }
        return options
    }
}

/** @deprecated */
export default OptionsHelper
