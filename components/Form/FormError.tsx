import clsx from 'clsx'
import {ReactNode} from 'react'
import {Collapse} from '../Collapse'
import {HtmlContent} from '../HtmlContent'

interface Props {
    wrapperClassName?: string
    className?: string
    visible: boolean
    showImmediately?: boolean
}

interface TextProps extends Props {
    message?: string | null | ReactNode | ReactNode[]
    html?: never
}

interface HtmlProps extends Props {
    message?: string | null
    html: true
}

// Вывод ошибки в форме.
export function FormError(props: TextProps | HtmlProps) {

    const {
        message,
        html,
        wrapperClassName,
        className = 'pb-3',
        visible,
        showImmediately,
    } = props

    const contentClassName = clsx('form-error', className)

    return (
        <Collapse
            show={visible}
            showImmediately={showImmediately}
        >
            <div className={wrapperClassName}>
                {html ? (
                    <HtmlContent
                        block
                        className={contentClassName}
                        html={message ?? ''}
                    />
                ) : (
                    <div className={contentClassName}>
                        {message}
                    </div>
                )}
            </div>
        </Collapse>
    )
}
