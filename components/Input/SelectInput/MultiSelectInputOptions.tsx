import {
    mdiCheckboxBlankCircleOutline,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarkedCircleOutline,
    mdiCheckboxMarkedOutline,
} from '@mdi/js'
import clsx from 'clsx'
import {AnyObject} from '../../../types'
import {DropdownMenuScrollableContainer} from '../../Dropdown/DropdownMenuScrollableContainer'
import {Icon} from '../../Icon/Icon'
import {MdiIconProps} from '../../Icon/MDIIcon'
import {SelectInputOption} from './SelectInputOption'
import {SelectInputOptionsGroupHeader} from './SelectInputOptionsGroupHeader'
import {
    FlattenedOptionOrGroup,
    MultiSelectInputOptionExtras,
    MultiSelectInputOptionsGroupInfo,
    MultiSelectInputOptionsProps,
} from './SelectInputTypes'

// Отрисовка списка опций для MultiSelectInput.
export function MultiSelectInputOptions<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = MultiSelectInputOptionExtras,
    GroupInfoType extends MultiSelectInputOptionsGroupInfo<
        OptionValueType
    > = MultiSelectInputOptionsGroupInfo<OptionValueType>,
>(props: MultiSelectInputOptionsProps<OptionValueType, OptionExtrasType, GroupInfoType>) {

    const {
        options,
        labelsContainHtml,
        renderOptionLabel,
        selectedValues,
        disableOptions,
        onSelect,
    } = props

    // Рекурсивная отрисовка опций.
    const renderOption = (
        option: FlattenedOptionOrGroup<
            OptionValueType,
            OptionExtrasType,
            MultiSelectInputOptionsGroupInfo<OptionValueType>
        >,
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
        }

        // Обычная опция.
        const {
            value,
            disabled: optionDisabled,
        } = option.data
        // noinspection PointlessBooleanExpressionJS
        const isRadioGroup: boolean = !!(option.groupInfo as MultiSelectInputOptionsGroupInfo | null)?.isRadios
        const selected = selectedValues.includes(value)
        let icon: string
        let iconColor: MdiIconProps['color']
        if (selected) {
            icon = isRadioGroup ? mdiCheckboxMarkedCircleOutline : mdiCheckboxMarkedOutline
            iconColor = 'blue'
        } else {
            icon = isRadioGroup ? mdiCheckboxBlankCircleOutline : mdiCheckboxBlankOutline
            iconColor = 'gray'
        }
        const disabled: boolean = (
            !!optionDisabled
            || !!disableOptions?.includes(value)
        )
        if (disabled) {
            iconColor = 'muted'
        }
        return (
            <SelectInputOption<OptionValueType, OptionExtrasType>
                key={'option-' + index}
                option={option.data}
                index={option.index}
                flatIndex={index}
                depth={option.depth}
                labelContainsHtml={labelsContainHtml}
                renderOptionLabel={renderOptionLabel}
                isActive={selected}
                onSelect={(
                    selectedOption,
                    index,
                    groupIndex
                ) => onSelect(
                    selectedOption,
                    index,
                    groupIndex,
                    isRadioGroup,
                    option.groupInfo?.optionValues ?? []
                )}
                className={clsx(
                    'form-multiselect-dropdown-option with-icon-flex',
                    disabled ? 'disabled' : null
                )}
                beforeLabel={
                    <Icon
                        path={icon}
                        color={iconColor}
                        className="me-1"
                    />
                }
            />
        )
    }

    return (
        <DropdownMenuScrollableContainer>
            {options.map(renderOption)}
        </DropdownMenuScrollableContainer>
    )
}
