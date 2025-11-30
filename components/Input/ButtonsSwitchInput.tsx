import clsx from 'clsx'
import React, {AllHTMLAttributes} from 'react'
import {ButtonsSwitch} from '../ButtonsSwitch'
import {withStable} from '../../helpers/withStable'
import {ButtonColors, FormSelectOption} from 'swayok-react-mdb-ui-kit/types/Common'
import {ButtonProps} from '../Button'
import InputValidationError from './InputValidationError'

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
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
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
        invalid = false,
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
    const buttonsWrapped: React.ReactNode = (
        <ButtonsSwitch
            options={options}
            value={value}
            onChange={onChange}
            small={small}
            large={large}
            inactiveColor={inactiveColor}
            activeColor={activeColor}
            disabled={disabled}
            buttonsProps={buttonsProps}
        />
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
            invalid={invalid}
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
