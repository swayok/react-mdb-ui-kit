import clsx from 'clsx'
import {ReactNode} from 'react'
import {
    ButtonColors,
    FormSelectOption,
    FormSelectOptionsList,
    HtmlComponentProps,
} from '../types'
import {
    Button,
    ButtonProps,
} from './Button'

export interface ButtonsSwitchProps<ValueType = string> extends Omit<HtmlComponentProps<HTMLDivElement>, 'value' | 'label' | 'onChange'> {
    value?: ValueType | ValueType[]
    disabled?: boolean
    options: FormSelectOptionsList<ValueType>
    buttonsProps?: Omit<ButtonProps, 'color' | 'onChange' | 'small' | 'large' | 'disabled'>
    small?: boolean
    large?: boolean
    inactiveColor?: ButtonColors
    activeColor?: ButtonColors
    onChange: (value: ValueType) => void
}

// Выбор одной или нескольких опций из вариантов в виде кнопок.
export function ButtonsSwitch<ValueType = string>(props: ButtonsSwitchProps<ValueType>) {

    const {
        value,
        disabled,
        options,
        buttonsProps,
        small = true,
        large = false,
        inactiveColor = 'gray',
        activeColor = 'blue',
        onChange,
        className,
        ...wrapperProps
    } = props

    // Кнопки.
    const buttons: ReactNode[] = []
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
                disabled={disabled ?? option.disabled}
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
