import {
    mdiEye,
    mdiEyeOff,
} from '@mdi/js'
import clsx from 'clsx'
import {
    useEffect,
    useState,
} from 'react'
import {IconButton} from '../Icon/IconButton'
import {Input} from './Input'
import {InputAddonText} from './InputAddonText'
import type {PasswordInputProps} from './InputTypes'

// Поле ввода значения.
export function PasswordInput(props: PasswordInputProps) {
    const {
        withUnmaskToggler = false,
        wrapperClassName = 'mb-4',
        children,
        ...otherProps
    } = props

    const [
        masked,
        setMasked,
    ] = useState<boolean>(true)

    useEffect(() => {
        if (!withUnmaskToggler) {
            setMasked(true)
        }
    }, [withUnmaskToggler])

    return (
        <Input
            type={masked ? 'password' : 'text'}
            wrapperClassName={clsx('password-input-wrapper', wrapperClassName)}
            {...otherProps}
        >
            {children}
            {withUnmaskToggler && props.value && props.value.length > 0 && (
                <InputAddonText>
                    <IconButton
                        color="muted"
                        path={masked ? mdiEye : mdiEyeOff}
                        onClick={() => {
                            setMasked(!masked)
                        }}
                    />
                </InputAddonText>
            )}
        </Input>
    )
}
