import {ComponentPropsWithModifiableTag} from '../types'
import DOMPurify from 'dompurify'

interface Props extends Omit<ComponentPropsWithModifiableTag, 'children' | 'dangerouslySetInnerHTML'> {
    // Результат выполнения {trans().path.to.html}.
    html: string
    // Если tag не указан, то когда true - оборачивается в <div>, а когда false - в <span>.
    block?: boolean
}

/**
 * Безопасно вставляет HTML-строку.
 * Удаляет потенциально вредоносные теги.
 */
export function HtmlContent(props: Props) {
    const {
        html,
        block,
        tag: Tag = block ? 'div' : 'span',
        ...otherProps
    } = props

    return (
        <Tag
            {...otherProps}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(html, {
                    USE_PROFILES: {html: true},
                    ADD_ATTR: ['target'],
                }),
            }}
        />
    )
}

/** @deprecated */
export default HtmlContent
