import clsx from 'clsx'
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    ClipboardEvent,
    InputEvent,
    FocusEvent,
    KeyboardEvent,
    ChangeEvent,
    ReactNode,
} from 'react'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {UserBehaviorService} from '../../services/UserBehaviorService'
import {
    HtmlComponentProps,
    ReactComponentOrTagName,
} from '../../types'
import {
    InputProps,
    InputValidationErrorProps,
} from './InputTypes'
import {InputValidationError} from './InputValidationError'

const activeInputLabelSizeMultipliers = {
    normal: 0.9,
    small: 0.9,
    large: 0.9,
}

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
        labelClass,
        wrapperTag = 'div',
        wrapperClass = 'mb-4',
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
        grouped,
        active,
        activeInputLabelSizeMultiplier,
        isDropdownToggle,
        onBeforeInput,
        onKeyDown,
        onPaste,
        allowedChars,
        trackBehaviorAs,
        hidden,
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
        labelNotchWidth,
        setLabelNotchWidth,
    ] = useState<number | string>(0)
    const [
        isFocused,
        setFocused,
    ] = useState<boolean>(false)

    const wrapperIsValidationMessageContainer: boolean = (
        !withoutValidationMessage
        && (invalid !== undefined || !!validationMessage)
    )

    const wrapperClasses = clsx(
        isDropdownToggle ? null : 'form-outline',
        contrast ? 'form-white' : null,
        !wrapperIsValidationMessageContainer && grouped ? 'flex-1' : null,
        !wrapperIsValidationMessageContainer && typeof grouped === 'string'
            ? 'input-group-item ' + grouped
            : null,
        wrapperIsValidationMessageContainer ? null : wrapperClass
    )
    let size: 'normal' | 'small' | 'large' = 'normal'
    if (small && !large) {
        size = 'small'
    } else if (large && !small) {
        size = 'large'
    }
    let hasNotEmptyValue: boolean
    if (value === undefined) {
        // Не managed поле ввода.
        hasNotEmptyValue = (inputRef?.current?.value.length ?? 0) > 0
    } else {
        // Managed поле ввода.
        hasNotEmptyValue = (String(value ?? '').length ?? 0) > 0
    }
    const inputClassesCalculated = clsx(
        active || isFocused || hasNotEmptyValue ? 'active' : null,
        size === 'small' ? 'form-control-sm' : null,
        size === 'large' ? 'form-control-lg' : null,
        invalid ? 'is-invalid' : null
    )
    const inputClasses = clsx(
        'form-control',
        inputClassesCalculated,
        className
    )
    const labelClasses = clsx('form-label', labelClass)

    const updateWidth = useCallback(
        () => {
            if (label?.length) {
                if (labelRef.current && labelRef.current.clientWidth !== 0) {
                    let multiplier: number = activeInputLabelSizeMultipliers[size]
                    if (activeInputLabelSizeMultiplier && typeof activeInputLabelSizeMultiplier === 'object' && activeInputLabelSizeMultiplier[size]) {
                        multiplier = activeInputLabelSizeMultiplier[size]!
                    }
                    setLabelNotchWidth((labelRef.current.clientWidth * multiplier) + 8)
                } else if (labelNotchWidth === 0) {
                    setLabelNotchWidth('80%')
                    setTimeout(updateWidth, 500)
                }
            } else {
                setLabelNotchWidth(0)
            }
        },
        [
            label,
            labelRef.current?.clientWidth,
            activeInputLabelSizeMultiplier,
        ]
    )

    useEffect(updateWidth, [updateWidth])

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onChange?.(e)
        },
        [onChange]
    )

    const handlePaste = useCallback(
        (e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (trackBehaviorAs) {
                UserBehaviorService.onPaste()
            }
            onPaste?.(e)
            if (allowedChars && !e.isDefaultPrevented()) {
                e.preventDefault()
                input = e.currentTarget
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
        },
        [onPaste, trackBehaviorAs, allowedChars]
    )

    const handleBlur = useCallback(
        (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur()
            }
            setFocused(false)
            onBlur?.(e)
        },
        [value, onBlur, trackBehaviorAs]
    )

    const handleFocus = useCallback(
        (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (trackBehaviorAs) {
                UserBehaviorService.onFocus(e.currentTarget, trackBehaviorAs)
            }
            setFocused(true)
            updateWidth()
            onFocus?.(e)
        },
        [trackBehaviorAs, updateWidth, onFocus]
    )

    const handleOnBeforeInput = useCallback(
        (e: InputEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (allowedChars) {
                const char: string = e.data
                // Отменяем введенный символ, если он не разрешен
                if (!allowedChars.test(char)) {
                    e.preventDefault()
                    return
                }
            }
            onBeforeInput?.(e)
        },
        [onBeforeInput, allowedChars]
    )

    const handleOnKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (trackBehaviorAs) {
                UserBehaviorService.onKeyDown(e)
            }
            onKeyDown?.(e)
        },
        [trackBehaviorAs, onKeyDown]
    )

    const additionalWrapperProps: HtmlComponentProps<HTMLDivElement> & Partial<InputValidationErrorProps> = {}
    let WrapperTag: ReactComponentOrTagName = wrapperTag
    if (wrapperIsValidationMessageContainer) {
        if (WrapperTag !== 'div') {
            console.warn(
                'Input component with validationMessage prop or defined invalid prop uses InputValidationError wrapper and ignores wrapperTag prop',
                {props}
            )
        }
        WrapperTag = InputValidationError
        additionalWrapperProps.invalid = invalid ?? false
        additionalWrapperProps.error = validationMessage
        if (validationMessageClassName) {
            additionalWrapperProps.errorClassName = validationMessageClassName
        }
        additionalWrapperProps.inputContainerClassName = wrapperClasses
        additionalWrapperProps.className = clsx(
            grouped ? 'flex-1' : wrapperClass,
            typeof grouped === 'string' ? 'input-group-item ' + grouped : null
        )
    } else {
        additionalWrapperProps.className = wrapperClasses
    }

    let notch: null | ReactNode = (
        <div className="form-notch">
            <div className="form-notch-leading" />
            <div
                className="form-notch-middle"
                style={{width: labelNotchWidth}}
            />
            <div className="form-notch-trailing" />
        </div>
    )

    if (hidden) {
        return null
    }

    let input
    if (textarea) {
        input = (
            <div
                className={clsx(
                    'form-outline-textarea-wrapper p-0 form-control',
                    inputClassesCalculated,
                    isFocused ? 'focus' : null
                )}
            >
                <textarea
                    className={inputClasses}
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
                {notch}
            </div>
        )
        notch = null
    } else {
        input = (
            <input
                className={inputClasses}
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
        )
    }

    return (
        <WrapperTag
            style={{...wrapperStyle}}
            {...additionalWrapperProps}
            {...wrapperProps}
        >
            {input}
            {label && (
                <label
                    className={labelClasses}
                    style={labelStyle}
                    id={labelId}
                    htmlFor={id}
                    ref={mergedLabelRef}
                >
                    {label}
                </label>
            )}
            {notch}
            {children}
        </WrapperTag>
    )
}

/** @deprecated */
export default Input
