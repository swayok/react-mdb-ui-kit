import React from 'react'
import {AnyObject, FormSelectOptionGroup} from '../../../types/Common'
import {SelectInputProps} from './SelectInput'
import DropdownItem from '../../../components/Dropdown/DropdownItem'
import clsx from 'clsx'
import SelectInputOptionLabel from '../../../components/Input/SelectInput/SelectInputOptionLabel'
import DropdownHeader from '../../../components/Dropdown/DropdownHeader'

export type SelectInputOptionProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> = {
    visible?: boolean;
    group: FormSelectOptionGroup<OptionValueType, OptionExtrasType>;
    index: number;
    isActive?: boolean;
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel'];
    labelContainsHtml?: boolean;
}

// Отображение заголовка группы опций в выпадающем меню.
export default function SelectInputOptionsGroupHeader<
    OptionValueType = string,
    OptionExtrasType = AnyObject
>(props: SelectInputOptionProps<OptionValueType, OptionExtrasType>) {

    const {
        group,
        index,
        renderOptionLabel,
        labelContainsHtml,
        visible = true,
    } = props

    const {
        className,
        ...groupHeaderAttributes
    } = (group.groupHeaderAttributes || {})

    if (!visible) {
        return null
    }

    return (
        <DropdownItem
            key={'group-' + index}
            {...groupHeaderAttributes}
            className={clsx('form-dropdown-select-group-header', className)}
            highlightable={false}
        >
            <DropdownHeader>
                <SelectInputOptionLabel
                    option={group}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelContainsHtml}
                />
            </DropdownHeader>
        </DropdownItem>
    )
}
