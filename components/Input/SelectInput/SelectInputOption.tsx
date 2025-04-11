import React from 'react'
import {AnyObject, FormSelectOption} from '../../../types/Common'
import {SelectInputProps} from './SelectInput'
import {DropdownItem} from '../../../components/Dropdown2/DropdownItem'
import clsx from 'clsx'
import SelectInputOptionLabel from '../../../components/Input/SelectInput/SelectInputOptionLabel'

export interface SelectInputOptionProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> {
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
            href={undefined}
            active={false}
            data-value={String(value)}
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
        </DropdownItem>
    )
}
