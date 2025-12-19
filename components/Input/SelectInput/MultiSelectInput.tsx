import clsx from 'clsx'
import {
    useEffect,
    useMemo,
} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionsList,
} from '../../../types'
import {flattenOptions} from '../helpers/flattenOptions'
import {MultiSelectInputOptions} from './MultiSelectInputOptions'
import {SelectInputBase} from './SelectInputBase'
import {
    FlattenedOptionOrGroup,
    MultiSelectInputOptionExtras,
    MultiSelectInputOptionsGroupInfo,
    MultiSelectInputProps,
} from './SelectInputTypes'

// Выбор одного или нескольких из вариантов.
// Список опций автоматически генерируется на основе props.options.
// Todo: добавить поиск по опциям.
export function MultiSelectInput<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = MultiSelectInputOptionExtras,
>(props: MultiSelectInputProps<OptionValueType, OptionExtrasType>) {

    const {
        options: propsOptions,
        disableOptions,
        selectedOptionsToString,
        values,
        className,
        wrapperClassName = 'mb-4',
        dropdownMenuClassName,
        stickSelectedOptionsToTop = false,
        onChange,
        nothingSelectedPlaceholder,
        renderOptionLabel,
        labelsContainHtml,
        search = false,
        searchPlaceholder,
        ...otherProps
    } = props

    // Конвертация дерева опций в плоский массив.
    const options: FlattenedOptionOrGroup<
        OptionValueType,
        OptionExtrasType,
        MultiSelectInputOptionsGroupInfo<OptionValueType>
    >[] = useMemo(
        () => flattenOptions<
            OptionValueType,
            OptionExtrasType,
            MultiSelectInputOptionsGroupInfo<OptionValueType>
        >(
            propsOptions,
            [],
            null,
            0,
            group => {
                if ((group.extra as MultiSelectInputOptionExtras | null)?.radios) {
                    return {
                        isRadios: true,
                        optionValues: group.options.map(
                            option => option.value
                        ),
                    }
                }
                return
            }
        ),
        [propsOptions]
    )

    // Собираем выбранные опции в виде массива значений.
    const selectedOptions = useMemo(
        (): FormSelectOptionsList<OptionValueType, OptionExtrasType> => {
            const ret = []
            if (Array.isArray(values) && values.length > 0) {
                // Значения заданы: ищем опции для них.
                for (const optionOrGroup of options) {
                    if (optionOrGroup.isGroup) {
                        continue
                    }
                    if (values.includes(optionOrGroup.data.value)) {
                        ret.push(optionOrGroup.data)
                    }
                }
            }
            return ret
        },
        [values, options]
    )

    // Подпись выбранной опции для отображения в поле ввода.
    const selectedValuesForTextInput = useMemo(
        (): string => {
            if (selectedOptions.length === 0) {
                return nothingSelectedPlaceholder ?? ''
            }

            if (selectedOptionsToString) {
                return selectedOptionsToString(selectedOptions)
            } else {
                return selectedOptions.map(
                    option => option.label || String(option.value)
                )
                    .join(', ')
            }
        },
        [
            selectedOptions,
            selectedOptionsToString,
            nothingSelectedPlaceholder,
        ]
    )

    // Выбор опции нажатием на неё мышью.
    const onSelect = useEventCallback((
        option: FormSelectOption<OptionValueType, OptionExtrasType>,
        _index: number,
        _groupIndex: number | null,
        isRadios: boolean,
        groupValues: OptionValueType[] | null
    ) => {
        const newSelectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType> = []
        const values: OptionValueType[] = []
        let unselected: boolean = false

        if (isRadios) {
            // Только одно значение в группе может быть выбрано.
            const unselectedValues = (groupValues ?? [])
                .filter(value => value !== option.value)
            for (const selectedOption of selectedOptions) {
                if (unselectedValues.includes(selectedOption.value)) {
                    // Опция входит в эту группу, но не выбрана: пропускаем.
                    continue
                }
                if (selectedOption.value === option.value) {
                    // Опция уже выбрана: отменяем выбор.
                    // Валидация через API, чтобы не усложнять.
                    unselected = true
                } else {
                    // Опция не входит в эту группу или была выбрана: добавляем.
                    values.push(selectedOption.value)
                    newSelectedOptions.push(selectedOption)
                }
            }
        } else {
            // Добавить или убрать значение из списка.
            for (const selectedOption of selectedOptions) {
                if (selectedOption.value === option.value) {
                    unselected = true
                } else {
                    values.push(selectedOption.value)
                    newSelectedOptions.push(selectedOption)
                }
            }
        }

        if (!unselected) {
            // Выбрано новое значение: добавляем в список.
            values.push(option.value)
            newSelectedOptions.push(option)
        }
        onChange(values, newSelectedOptions)
    })

    // Выбор опции с клавиатуры.
    const onSelectFromKeyboard = useEventCallback((
        optionIndex: number
    ) => {
        const option = options[optionIndex]
        if (option.isGroup) {
            return
        }
        onSelect(
            option.data,
            option.index,
            option.groupIndex,
            !!option.groupInfo?.isRadios,
            option.groupInfo?.optionValues ?? []
        )
    })

    // Обработка ситуации, когда значение из props.values отсутствует в списке options.
    useEffect(
        () => {
            if (
                !otherProps.disabled
                && !otherProps.readOnly
                // Разная длина списка опций.
                && selectedOptions.length !== (values?.length ?? 0)
            ) {
                // Ситуация, когда selectedOptions отличаются от props.values.
                // Это может произойти, если опция, соответствующая значению
                // props.values, была удалена из списка опций.
                // В этих случаях нужно вызвать onChange со значением selectedOptions.
                onChange(
                    selectedOptions.map(option => option.value),
                    selectedOptions
                )
            }
        },
        // Только при изменении списка опций, иначе будут незапланированные вызовы onChange.
        [options]
    )

    return (
        <SelectInputBase
            activeOnFocus={false}
            {...otherProps}
            value={selectedValuesForTextInput}
            selectOptionOnSpaceKey={true}
            wrapperClassName={clsx(
                'form-dropdown-multiselect',
                wrapperClassName
            )}
            className={clsx(
                'form-multiselect',
                search ? 'with-search' : null,
                selectedOptions.length === 0 && selectedValuesForTextInput.length > 0
                    ? 'empty-option-selected'
                    : null,
                selectedOptions.length === 0 && selectedValuesForTextInput.length === 0
                    ? 'empty-value'
                    : null,
                className
            )}
            dropdownMenuClassName={clsx(
                'form-multiselect-dropdown',
                dropdownMenuClassName,
                stickSelectedOptionsToTop ? 'stick-selected-options-to-top' : null
            )}
            onOptionSelect={onSelectFromKeyboard}
        >
            <MultiSelectInputOptions<OptionValueType, OptionExtrasType>
                options={options}
                selectedValues={values ?? []}
                search={search}
                keywordsRegexp={null}
                renderOptionLabel={renderOptionLabel}
                labelsContainHtml={labelsContainHtml}
                disableOptions={disableOptions}
                trackBehaviorAs={otherProps.trackBehaviorAs}
                onSelect={onSelect}
            />
        </SelectInputBase>
    )
}

/** @deprecated */
export default MultiSelectInput
