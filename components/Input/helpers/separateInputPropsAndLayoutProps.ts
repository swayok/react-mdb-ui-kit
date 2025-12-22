/* eslint-disable @typescript-eslint/no-explicit-any */
import {HtmlComponentProps} from '../../../types'
import {InputLayoutProps} from '../InputTypes'

// Разделить свойства компонента InputLayout и свойства поля ввода.
export function separateInputPropsAndLayoutProps<
    InputPropsType extends InputLayoutProps = InputLayoutProps & HtmlComponentProps<any>,
>(props: InputPropsType): {
    layoutProps: InputLayoutProps
    inputProps: Omit<InputPropsType, keyof InputLayoutProps>
} {
    const {
        label,
        labelId,
        labelClassName,
        contrast,
        grouped,
        wrapperClassName,
        wrapperStyle,
        wrapperProps,
        labelRef,
        labelStyle,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        invalid,
        activeInputLabelSizeMultiplier,
        hidden,
        UiComponent,
        LabelComponent,
        WrapperComponent,
        // Tooltip:
        title,
        tooltipPlacement,
        tooltipMaxWidth,
        tooltipOffset,
        tooltipTextClassName,
        tooltipDisableClickHandler,
        tooltipDisableHover,

        ...inputProps
    } = props

    return {
        inputProps,
        layoutProps: {
            label,
            labelId,
            labelClassName,
            contrast,
            grouped,
            wrapperClassName,
            wrapperStyle,
            wrapperProps,
            labelRef,
            labelStyle,
            validationMessage,
            validationMessageClassName,
            withoutValidationMessage,
            invalid,
            activeInputLabelSizeMultiplier,
            hidden,
            UiComponent,
            LabelComponent,
            WrapperComponent,
            // Tooltip:
            title,
            tooltipPlacement,
            tooltipMaxWidth,
            tooltipOffset,
            tooltipTextClassName,
            tooltipDisableClickHandler,
            tooltipDisableHover,
        },
    }
}
