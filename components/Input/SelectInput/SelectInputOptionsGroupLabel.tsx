import type {AnyObject} from '../../../types'
import {HtmlContent} from '../../Typography/HtmlContent'
import type {
    SelectInputOptionsGroupLabelProps,
} from './SelectInputTypes'

// Подпись для группы опций в выпадающем меню.
export function SelectInputOptionsGroupLabel<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
>(props: SelectInputOptionsGroupLabelProps<OptionValueType, OptionExtrasType>) {

    const {
        group,
        renderOptionsGroupLabel,
        labelContainsHtml = false,
    } = props

    if (renderOptionsGroupLabel && typeof renderOptionsGroupLabel === 'function') {
        return renderOptionsGroupLabel(group)
    }

    const label: string = group.label || String(group.value)
    if (labelContainsHtml) {
        return (
            <HtmlContent
                block
                html={label}
            />
        )
    }
    return label
}
