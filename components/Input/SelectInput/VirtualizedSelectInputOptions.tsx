import {
    useCallback,
    useMemo,
} from 'react'
import {useVirtuosoLibAsync} from '../../../helpers/useVirtuosoLibAsync'
import {UserBehaviorService} from '../../../services/UserBehaviorService'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
} from '../../../types'
import {flattenOptions} from '../helpers/flattenOptions'
import {SelectInputOption} from './SelectInputOption'
import {SelectInputOptionsGroupHeader} from './SelectInputOptionsGroupHeader'
import {
    FlattenedOptionOrGroup,
    VirtualizedSelectInputOptionsProps,
} from './SelectInputTypes'
import {shouldDisplaySelectInputOption} from '../helpers/shouldDisplaySelectInputOption'

// Отрисовка списка опций для SelectInput с виртуализацией.
export function VirtualizedSelectInputOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
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

    const virtuoso = useVirtuosoLibAsync<
        FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>,
        OptionValueType | null
    >()

    // Конвертация дерева опций в плоский массив.
    const flatOptions: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[] = useMemo(
        () => {
            const initial: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[] = []
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

    const data: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[] = search && keywordsRegexp
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

    const itemContent = (
        index: number,
        option: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>,
        selectedValue: OptionValueType | null
    ) => {
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
                    isActive={selectedValue === option.data.value}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelsContainHtml}
                    disabled={(
                        !!option.data.disabled
                        || disableOptions?.includes(option.data.value)
                    )}
                    onSelect={onSelect}
                />
            )
        }
        return null
    }

    return (
        <virtuoso.Virtuoso
            data={data}
            style={{
                height,
            }}
            context={selectedOption?.value ?? null}
            itemContent={itemContent}
        />
    )
}

/** @deprecated */
export default VirtualizedSelectInputOptions
