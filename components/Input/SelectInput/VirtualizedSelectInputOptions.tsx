import React, {useCallback, useMemo} from 'react'
import {AnyObject, FormSelectOption, FormSelectOptionGroup, FormSelectOptionsAndGroupsList} from 'swayok-react-mdb-ui-kit/types/Common'
import {SelectInputProps} from './SelectInput'
import withStable from '../../../helpers/withStable'
import SelectInputOption from '../../../components/Input/SelectInput/SelectInputOption'
import SelectInputOptionsGroupHeader from '../../../components/Input/SelectInput/SelectInputOptionsGroupHeader'
import shouldDisplaySelectInputOption from '../../../components/Input/SelectInput/shouldDisplaySelectInputOption'
import useVirtuosoLibAsync from '../../../helpers/useVirtuosoLibAsync'
import {UserBehaviorService} from '../../../services/UserBehaviorService'

export interface VirtualizedSelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> extends Pick<
    SelectInputProps<OptionValueType, OptionExtrasType>,
    'options' | 'withEmptyOption'  | 'withPermanentOption' | 'hideEmptyOptionInDropdown' | 'search'
    | 'renderOptionLabel' | 'labelsContainHtml' | 'disableOptions'
    | 'onChange' | 'trackBehaviorAs'
> {
    selectedOption?: FormSelectOption<OptionValueType, OptionExtrasType>;
    keywordsRegexp: RegExp | null;
    height: number;
}

interface Option<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> {
    isGroup: false;
    data: FormSelectOption<OptionValueType, OptionExtrasType>;
    groupIndex: number | null;
}

interface OptionsGroup<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> {
    isGroup: true;
    data: Omit<FormSelectOptionGroup<OptionValueType, OptionExtrasType>, 'options'>;
}

type OptionOrGroup<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> = Option<OptionValueType, OptionExtrasType> | OptionsGroup<OptionValueType, OptionExtrasType>

// Отрисовка списка опций для SelectInput с виртуализацией.
function VirtualizedSelectInputOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject
>(props: VirtualizedSelectInputOptionsProps<OptionValueType, OptionExtrasType>) {

    const {
        options,
        selectedOption,
        withEmptyOption,
        withPermanentOption,
        height,
        hideEmptyOptionInDropdown,
        search,
        keywordsRegexp,
        labelsContainHtml,
        disableOptions,
        onChange,
        trackBehaviorAs,
        renderOptionLabel,
    } = props

    const virtuoso = useVirtuosoLibAsync()

    // Конвертация дерева опций в плоский массив.
    const flatOptions: OptionOrGroup<OptionValueType, OptionExtrasType>[] = useMemo(
        () => {
            const initial: OptionOrGroup<OptionValueType, OptionExtrasType>[] = []
            if (withEmptyOption && !hideEmptyOptionInDropdown) {
                initial.push({
                    isGroup: false,
                    data: withEmptyOption,
                    groupIndex: null,
                })
            }
            const ret = flattenOptions<OptionValueType, OptionExtrasType>(options, initial)
            if (withPermanentOption) {
                ret.push({
                    isGroup: false,
                    data: withPermanentOption,
                    groupIndex: null,
                })
            }
            return ret
        },
        [
            options,
            withEmptyOption?.label,
            withEmptyOption?.value,
            withPermanentOption?.label,
            withPermanentOption?.value,
        ]
    )

    // Обработчик выбора опции.
    const onSelect = useCallback(
        (
            option: FormSelectOption<OptionValueType, OptionExtrasType>,
            index: number,
            groupIndex: number | null
        ) => {
            onChange(option.value, option.label, index, groupIndex, option.extra)
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(String(option.value))
            }
        },
        [onChange, trackBehaviorAs]
    )

    return (
        <virtuoso.Virtuoso
            data={
                search && keywordsRegexp
                    ? flatOptions.filter(option => (
                        option.isGroup
                        || shouldDisplaySelectInputOption(
                            option.data.label,
                            option.data.value,
                            hideEmptyOptionInDropdown,
                            search,
                            keywordsRegexp,
                            labelsContainHtml
                        )
                    ))
                    : flatOptions
            }
            style={{
                height,
            }}
            context={selectedOption?.value ?? null}
            itemContent={(index, option, context) => {
                if (option.isGroup) {
                    return (
                        <SelectInputOptionsGroupHeader
                            key={'group-' + index}
                            group={option.data as FormSelectOptionGroup<OptionValueType, OptionExtrasType>}
                            index={index}
                            renderOptionLabel={renderOptionLabel}
                            labelContainsHtml={labelsContainHtml}
                        />
                    )
                } else if (shouldDisplaySelectInputOption(
                    option.data.label,
                    option.data.value,
                    hideEmptyOptionInDropdown,
                    search,
                    keywordsRegexp,
                    labelsContainHtml
                )) {
                    return (
                        <SelectInputOption
                            key={'option-' + index}
                            option={option.data}
                            index={index}
                            groupIndex={option.groupIndex}
                            isActive={context === option.data.value}
                            renderOptionLabel={renderOptionLabel}
                            labelContainsHtml={labelsContainHtml}
                            disabled={!!option.data.disabled || disableOptions?.includes(option.data.value)}
                            onSelect={onSelect}
                        />
                    )
                }
                return null
            }}
        />
    )
}

export default withStable<VirtualizedSelectInputOptionsProps>(
    ['onChange', 'renderOptionLabel'],
    VirtualizedSelectInputOptions
) as typeof VirtualizedSelectInputOptions

// Преобразование многомерного списка опций в плоский массив.
function flattenOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject
>(
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>,
    // Ожидается, что flat передается как "ссылка" на массив.
    // Т.е. в flattenOptions производится модификация этого массива, не создавая новые.
    flat: OptionOrGroup<OptionValueType, OptionExtrasType>[],
    groupIndex: number | null = null
): OptionOrGroup<OptionValueType, OptionExtrasType>[] {
    for (let i = 0; i < options.length; i++) {
        if ('options' in options[i]) {
            const {
                options: nestedOptions,
                ...groupOption
            } = options[i]
            flat.push({
                isGroup: true,
                data: groupOption,
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
                groupIndex,
            })
        }
    }
    return flat
}
