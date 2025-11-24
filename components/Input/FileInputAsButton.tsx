import React, {AllHTMLAttributes, useId} from 'react'
import Button, {ButtonProps} from '../Button'

interface Props extends
    Omit<ButtonProps, 'onChange' | 'onClick' | 'labelFor' | 'id' | 'ref'>,
    Pick<AllHTMLAttributes<HTMLInputElement>, 'accept' | 'onChange' | 'id' | 'children'>
{
    ref?: React.Ref<HTMLInputElement>
    buttonRef?: React.RefObject<HTMLLabelElement>
    inputProps?: Omit<AllHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'id' | 'ref'>
}

// Поле выбора файла в виде кнопки.
export function FileInputAsButton(props: Props) {

    const fallbackId = useId()

    const {
        ref,
        buttonRef,
        id = fallbackId,
        accept,
        onChange,
        children,
        disabled,
        color = 'blue',
        ...buttonProps
    } = props

    return (
        <>
            <input
                ref={ref}
                type="file"
                className="d-none"
                id={id}
                accept={accept}
                disabled={disabled}
                onChange={onChange}
            />
            <Button
                ref={buttonRef}
                labelFor={id}
                color={color}
                disabled={disabled}
                {...buttonProps}
            >
                {children}
            </Button>
        </>
    )
}
