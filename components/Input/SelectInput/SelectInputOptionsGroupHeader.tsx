import clsx from 'clsx'
import React from 'react'
import {AnyObject} from '../../../types'
import {DropdownHeader} from '../../Dropdown/DropdownHeader'
import {SelectInputOptionLabel} from './SelectInputOptionLabel'
import {SelectInputOptionsGroupHeaderProps} from './SelectInputTypes'

// Отображение заголовка группы опций в выпадающем меню.
export function SelectInputOptionsGroupHeader<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
>(props: SelectInputOptionsGroupHeaderProps<OptionValueType, OptionExtrasType>) {

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
    } = (group.groupHeaderAttributes ?? {})

    if (!visible) {
        return null
    }

    return (
        <DropdownHeader
            key={'group-' + index}
            {...groupHeaderAttributes}
            className={clsx('form-dropdown-select-group-header', className as string)}
        >
            <SelectInputOptionLabel
                option={group}
                renderOptionLabel={renderOptionLabel}
                labelContainsHtml={labelContainsHtml}
            />
        </DropdownHeader>
    )
}

/** @deprecated */
export default SelectInputOptionsGroupHeader
