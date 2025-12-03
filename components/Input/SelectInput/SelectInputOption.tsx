import clsx from 'clsx'
import React from 'react'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {DropdownItem} from '../../Dropdown/DropdownItem'
import {SelectInputOptionLabel} from './SelectInputOptionLabel'
import {SelectInputOptionProps} from './SelectInputTypes'

// Отображение одной опции в выпадающем меню.
export function SelectInputOption<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
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
                attributes?.className as string
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

/** @deprecated */
export default SelectInputOption
