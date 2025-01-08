import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'

interface Props extends AllHTMLAttributes<HTMLDivElement> {
    contentClassName?: string,
}

// Дополнение к полю ввода (отображается в правой части поля ввода).
// Пример использования: <Input...><InputAddonText>text</InputAddonText></Input>.
function InputAddonText(props: Props) {

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

export default React.memo(InputAddonText)
