import clsx from 'clsx'
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useId,
} from 'react'
import {UserBehaviorService} from '../../services/UserBehaviorService'
import {
    HtmlComponentProps,
    ReactComponentOrTagName,
} from '../../types'
import {HtmlContent} from '../HtmlContent'
import {
    CheckboxProps,
    InputValidationErrorProps,
} from './InputTypes'
import {InputValidationError} from './InputValidationError'

// Аналог <input type="radio"/> или <input type="checkbox"/>.
export function Checkbox(props: CheckboxProps) {
    const {
        type = 'checkbox',
        label,
        labelIsHtml,
        labelId,
        labelClassName,
        labelStyle,
        labelBeforeInput = false,
        className,
        wrapperTag = 'div',
        wrapperClassName = 'mb-4',
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
        wrapperIsValidationMessageContainer ? null : wrapperClassName
    )

    const handleOnChange = useCallback((
        e: ChangeEvent<HTMLInputElement>
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
                className={clsx('form-check-label', labelClassName)}
                id={labelId}
                style={labelStyle}
                htmlFor={inputId}
            >
                {
                    labelIsHtml
                        ? (
                            <HtmlContent
                                block={false}
                                html={label}
                            />
                        )
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
                onChange={handleOnChange}
                {...otherProps}
            />
            {labelBeforeInput ? null : labelEl}
        </>
    )

    if (disableWrapper) {
        return contents
    } else {
        const additionalWrapperProps: HtmlComponentProps<HTMLDivElement> & Partial<InputValidationErrorProps> = {}
        let WrapperTag: ReactComponentOrTagName = wrapperTag
        if (wrapperIsValidationMessageContainer) {
            if (WrapperTag !== 'div') {
                console.warn(
                    'Input component with "validationMessage" prop or defined "invalid" prop ignores "wrapperTag" prop and uses <InputValidationError> component as "wrapperTag.',
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
            additionalWrapperProps.className = wrapperClassName
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
