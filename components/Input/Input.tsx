import clsx from 'clsx'
import React, {AllHTMLAttributes, useCallback, useEffect, useRef, useState} from 'react'
import InputValidationError, {InputValidationErrorProps} from './InputValidationError'
import {ReactComponentOrTagName} from '../../types/Common'
import withStable from '../../helpers/withStable'
import {TooltipProps} from '../Tooltip'
import UserBehaviorService from '../../services/UserBehaviorService'

const activeInputLabelSizeMultipliers = {
    normal: 0.9,
    small: 0.9,
    large: 0.9,
}

export interface InputProps extends AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    textarea?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
    label?: string;
    labelId?: string;
    labelClass?: string;
    labelStyle?: React.CSSProperties;
    labelRef?: React.RefObject<HTMLLabelElement>;
    // Мультипликаторы размера label в активном состоянии.
    activeInputLabelSizeMultiplier?: number | {
        normal?: number,
        small?: number,
        large?: number
    };
    wrapperTag?: ReactComponentOrTagName;
    wrapperProps?: AllHTMLAttributes<HTMLElement> | TooltipProps;
    wrapperClass?: string;
    wrapperStyle?: React.CSSProperties;
    value?: string;
    disabled?: boolean;
    small?: boolean;
    large?: boolean;
    contrast?: boolean;
    // Настройки валидности введенных данных.
    invalid?: boolean;
    validationMessage?: string | null;
    validationMessageClassName?: string;
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean;
    // Указать true, если label должен быть как будто поле ввода в активном состоянии.
    active?: boolean;
    // Указать true, если поле ввода внутри <InputGroup> и должно занимать всё свободное пространство.
    grouped?: boolean | 'first' | 'center' | 'last';
    // Указать true, если поле ввода используется в качестве <DropdownToggle>.
    isDropdownToggle?: boolean;
    // Регулярное выражение для фильтрации вводимых символов.
    allowedChars?: RegExp;
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string;
}

// Поле ввода значения.
function Input(props: InputProps) {
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
        wrapperTag,
        wrapperClass = 'mb-4',
        wrapperStyle,
        wrapperProps,
        onChange,
        children,
        labelRef,
        labelStyle,
        inputRef,
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
        ...otherProps
    } = props

    const labelEl = useRef<HTMLLabelElement>(null)
    const inputEl = useRef<HTMLInputElement>(null)
    const textareaEl = useRef<HTMLTextAreaElement>(null)

    const labelReference = labelRef ? labelRef : labelEl
    const inputReference = inputRef ? inputRef : (textarea ? textareaEl : inputEl)

    const [labelNotchWidth, setLabelNotchWidth] = useState<number | string>(0)
    const [isFocused, setFocused] = useState<boolean>(false)

    const wrapperIsValidationMessageContainer: boolean = (
        !withoutValidationMessage
        && (invalid !== undefined || !!validationMessage)
    )

    const wrapperClasses = clsx(
        isDropdownToggle ? null : 'form-outline',
        contrast ? 'form-white' : null,
        !wrapperIsValidationMessageContainer && grouped ? 'flex-1' : null,
        !wrapperIsValidationMessageContainer && typeof grouped === 'string' ? 'input-group-item ' + grouped : null,
        wrapperIsValidationMessageContainer ? null : wrapperClass
    )
    let size: 'normal' | 'small' | 'large' = 'normal'
    if (small && !large) {
        size = 'small'
    } else if (large && !small) {
        size = 'large'
    }
    const hasNotEmptyValue: boolean = (String(value || '').length || 0) > 0
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
            if (label && label.length) {
                if (labelReference.current && labelReference.current.clientWidth !== 0) {
                    let multiplier: number = activeInputLabelSizeMultipliers[size]
                    if (activeInputLabelSizeMultiplier && typeof activeInputLabelSizeMultiplier === 'object' && activeInputLabelSizeMultiplier[size]) {
                        multiplier = activeInputLabelSizeMultiplier[size] as number
                    }
                    setLabelNotchWidth(labelReference.current.clientWidth * multiplier + 8)
                } else if (labelNotchWidth === 0) {
                    setLabelNotchWidth('80%')
                    setTimeout(updateWidth, 500)
                }
            }
        },
        [
            label,
            labelReference.current,
            labelReference.current?.clientWidth,
            activeInputLabelSizeMultiplier,
        ]
    )

    useEffect(updateWidth, [updateWidth])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onChange?.(e)
        },
        [onChange]
    )

    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                for (let i = 0; i < pastedText.length; i++) {
                    if (allowedChars.test(pastedText[i])) {
                        cleanPastedText += pastedText[i]
                    }
                }
                e.clipboardData.setData('text', cleanPastedText)
                input.value = input.value.substring(0, input.selectionStart || 0)
                    + cleanPastedText
                    + input.value.substring(input.selectionEnd || 0)
                // @ts-ignore
                handleChange(e)
            }
        },
        [onPaste, trackBehaviorAs, allowedChars]
    )

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur()
            }
            setFocused(false)
            onBlur?.(e)
        },
        [value, onBlur, trackBehaviorAs]
    )

    const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (allowedChars) {
                const char = (e as React.CompositionEvent<HTMLInputElement>).data
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
        (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (trackBehaviorAs) {
                UserBehaviorService.onKeyDown(e)
            }
            onKeyDown?.(e)
        },
        [trackBehaviorAs, onKeyDown]
    )

    const additionalWrapperProps: AllHTMLAttributes<HTMLDivElement> = {}
    let WrapperTag: ReactComponentOrTagName = wrapperTag || 'div'
    if (wrapperIsValidationMessageContainer) {
        if (WrapperTag !== 'div') {
            console.warn(
                'Input component with validationMessage prop or defined invalid prop uses InputValidationError wrapper and ignores wrapperTag prop',
                {props}
            )
        }
        WrapperTag = InputValidationError;
        (additionalWrapperProps as InputValidationErrorProps).invalid = invalid === undefined ? false : invalid;
        (additionalWrapperProps as InputValidationErrorProps).error = validationMessage
        if (validationMessageClassName) {
            (additionalWrapperProps as InputValidationErrorProps).errorClassName = validationMessageClassName
        }
        (additionalWrapperProps as InputValidationErrorProps).inputContainerClassName = wrapperClasses
        additionalWrapperProps.className = clsx(
            grouped ? 'flex-1' : wrapperClass,
            typeof grouped === 'string' ? 'input-group-item ' + grouped : null
        )
    } else {
        additionalWrapperProps.className = wrapperClasses
    }

    let notch: null | React.ReactNode = (
        <div className="form-notch">
            <div className="form-notch-leading"/>
            <div
                className="form-notch-middle"
                style={{width: labelNotchWidth}}
            />
            <div className="form-notch-trailing"/>
        </div>
    )

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
                    ref={inputReference as any}
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
                ref={inputReference as any}
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
                    ref={labelReference}
                >
                    {label}
                </label>
            )}
            {notch}
            {children}
        </WrapperTag>
    )
}

export default withStable<InputProps>(
    ['onChange', 'onFocus', 'onBlur', 'onKeyDown', 'onBeforeInput', 'onPaste', 'onClick'],
    Input
)
