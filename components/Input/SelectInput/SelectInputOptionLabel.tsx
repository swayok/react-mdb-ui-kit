import {AnyObject} from '../../../types'
import {HtmlContent} from '../../HtmlContent'
import {SelectInputOptionLabelProps} from './SelectInputTypes'

// Подпись для опции или группы опций в выпадающем меню.
export function SelectInputOptionLabel<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
>(props: SelectInputOptionLabelProps<OptionValueType, OptionExtrasType>) {

    const {
        option,
        renderOptionLabel,
        labelContainsHtml = false,
    } = props

    if (renderOptionLabel && typeof renderOptionLabel === 'function') {
        return renderOptionLabel(option, false)
    }

    const label: string = option.label || String(option.value)
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

/** @deprecated */
export default SelectInputOptionLabel
