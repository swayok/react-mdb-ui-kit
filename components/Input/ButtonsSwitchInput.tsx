import clsx from 'clsx'
import {ReactNode} from 'react'
import {ButtonsSwitchInputProps} from './InputTypes'
import {ButtonsSwitch} from '../ButtonsSwitch'
import {InputValidationError} from './InputValidationError'

// Выбор одной или нескольких опций из вариантов в виде кнопок.
export function ButtonsSwitchInput<ValueType = string>(
    props: ButtonsSwitchInputProps<ValueType>
) {

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
    const buttonsWrapped: ReactNode = (
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

/** @deprecated */
export default ButtonsSwitchInput
