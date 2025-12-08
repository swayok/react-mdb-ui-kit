import {
    CSSProperties,
    RefObject,
    SVGAttributes,
    useId,
} from 'react'
import {HtmlComponentProps} from '../types'
import {ReusableSvg} from './ReusableSvg'

export interface IconProps extends Omit<HtmlComponentProps<SVGSVGElement>, 'size' | 'label' | 'width' | 'height'> {
    id?: string
    path: string
    ref?: RefObject<SVGSVGElement>
    title?: string
    description?: string | null
    horizontal?: boolean
    vertical?: boolean
    rotate?: number
    spin?: boolean | number
    style?: CSSProperties
    size?: number | null
    // HTML ID иконки для переиспользования. Допустимые символы: a-z, A-Z, 0-9, -, _.
    // Если на странице большое количество одинаковых иконок, то браузер будет
    // довольно сильно тормозить из-за этого.
    // В этом случае можно использовать возможность копирования содержимого SVG
    // через тэг <use href="#reusable-svg-icon-{reuse}"/>. Стоит учитывать, что
    // в этом случае невозможно будет изменять содержимое SVG, включая цвет
    // через CSS класс поскольку внутри <svg> не будет <path>, <g> и т.п.
    reuse?: string
    // CSS класс контейнера, в котором будет сохранён оригинал иконки.
    // Класс нужно задавать, если стиль иконки зависит от CSS-класса родительского DOM элемента.
    reusableItemContainerClass?: string
}

// Иконка.
export function MDIIcon(props: IconProps) {
    const {
        path,
        title,
        description,
        size = 24,
        horizontal = false,
        vertical = false,
        rotate = 0,
        spin = false,
        style: propsStyle = {},
        reuse,
        reusableItemContainerClass,
        ...otherProps
    } = props

    const index: string = useId()
    const labelledById = `icon_labelledby_${index}`
    const describedById = `icon_describedby_${index}`

    const renderSpinElement = () => {
        const transformElement = <path d={path} />
        let spinElement = transformElement
        const spinSec = spin || typeof spin !== 'number' ? 2 : spin
        let inverse = horizontal || vertical
        if (spinSec < 0) {
            inverse = !inverse
        }
        if (spin) {
            spinElement = (
                <g
                    style={{
                        animation: `spin${inverse ? '-inverse' : ''} linear ${Math.abs(spinSec)}s infinite`,
                        transformOrigin: 'center',
                    }}
                >
                    {transformElement}
                    {!(horizontal || vertical || rotate !== 0) && (
                        <rect
                            width="24"
                            height="24"
                            fill="transparent"
                        />
                    )}
                </g>
            )
        }
        return (
            <>
                {spin && (
                    inverse
                        ? <style>{'@keyframes spin-inverse { to { transform: rotate(-360deg) } }'}</style>
                        : <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
                )}
                {spinElement}
            </>
        )
    }

    const collectStyles = (): CSSProperties => {
        const transform = []
        if (horizontal) {
            transform.push('scaleX(-1)')
        }
        if (vertical) {
            transform.push('scaleY(-1)')
        }
        if (rotate !== 0) {
            transform.push(`rotate(${rotate}deg)`)
        }
        const style: CSSProperties = Object.assign({}, propsStyle || {})
        if (size !== null) {
            style.height = style.width = size + 'px'
        }
        if (transform.length > 0) {
            style.transform = transform.join(' ')
            style.transformOrigin = 'center'
        }
        return style
    }

    const getCommonSvgProps = (): SVGAttributes<SVGElement> => {
        let ariaLabelledby
        let role
        if (title) {
            ariaLabelledby = description
                ? `${labelledById} ${describedById}`
                : labelledById
        } else {
            role = 'presentation'
            if (description) {
                throw new Error('title attribute required when description is set')
            }
        }
        return {
            'aria-labelledby': ariaLabelledby,
            role,
            viewBox: '0 0 24 24',
            style: collectStyles(),
            ...otherProps,
        }
    }

    const commonProps = getCommonSvgProps()
    const content = (
        <>
            {title && <title id={labelledById}>{title}</title>}
            {description && <desc id={describedById}>{description}</desc>}
            {renderSpinElement()}
        </>
    )

    if (reuse) {
        return (
            <ReusableSvg
                {...commonProps}
                reuse={'icon-' + reuse}
                reusableItemContainerClass={reusableItemContainerClass}
                uid={index}
            >
                {content}
            </ReusableSvg>
        )
    } else {
        return (
            <svg {...commonProps}>
                {content}
            </svg>
        )
    }
}

/** @deprecated */
export default MDIIcon
