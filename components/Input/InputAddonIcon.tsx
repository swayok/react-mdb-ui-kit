import React from 'react'
import InputAddonText from './InputAddonText'
import {IconProps} from '../MDIIcon'
import Icon from '../Icon'

interface Props extends IconProps {
    iconClassName?: string;
}

// Дополнение к полю ввода в виде иконки (отображается в правой части поля ввода).
// Пример использования: <Input...><InputAddonIcon></Input>.
function InputAddonIcon(props: Props) {

    const {
        className,
        iconClassName = 'text-muted',
        ...otherProps
    } = props

    return (
        <InputAddonText className={className}>
            <Icon
                {...otherProps}
                className={iconClassName}
            />
        </InputAddonText>
    )
}

export default React.memo(InputAddonIcon)
