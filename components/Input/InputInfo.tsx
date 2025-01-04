import React from 'react'
import {ComponentPropsWithModifiableTag} from '../../types/Common'
import clsx from 'clsx'
import HtmlContent from '../HtmlContent'

interface PropsForHtml extends Omit<ComponentPropsWithModifiableTag, 'dangerouslySetInnerHTML'> {
    html: string;
    children?: never;
}

interface Props extends Omit<ComponentPropsWithModifiableTag, 'dangerouslySetInnerHTML'> {
    html?: never;
}

// Разъяснение к полю ввода.
// Пример использования: <Input.../><InputInfo>text</InputInfo>.
function InputInfo(props: Props | PropsForHtml) {

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

export default React.memo(InputInfo)
