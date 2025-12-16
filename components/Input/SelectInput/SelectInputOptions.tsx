import {useCallback} from 'react'
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
    SelectInputOptionsProps,
} from './SelectInputTypes'

// Отрисовка списка опций для SelectInput.
export function SelectInputOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
>(props: SelectInputOptionsProps<OptionValueType, OptionExtrasType>) {

    const {
        api,
        options,
        selectedOption,
        maxHeight,
        hideEmptyOptionInDropdown,
        search,
        keywordsRegexp,
        labelsContainHtml,
        disableOptions,
        onChange,
        trackBehaviorAs,
        renderOptionLabel,
    } = props

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

    // Рекурсивная отрисовка опций.
    const renderOption = (
        option: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>,
        index: number
    ) => {
        if (option.isGroup) {
            // Группа опций.
            return (
                <SelectInputOptionsGroupHeader
                    key={'group-' + index}
                    group={option.data}
                    index={option.index}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelsContainHtml}
                />
            )
        } else {
            if (!shouldDisplaySelectInputOption(
                option.data.label,
                option.data.value,
                hideEmptyOptionInDropdown,
                search,
                keywordsRegexp,
                labelsContainHtml
            )) {
                return null
            }
            return (
                <SelectInputOption
                    key={'input-' + index}
                    api={api}
                    option={option.data}
                    index={option.index}
                    groupIndex={option.groupIndex}
                    isActive={selectedOption?.value === option.data.value}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelsContainHtml}
                    disabled={option.data.disabled ?? disableOptions?.includes(option.data.value)}
                    onSelect={onSelect}
                />
            )
        }
    }

    const content = (
        <>
            {options.map(renderOption)}
        </>
    )

    if (maxHeight && maxHeight > 0) {
        return (
            <div
                className="overflow-y-auto"
                style={{maxHeight}}
            >
                {content}
            </div>
        )
    } else {
        return content
    }
}
