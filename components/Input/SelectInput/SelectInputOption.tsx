import clsx from 'clsx'
import {MouseEvent} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {AnyObject} from '../../../types'
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

    const onClick = useEventCallback((e: MouseEvent) => {
        e.preventDefault()
        onSelect(option, index, groupIndex)
    })

    return (
        <DropdownItem
            {...attributes}
            onClick={onClick}
            href={undefined}
            active={isActive}
            disabled={disabled}
            data-value={String(value)}
            tag="div"
            className={clsx(
                'cursor',
                isEmptyOption ? 'empty-option' : null,
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
