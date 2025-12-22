import clsx from 'clsx'
import {HtmlContent} from '../HtmlContent'
import {InputInfoProps} from './InputTypes'

// Разъяснение к полю ввода.
// Пример использования: <Input.../><InputInfo>text</InputInfo>.
export function InputInfo(props: InputInfoProps) {

    const {
        tag: Tag = 'div',
        className = 'mb-4',
        children,
        html,
        ...otherProps
    } = props

    const classes: string = clsx(
        'form-input-info',
        className
    )

    if (html) {
        return (
            <HtmlContent
                tag={Tag}
                className={classes}
                {...otherProps}
                html={html}
            />
        )
    }
    return (
        <Tag
            className={classes}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}
