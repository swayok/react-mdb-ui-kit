import clsx from 'clsx'
import type {AnyObject} from '../../../types'
import {DropdownHeader} from '../../Dropdown/DropdownHeader'
import {SelectInputOptionLabel} from './SelectInputOptionLabel'
import type {SelectInputOptionsGroupHeaderProps} from './SelectInputTypes'

// Отображение заголовка группы опций в выпадающем меню.
export function SelectInputOptionsGroupHeader<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
>(props: SelectInputOptionsGroupHeaderProps<OptionValueType, OptionExtrasType>) {

    const {
        group,
        index,
        depth,
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
            className={clsx(
                'form-dropdown-select-group-header',
                'item-offset-' + depth,
                className as string
            )}
        >
            <SelectInputOptionLabel
                option={group}
                renderOptionLabel={renderOptionLabel}
                labelContainsHtml={labelContainsHtml}
            />
        </DropdownHeader>
    )
}
