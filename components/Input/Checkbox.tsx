import clsx from 'clsx'
import React, {AllHTMLAttributes, CSSProperties, useCallback, useEffect, useId} from 'react'
import {ReactComponentOrTagName} from '../../types/Common'
import InputValidationError, {InputValidationErrorProps} from './InputValidationError'
import {PropsWithForwardedRef, withStableAndRef} from '../../helpers/withStable'
import HtmlContent from '../HtmlContent'
import UserBehaviorService from '../../services/UserBehaviorService'

export interface CheckboxProps extends AllHTMLAttributes<HTMLInputElement> {
    // Обертка
    wrapperTag?: ReactComponentOrTagName;
    wrapperClass?: string;
    wrapperProps?: AllHTMLAttributes<HTMLElement>;
    wrapperStyle?: CSSProperties;
    // Не оборачивать в props.wrapperTag.
    disableWrapper?: boolean;
    // Добавить стиль .form-check-inline.
    inline?: boolean;
    // Подпись
    label?: string;
    labelId?: string;
    labelClass?: string;
    labelStyle?: CSSProperties;
    labelBeforeInput?: boolean;
    labelIsHtml?: boolean;
    // Отмечен по умолчанию.
    defaultChecked?: boolean;
    // Размер иконки чекбокса: уменьшенный. Не работает для btn.
    small?: boolean;
    // Отобразить в виде переключателя.
    toggleSwitch?: boolean;
    // Настройки валидности введенных данных.
    invalid?: boolean;
    validationMessage?: string | null;
    validationMessageClassName?: string;
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean;
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string;
}

// Аналог <input type="radio"/> или <input type="checkbox"/>.
function Checkbox(props: PropsWithForwardedRef<CheckboxProps, HTMLInputElement>) {
    const {
        type = 'checkbox',
        label,
        labelIsHtml,
        labelId,
        labelClass,
        labelStyle,
        labelBeforeInput = false,
        className,
        wrapperTag = 'div',
        wrapperClass = 'mb-4',
        wrapperProps,
        wrapperStyle,
        inline,
        small,
        id,
        defaultChecked,
        checked,
        invalid,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        disableWrapper,
        toggleSwitch,
        forwardedRef,
        onChange,
        trackBehaviorAs,
        ...otherProps
    } = props

    const fallbackId: string = useId()
    const inputId: string = id ?? fallbackId

    const wrapperIsValidationMessageContainer: boolean = (
        !withoutValidationMessage
        && (invalid !== undefined || !!validationMessage)
    )

    const wrapperClasses = clsx(
        label ? 'form-check' : null,
        type === 'radio' ? 'form-radio' : 'form-checkbox',
        small && !toggleSwitch ? 'form-check-sm' : null,
        inline ? 'form-check-inline' : null,
        toggleSwitch ? 'form-switch' : null,
        small && toggleSwitch ? 'form-switch-sm' : null,
        label ? (labelBeforeInput ? 'label-before-input' : 'label-after-input') : null,
        invalid ? 'is-invalid' : null,
        wrapperIsValidationMessageContainer ? null : wrapperClass
    )

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        if (trackBehaviorAs) {
            UserBehaviorService.onCheckboxOrRadioChange(e.currentTarget, trackBehaviorAs)
        }
    }, [onChange, trackBehaviorAs])

    useEffect(() => {
        if (trackBehaviorAs && props.value === undefined) {
            console.error('Checkbox needs value prop to be used correctly with trackBehaviorAs prop')
        }
    }, [])

    let labelEl = null
    if (label) {
        labelEl = (
            <label
                className={clsx('form-check-label', labelClass)}
                id={labelId}
                style={labelStyle}
                htmlFor={inputId}
            >
                {
                    labelIsHtml
                        ? <HtmlContent block={false} html={label}/>
                        : label
                }
            </label>
        )
    }

    const contents = (
        <>
            {labelBeforeInput ? labelEl : null}
            <input
                className={clsx(
                    'form-check-input',
                    className
                )}
                type={type === 'radio' ? 'radio' : 'checkbox'}
                defaultChecked={defaultChecked}
                checked={checked}
                id={inputId}
                ref={forwardedRef}
                onChange={handleOnChange}
                {...otherProps}
            />
            {labelBeforeInput ? null : labelEl}
        </>
    )

    if (disableWrapper) {
        return contents
    } else {
        const additionalWrapperProps: AllHTMLAttributes<HTMLDivElement> = {}
        let WrapperTag: ReactComponentOrTagName = wrapperTag
        if (wrapperIsValidationMessageContainer) {
            if (WrapperTag !== 'div') {
                console.warn(
                    'Input component with validationMessage prop or defined invalid prop uses InputValidationError wrapper and ignores wrapperTag prop',
                    {props}
                )
            }
            WrapperTag = InputValidationError;
            (additionalWrapperProps as InputValidationErrorProps).invalid = invalid ?? false;
            (additionalWrapperProps as InputValidationErrorProps).error = validationMessage
            if (validationMessageClassName) {
                (additionalWrapperProps as InputValidationErrorProps).errorClassName = validationMessageClassName
            }
            (additionalWrapperProps as InputValidationErrorProps).inputContainerClassName = wrapperClasses
            additionalWrapperProps.className = wrapperClass
        } else {
            additionalWrapperProps.className = wrapperClasses
        }
        return (
            <WrapperTag
                style={{...wrapperStyle}}
                {...additionalWrapperProps}
                {...wrapperProps}
            >
                {contents}
            </WrapperTag>
        )
    }
}

export default withStableAndRef<CheckboxProps, HTMLInputElement>(
    ['onChange'],
    Checkbox,
    'Checkbox'
)
