import clsx from 'clsx'
import {InputAddonTextProps} from './InputTypes'

// Дополнение к полю ввода (отображается в правой части поля ввода).
// Пример использования: <Input...><InputAddonText>text</InputAddonText></Input>.
export function InputAddonText(props: InputAddonTextProps) {

    const {
        className,
        contentClassName,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('form-input-addon-text', className)}
            {...otherProps}
        >
            <div className={clsx('form-input-addon-text-content', contentClassName)}>
                {children}
            </div>
        </div>
    )
}

/** @deprecated */
export default InputAddonText
