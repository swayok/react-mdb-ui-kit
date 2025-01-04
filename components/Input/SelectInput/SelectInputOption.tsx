import React from 'react'
import {AnyObject, FormSelectOption} from '../../../types/Common'
import {SelectInputProps} from './SelectInput'
import DropdownItem from '../../../components/Dropdown/DropdownItem'
import DropdownLink from '../../../components/Dropdown/DropdownLink'
import clsx from 'clsx'
import SelectInputOptionLabel from '../../../components/Input/SelectInput/SelectInputOptionLabel'

export type SelectInputOptionProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> = {
    visible?: boolean;
    option: FormSelectOption<OptionValueType, OptionExtrasType>;
    index: number;
    groupIndex?: number | null;
    isActive?: boolean;
    disabled?: boolean;
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel'];
    labelContainsHtml?: boolean;
    onSelect: (
        option: FormSelectOption<OptionValueType, OptionExtrasType>,
        index: number,
        groupIndex: number | null
    ) => void;
}

// Отображение одной опции в выпадающем меню.
export default function SelectInputOption<
    OptionValueType = string,
    OptionExtrasType = AnyObject
>(props: SelectInputOptionProps<OptionValueType, OptionExtrasType>) {

    const {
        option,
        isActive = true,
        index,
        groupIndex = null,
        renderOptionLabel,
        labelContainsHtml,
        visible = true,
        disabled = false,
        onSelect,
    } = props

    const {
        value,
        attributes,
    } = option

    if (!visible) {
        return null
    }

    const isEmptyOption = value === null || value === ''

    return (
        <DropdownItem
            {...attributes}
            highlightable={false}
            active={false}
            data-value={String(value)}
        >
            <DropdownLink
                tag="div"
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    onSelect(option, index, groupIndex)
                }}
                className={clsx(
                    'cursor',
                    isEmptyOption ? 'empty-option' : null,
                    isActive ? 'active' : null,
                    disabled ? 'disabled' : null,
                    attributes?.className
                )}
            >
                <SelectInputOptionLabel
                    option={option}
                    labelContainsHtml={labelContainsHtml}
                    renderOptionLabel={renderOptionLabel}
                />
            </DropdownLink>
        </DropdownItem>
    )
}
