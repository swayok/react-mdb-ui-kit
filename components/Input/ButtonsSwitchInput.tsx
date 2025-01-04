import React, {AllHTMLAttributes} from 'react'
import {ButtonColors, FormSelectOption} from '../../types/Common'
import Button, {ButtonProps} from '../Button'
import clsx from 'clsx'
import InputValidationError from './InputValidationError'
import withStable from '../../helpers/withStable'

export interface ButtonsSwitchInputProps<ValueType = string> extends Omit<AllHTMLAttributes<HTMLDivElement>, 'value' | 'label' | 'onChange'> {
    label?: string | React.ReactNode,
    labelClass?: string,
    labelStyle?: React.CSSProperties,
    value?: ValueType | ValueType[]
    disabled?: boolean,
    options: FormSelectOption<ValueType>[],
    buttonsProps?: Omit<ButtonProps, 'color' | 'onChange' | 'small' | 'large' | 'disabled'>,
    small?: boolean,
    large?: boolean,
    inactiveColor?: ButtonColors,
    activeColor?: ButtonColors,
    onChange: (value: ValueType) => void,
    // Настройки валидности введенных данных.
    invalid?: boolean,
    validationMessage?: string | null,
    validationMessageClassName?: string,
    // Указать true если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean,
}

// Выбор одной или нескольких опций из вариантов в виде кнопок.
function ButtonsSwitchInput<ValueType = string>(props: ButtonsSwitchInputProps<ValueType>) {

    const {
        label,
        labelClass,
        labelStyle,
        value,
        disabled,
        options,
        buttonsProps,
        small = true,
        large,
        inactiveColor = 'gray',
        activeColor = 'blue',
        onChange,
        invalid,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        className = 'mb-4',
        ...wrapperProps
    } = props

    // Подпись.
    let labelElement = null
    if (label) {
        labelElement = (
            <label
                className={clsx(
                    'me-3',
                    labelClass,
                    invalid ? 'invalid' : null
                )}
                style={labelStyle}
            >
                {label}:
            </label>
        )
    }

    // Кнопки.
    const buttons: React.ReactNode[] = []
    const values: ValueType[] = Array.isArray(value) ? value : [value as ValueType]
    for (let i = 0; i < options.length; i++) {
        const option: FormSelectOption<ValueType> = options[i]
        const isSelected: boolean = values.includes(option.value)
        buttons.push(
            <Button
                key={'button-' + i}
                small={small}
                large={large}
                outline={!isSelected}
                {...buttonsProps}
                {...option.attributes as unknown as typeof buttonsProps}
                color={isSelected ? activeColor : inactiveColor}
                disabled={disabled || option.disabled}
                onClick={() => {
                    onChange(option.value)
                }}
            >
                {option.label}
            </Button>
        )
    }
    const buttonsWrapped: React.ReactNode = (
        <div className="btn-group">
            {buttons}
        </div>
    )

    const innerWrapperClass: string = 'd-flex flex-row align-items-center justify-content-start'

    if (withoutValidationMessage) {
        return (
            <div
                className={clsx(
                    innerWrapperClass,
                    'buttons-switch-input',
                    className
                )}
                {...wrapperProps}
            >
                {label}
                {buttonsWrapped}
            </div>
        )
    }

    return (
        <InputValidationError
            invalid={invalid || false}
            error={validationMessage}
            errorClassName={clsx('ps-0', validationMessageClassName)}
            inputContainerClassName={innerWrapperClass}
            className={clsx('buttons-switch-input', className)}
            {...wrapperProps}
        >
            {labelElement}
            {buttonsWrapped}
        </InputValidationError>
    )
}

export default withStable<ButtonsSwitchInputProps>(
    ['onChange'],
    ButtonsSwitchInput
) as unknown as typeof ButtonsSwitchInput
