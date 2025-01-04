import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'
import {ButtonColors, FormSelectOption, FormSelectOptionsList} from '../types/Common'
import Button, {ButtonProps} from './Button'
import withStable from '../helpers/withStable'

export interface ButtonsSwitchProps<ValueType = string> extends Omit<AllHTMLAttributes<HTMLDivElement>, 'value' | 'label' | 'onChange'> {
    value?: ValueType | ValueType[]
    disabled?: boolean,
    options: FormSelectOptionsList<ValueType>,
    buttonsProps?: Omit<ButtonProps, 'color' | 'onChange' | 'small' | 'large' | 'disabled'>,
    small?: boolean,
    large?: boolean,
    inactiveColor?: ButtonColors,
    activeColor?: ButtonColors,
    onChange: (value: ValueType) => void,
}

const defaultProps: Partial<ButtonsSwitchProps> = {
    inactiveColor: 'gray',
    activeColor: 'blue',
    small: true,
}

// Выбор одной или нескольких опций из вариантов в виде кнопок.
function ButtonsSwitch<ValueType = string>(props: ButtonsSwitchProps<ValueType>) {

    const {
        value,
        disabled,
        options,
        buttonsProps,
        small,
        large,
        inactiveColor,
        activeColor,
        onChange,
        className,
        ...wrapperProps
    } = props

    // Кнопки.
    const buttons: React.ReactNode[] = []
    const values: ValueType[] = Array.isArray(value) ? value : [value as ValueType]
    for (let i = 0; i < options.length; i++) {
        const option: FormSelectOption<ValueType> = options[i]
        const isSelected: boolean = values.includes(option.value)
        buttons.push(
            <Button
                key={'button-' + i}
                small={small === undefined ? defaultProps.small : small}
                large={large}
                outline={!isSelected}
                {...buttonsProps}
                {...option.attributes as unknown as typeof buttonsProps}
                color={
                    isSelected
                        ? (activeColor || defaultProps.activeColor)
                        : (inactiveColor || defaultProps.inactiveColor)
                }
                disabled={disabled || option.disabled}
                onClick={() => {
                    onChange(option.value)
                }}
            >
                {option.label}
            </Button>
        )
    }
    return (
        <div
            className={clsx(
                'btn-group',
                className
            )}
            {...wrapperProps}
        >
            {buttons}
        </div>
    )
}

export default withStable<ButtonsSwitchProps>(
    ['onChange'],
    ButtonsSwitch
) as typeof ButtonsSwitch
