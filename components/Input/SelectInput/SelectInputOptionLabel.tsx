import React from 'react'
import {AnyObject, FormSelectOptionOrGroup} from '../../../types/Common'
import HtmlContent from '../../../components/HtmlContent'
import {SelectInputProps} from './SelectInput'

export type SelectInputOptionLabelProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> = {
    option: FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>;
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel'];
    labelContainsHtml?: boolean;
}

// Подпись для опции или группы опций в выпадающем меню.
export default function SelectInputOptionLabel<
    OptionValueType = string,
    OptionExtrasType = AnyObject
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
