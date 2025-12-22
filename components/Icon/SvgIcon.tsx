import clsx from 'clsx'
import {
    CSSProperties,
    RefObject,
} from 'react'
import {
    HtmlComponentProps,
    SvgIconInfo,
} from '../../types'

export interface SvgIconProps extends Omit<HtmlComponentProps<SVGSVGElement>, 'size' | 'label' | 'width' | 'height'> {
    id?: string
    iconInfo: SvgIconInfo
    ref?: RefObject<SVGSVGElement>
    horizontal?: boolean
    vertical?: boolean
    rotate?: number
    style?: CSSProperties
    size?: number | null
}

// Отображение не оптимизированной SVG иконки по примеру <MDIIcon>.
export function SvgIcon(props: SvgIconProps) {
    const {
        iconInfo,
        size = 24,
        horizontal = false,
        vertical = false,
        rotate = 0,
        className,
        style: customStyle = {},
        ...rest
    } = props

    const transform = []
    const style: CSSProperties = {...customStyle}
    if (size !== null) {
        style.height = style.width = size + 'px'
    }
    if (horizontal) {
        transform.push('scaleX(-1)')
    }
    if (vertical) {
        transform.push('scaleY(-1)')
    }
    if (rotate !== 0) {
        transform.push(`rotate(${rotate}deg)`)
    }
    if (transform.length > 0) {
        style.transform = transform.join(' ')
        style.transformOrigin = 'center'
    }
    return (
        <svg
            viewBox={`0 0 ${iconInfo.width} ${iconInfo.height}`}
            className={clsx(
                'custom-icon',
                rotate ? 'custom-icon-rotatable' : null,
                'colored-by-' + iconInfo.coloredBy,
                className
            )}
            style={style}
            data-use="0"
            {...rest}
        >
            <g
                dangerouslySetInnerHTML={{
                    // DOMPurify.sanitize(iconInfo.content) не работает - вставляется пустота.
                    __html: iconInfo.content,
                }}
            />
        </svg>
    )
}
