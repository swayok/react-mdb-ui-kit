import clsx from 'clsx'
import React, {AllHTMLAttributes, CSSProperties, useCallback, useEffect, useId} from 'react'
import {CheckboxColors} from 'swayok-react-mdb-ui-kit/types/Common'
import withStable from '../../helpers/withStable'
import UserBehaviorService from '../../services/UserBehaviorService'
import {ReactComponentOrTagName} from '../../types/Common'
import HtmlContent from '../HtmlContent'
import InputValidationError, {InputValidationErrorProps} from './InputValidationError'

export interface CheckboxProps extends Omit<AllHTMLAttributes<HTMLInputElement>, 'type'> {
    type?: 'checkbox' | 'radio' | 'switch'
    // Обертка.
    wrapperTag?: ReactComponentOrTagName
    wrapperClass?: string
    wrapperProps?: AllHTMLAttributes<HTMLElement>
    wrapperStyle?: CSSProperties
    // Не оборачивать в props.wrapperTag.
    disableWrapper?: boolean
    // Добавить стиль .form-check-inline.
    inline?: boolean
    // Подпись.
    label?: string
    labelId?: string
    labelClass?: string
    labelStyle?: CSSProperties
    labelBeforeInput?: boolean
    labelIsHtml?: boolean
    // Отмечен по умолчанию.
    defaultChecked?: boolean
    // Размер иконки чекбокса: уменьшенный.
    small?: boolean
    // Цвет переключателя.
    color?: CheckboxColors
    // Если solid = false, то в состоянии "checked"
    // галочка цветная на белом фоне внутри цветного квадрата.
    // Если solid = true, то в состоянии "checked"
    // галочка белая на цветном фоне внутри цветного квадрата.
    // Применимо только к type = 'checkbox'.
    // По умолчанию: false.
    solid?: boolean
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
    inputRef?: React.Ref<HTMLInputElement>
}

// Аналог <input type="radio"/> или <input type="checkbox"/>.
function Checkbox(props: CheckboxProps) {
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
        color,
        solid,
        id,
        defaultChecked,
        checked,
        invalid,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        disableWrapper,
        inputRef,
        onChange,
        trackBehaviorAs,
        hidden,
        ...otherProps
    } = props

    const fallbackId: string = useId()
    const inputId: string = id ?? fallbackId

    if (hidden) {
        return null
    }

    const wrapperIsValidationMessageContainer: boolean = (
        !withoutValidationMessage
        && (invalid !== undefined || !!validationMessage)
    )

    let typeClasses
    if (type === 'switch') {
        typeClasses = clsx(
            'form-switch',
            small ? 'form-switch-sm' : null,
            color ? 'form-switch-' + color : null
        )
    } else {
        typeClasses = clsx(
            'form-check',
            type === 'radio' ? 'form-radio' : 'form-checkbox',
            small ? 'form-check-sm' : null,
            color ? 'form-check-' + color : null
        )
    }

    const wrapperClasses = clsx(
        typeClasses,
        inline ? 'form-check-inline' : null,
        label ? (labelBeforeInput ? 'label-before-input' : 'label-after-input') : null,
        invalid ? 'is-invalid' : null,
        wrapperIsValidationMessageContainer ? null : wrapperClass
    )

    const handleOnChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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
                    type === 'switch' ? 'form-switch-input' : 'form-check-input',
                    solid && type === 'checkbox' ? 'form-check-solid' : null,
                    className
                )}
                type={type === 'radio' ? 'radio' : 'checkbox'}
                defaultChecked={defaultChecked}
                checked={checked}
                id={inputId}
                ref={inputRef}
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
                    'Input component with "validationMessage" prop or defined "invalid" prop ignores "wrapperTag" prop and uses <InputValidationError> component as "wrapperTag.',
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

export default withStable<CheckboxProps>(
    ['onChange'],
    Checkbox
)
