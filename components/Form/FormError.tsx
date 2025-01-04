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

    const className = clsx('form-error', props.className || 'pb-3')

    return (
        <Collapse show={props.visible} showImmediately={props.showImmediately}>
            <div className={props.wrapperClassName}>
                {props.html ? (
                    <HtmlContent
                        block
                        className={className}
                        html={props.message || ''}
                    />
                ) : (
                    <div className={className}>
                        {props.message}
                    </div>
                )}
            </div>
        </Collapse>
    )
}

export default React.memo(FormError)
