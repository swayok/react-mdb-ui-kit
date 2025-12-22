import {useRef} from 'react'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {TooltipProps} from '../Tooltip/TooltipTypes'
import {InputLabel} from './InputLabel'
import {InputLayoutComponentProps} from './InputTypes'
import {InputUi} from './InputUi'
import {InputWrapper} from './InputWrapper'

// Макет для поля ввода значения.
// Поле ввода или заменитель передается через children.
export function InputLayout(props: InputLayoutComponentProps) {
    const {
        inputId,
        label,
        labelId,
        labelClassName,
        contrast,
        grouped,
        wrapperClassName = grouped ? '' : 'mb-4',
        wrapperStyle,
        wrapperProps,
        children,
        labelRef: propsLabelRef,
        labelStyle,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        invalid,
        activeInputLabelSizeMultiplier,
        hidden,
        size = 'normal',
        UiComponent = InputUi,
        LabelComponent = InputLabel,
        WrapperComponent = InputWrapper,
        addon,
        // Tooltip:
        title,
        tooltipPlacement,
        tooltipMaxWidth,
        tooltipOffset,
        tooltipTextClassName,
        tooltipDisableClickHandler,
        tooltipDisableHover,
    } = props

    const labelRef = useRef<HTMLLabelElement>(null)

    const mergedLabelRef = useMergedRefs(
        propsLabelRef,
        labelRef
    )

    if (hidden) {
        return null
    }

    const tooltipProps: TooltipProps = {
        title,
        tooltipPlacement,
        tooltipOffset,
        tooltipMaxWidth,
        tooltipTextClassName,
        tooltipDisableClickHandler,
        tooltipDisableHover,
    }

    return (
        <WrapperComponent
            className={wrapperClassName}
            style={wrapperStyle}
            invalid={invalid}
            validationMessage={validationMessage}
            validationMessageClassName={validationMessageClassName}
            withoutValidationMessage={withoutValidationMessage}
            contrast={contrast}
            grouped={grouped}
            {...wrapperProps}
            {...tooltipProps}
        >
            {children}
            {LabelComponent && (
                <LabelComponent
                    ref={mergedLabelRef}
                    label={label}
                    className={labelClassName}
                    style={labelStyle}
                    id={labelId}
                    inputId={inputId}
                    invalid={invalid}
                />
            )}
            {UiComponent && (
                <UiComponent
                    labelRef={labelRef}
                    size={size}
                    activeInputLabelSizeMultiplier={activeInputLabelSizeMultiplier}
                    invalid={invalid}
                />
            )}
            {addon}
        </WrapperComponent>
    )
}
