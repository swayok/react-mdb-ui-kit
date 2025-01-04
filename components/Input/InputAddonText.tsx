import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'

type Props = AllHTMLAttributes<HTMLDivElement>

// Дополнение к полю ввода (отображается в правой части поля ввода).
// Пример использования: <Input...><InputAddonText>text</InputAddonText></Input>.
function InputAddonText(props: Props) {

    const {
        className,
        children,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('form-input-addon-text', className)}
            {...otherProps}
        >
            <div className="form-input-addon-text-content">
                {children}
            </div>
        </div>
    )
}

export default React.memo(InputAddonText)
