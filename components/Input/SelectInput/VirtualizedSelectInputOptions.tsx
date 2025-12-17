import {useCallback} from 'react'
import {useVirtuosoLibAsync} from '../../../helpers/useVirtuosoLibAsync'
import {UserBehaviorService} from '../../../services/UserBehaviorService'
import {
    AnyObject,
    FormSelectOption,
} from '../../../types'
import {shouldDisplaySelectInputOption} from '../helpers/shouldDisplaySelectInputOption'
import {SelectInputOption} from './SelectInputOption'
import {SelectInputOptionsGroupHeader} from './SelectInputOptionsGroupHeader'
import {
    FlattenedOptionOrGroup,
    VirtualizedSelectInputOptionsProps,
} from './SelectInputTypes'

// Отрисовка списка опций для SelectInput с виртуализацией.
export function VirtualizedSelectInputOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
>(props: VirtualizedSelectInputOptionsProps<OptionValueType, OptionExtrasType>) {

    const {
        options,
        selectedOption,
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
        ? options.filter(option => (
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
        : options

    const itemContent = (
        index: number,
        option: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>,
        selectedValue: OptionValueType | null
    ) => {
        if (option.isGroup) {
            return (
                <SelectInputOptionsGroupHeader
                    key={'group-' + index}
                    group={option.data}
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
                <SelectInputOption<OptionValueType, OptionExtrasType>
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
            className="dropdown-menu-scrollable"
        />
    )
}

/** @deprecated */
export default VirtualizedSelectInputOptions
