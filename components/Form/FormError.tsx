import React from 'react'
import Collapse from '../Collapse'
import clsx from 'clsx'
import HtmlContent from '../HtmlContent'

type Props = {
    message?: string | null,
    html?: boolean
    wrapperClassName?: string,
    className?: string,
    visible: boolean,
    showImmediately?: boolean
}

// Вывод ошибки в форме.
function FormError(props: Props) {

    const {
        message,
        html,
        wrapperClassName,
        className = 'pb-3',
        visible,
        showImmediately
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

export default React.memo(FormError)
