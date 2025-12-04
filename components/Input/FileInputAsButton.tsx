import {useId} from 'react'
import {FileInputAsButtonProps} from './InputTypes'
import {Button} from '../Button'

// Поле выбора файла в виде кнопки.
export function FileInputAsButton(props: FileInputAsButtonProps) {

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
