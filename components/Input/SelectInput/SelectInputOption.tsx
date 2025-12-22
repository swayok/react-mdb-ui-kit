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
    OptionExtrasType extends AnyObject = AnyObject,
>(props: SelectInputOptionProps<OptionValueType, OptionExtrasType>) {

    const {
        option,
        isActive = true,
        index,
        groupIndex = null,
        flatIndex,
        depth,
        renderOptionLabel,
        labelContainsHtml,
        visible = true,
        disabled = false,
        className,
        onSelect,
        beforeLabel,
        afterLabel,
    } = props

    const {
        value,
        attributes: optionProps,
    } = option

    if (!visible) {
        return null
    }

    const isEmptyOption = value === null || value === ''

    const onClick = useEventCallback((e: MouseEvent) => {
        e.preventDefault()
        if (!disabled) {
            onSelect(option, index, groupIndex)
        }
    })

    return (
        <DropdownItem
            {...optionProps}
            onClick={onClick}
            href={undefined}
            active={isActive}
            disabled={disabled}
            data-value={String(value)}
            data-flat-index={flatIndex}
            tag="div"
            className={clsx(
                'cursor',
                'item-offset-' + depth,
                isEmptyOption ? 'empty-option' : null,
                className,
                optionProps?.className as string
            )}
        >
            {beforeLabel}
            <SelectInputOptionLabel
                option={option}
                labelContainsHtml={labelContainsHtml}
                renderOptionLabel={renderOptionLabel}
            />
            {afterLabel}
        </DropdownItem>
    )
}
