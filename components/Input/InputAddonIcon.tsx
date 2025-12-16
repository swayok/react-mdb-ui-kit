import {Icon} from '../Icon'
import {InputAddonText} from './InputAddonText'
import {InputAddonIconProps} from './InputTypes'

// Дополнение к полю ввода в виде иконки (отображается в правой части поля ввода).
// Пример использования: <Input...><InputAddonIcon></Input>.
export function InputAddonIcon(props: InputAddonIconProps) {

    const {
        className,
        color = 'muted',
        iconClassName,
        ...otherProps
    } = props

    return (
        <InputAddonText className={className}>
            <Icon
                {...otherProps}
                color={color}
                className={iconClassName}
            />
        </InputAddonText>
    )
}

/** @deprecated */
export default InputAddonIcon
