import {useEventCallback} from '../../../helpers/useEventCallback'
import {UserBehaviorService} from '../../../services/UserBehaviorService'
import {
    AnyObject,
    FormSelectOption,
} from '../../../types'
import {DropdownMenuScrollableContainer} from '../../Dropdown/DropdownMenuScrollableContainer'
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
    OptionExtrasType extends AnyObject = AnyObject,
>(props: SelectInputOptionsProps<OptionValueType, OptionExtrasType>) {

    const {
        options,
        selectedOption,
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
    const onSelect = useEventCallback(
        (
            option: FormSelectOption<OptionValueType, OptionExtrasType>,
            index: number,
            groupIndex: number | null
        ) => {
            onChange(option.value, option.label, index, groupIndex, option.extra)
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(String(option.value))
            }
        }
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
                    depth={option.depth}
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
                    option={option.data}
                    flatIndex={index}
                    index={option.index}
                    groupIndex={option.groupIndex}
                    depth={option.depth}
                    isActive={selectedOption?.value === option.data.value}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelsContainHtml}
                    disabled={option.data.disabled ?? disableOptions?.includes(option.data.value)}
                    onSelect={onSelect}
                />
            )
        }
    }

    return (
        <DropdownMenuScrollableContainer>
            {options.map(renderOption)}
        </DropdownMenuScrollableContainer>
    )
}
