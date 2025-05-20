import {mdiEye, mdiEyeOff} from '@mdi/js'
import clsx from 'clsx'
import React, {useState} from 'react'
import IconButton from 'swayok-react-mdb-ui-kit/components/IconButton'
import Input, {InputProps} from 'swayok-react-mdb-ui-kit/components/Input/Input'
import InputAddonText from 'swayok-react-mdb-ui-kit/components/Input/InputAddonText'
import withStable from '../../helpers/withStable'

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
    withUnmaskToggler?: boolean
}

// Поле ввода значения.
function PasswordInput(props: PasswordInputProps) {
    const {
        withUnmaskToggler = false,
        wrapperClass = 'mb-4',
        children,
        ...otherProps
    } = props

    const [
        masked,
        setMasked,
    ] = useState<boolean>(true)

    return (
        <Input
            type={masked ? 'password' : 'text'}
            wrapperClass={clsx('password-input-wrapper', wrapperClass)}
            {...otherProps}
        >
            {children}
            {withUnmaskToggler && props.value && props.value.length > 0 && (
                <InputAddonText>
                    <IconButton
                        className="text-muted"
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

export default withStable<PasswordInputProps>(
    ['onChange', 'onFocus', 'onBlur', 'onKeyDown', 'onBeforeInput', 'onPaste', 'onClick'],
    PasswordInput
)
