import {
    ChangeEvent,
    ClipboardEvent,
    FocusEvent,
    InputEvent,
    KeyboardEvent,
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {UserBehaviorService} from '../../services/UserBehaviorService'
import {TooltipProps} from '../Tooltip/TooltipTypes'
import {getInputClassName} from './helpers/getInputClassName'
import {getInputSize} from './helpers/getInputSize'
import {InputLabel} from './InputLabel'
import {
    InputProps,
    InputSize,
} from './InputTypes'
import {InputUi} from './InputUi'
import {InputWrapper} from './InputWrapper'

// Поле ввода значения.
export function Input(props: InputProps) {
    const {
        className,
        small,
        large,
        contrast,
        value,
        id,
        label,
        labelId,
        labelClassName,
        grouped,
        wrapperClassName = grouped ? '' : 'mb-4',
        wrapperStyle,
        wrapperProps,
        onChange,
        children,
        labelRef: propsLabelRef,
        labelStyle,
        inputRef: propsInputRef,
        textarea,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        invalid,
        onBlur,
        onFocus,
        active,
        activeOnFocus = !props.readOnly && !props.disabled,
        activeInputLabelSizeMultiplier,
        onBeforeInput,
        onKeyDown,
        onPaste,
        allowedChars,
        trackBehaviorAs,
        hidden,
        UiComponent = InputUi,
        LabelComponent = InputLabel,
        WrapperComponent = InputWrapper,
        // Tooltip:
        title,
        tooltipPlacement,
        tooltipMaxWidth,
        tooltipOffset,
        tooltipTextClassName,
        tooltipDisableClickHandler,
        tooltipDisableHover,
        ...otherProps
    } = props

    const labelRef = useRef<HTMLLabelElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const mergedLabelRef = useMergedRefs(
        propsLabelRef,
        labelRef
    )
    const mergedInputRef = useMergedRefs(
        propsInputRef,
        inputRef
    )

    const [
        isFocused,
        setFocused,
    ] = useState<boolean>(false)

    const handleChange = useEventCallback((
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange?.(e)
    })

    const handlePaste = useEventCallback((
        e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onPaste()
        }
        onPaste?.(e)
        if (allowedChars && !e.isDefaultPrevented()) {
            e.preventDefault()
            const input = e.currentTarget
            const pastedText = e.clipboardData.getData('text')
            if (!pastedText || pastedText === '') {
                return
            }
            let cleanPastedText: string = ''
            for (const char of pastedText) {
                if (allowedChars.test(char)) {
                    cleanPastedText += char
                }
            }
            e.clipboardData.setData('text', cleanPastedText)
            input.value = input.value.substring(0, input.selectionStart ?? 0)
                + cleanPastedText
                + input.value.substring(input.selectionEnd ?? 0)
            // @ts-ignore
            handleChange(e)
        }
    })

    const handleBlur = useEventCallback((
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onBlur()
        }
        setFocused(false)
        onBlur?.(e)
    })

    const handleFocus = useEventCallback((
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onFocus(e.currentTarget, trackBehaviorAs)
        }
        setFocused(true)
        onFocus?.(e)
    })

    const handleOnBeforeInput = useEventCallback((
        e: InputEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (allowedChars) {
            const char: string = e.data
            // Отменяем введенный символ, если он не разрешен
            if (!allowedChars.test(char)) {
                e.preventDefault()
                return
            }
        }
        onBeforeInput?.(e)
    })

    const handleOnKeyDown = useEventCallback((
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onKeyDown(e)
        }
        onKeyDown?.(e)
    })

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

    let hasNotEmptyValue: boolean
    if (value === undefined) {
        // Не managed поле ввода.
        hasNotEmptyValue = (inputRef?.current?.value.length ?? 0) > 0
    } else {
        // Managed поле ввода.
        hasNotEmptyValue = (String(value ?? '').length ?? 0) > 0
    }
    const size: InputSize = getInputSize(small, large)

    const InputTag = textarea ? 'textarea' : 'input'

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
            <InputTag
                className={getInputClassName({
                    size,
                    active,
                    isFocused,
                    hasNotEmptyValue,
                    activeOnFocus,
                    invalid,
                    textarea,
                    className,
                })}
                onBlur={handleBlur}
                onChange={handleChange}
                onPaste={handlePaste}
                onFocus={handleFocus}
                onBeforeInput={handleOnBeforeInput}
                onKeyDown={handleOnKeyDown}
                value={value}
                id={id}
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                ref={mergedInputRef as any}
                {...otherProps}
            />
            <LabelComponent
                ref={mergedLabelRef}
                label={label}
                className={labelClassName}
                style={labelStyle}
                id={labelId}
                inputId={id}
                invalid={invalid}
            />
            <UiComponent
                labelRef={labelRef}
                size={size}
                activeInputLabelSizeMultiplier={activeInputLabelSizeMultiplier}
                invalid={invalid}
            />
            {children}
        </WrapperComponent>
    )
}
