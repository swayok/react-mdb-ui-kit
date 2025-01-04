import * as React from 'react'
import {AllHTMLAttributes, CSSProperties, useEffect, useId, useRef} from 'react'
import {AnyObject} from '../types/Common'

export interface IconProps extends Omit<AllHTMLAttributes<SVGSVGElement>, 'size' | 'label' | 'width' | 'height'> {
    id?: string;
    path: string;
    ref?: React.RefObject<SVGSVGElement>;
    title?: string;
    description?: string | null;
    horizontal?: boolean;
    vertical?: boolean;
    rotate?: number;
    spin?: boolean | number;
    style?: CSSProperties;
    size?: number | null;
    // HTML ID иконки для переиспользования. Допустимые символы: a-z, A-Z, 0-9, -, _.
    // Если на странице большое количество одинаковых иконок, то браузер будет
    // довольно сильно тормозить из-за этого.
    // В этом случае можно использовать возможность копирования содержимого SVG
    // через тэг <use href="#reusable-svg-icon-{reuse}"/>. Стоит учитывать что
    // в этом случае невозможно будет изменять содержимое SVG, включая цвет
    // через CSS класс поскольку внутри <svg> не будет <path>, <g> и т.п.
    reuse?: string;
    // CSS класс контейнера, в котором будет сохранён оригинал иконки.
    reusableItemContainerClass?: string;
    // Контейнер для хранения оригиналов иконок, используемых для копирования.
    reusableItemsContainerSelector?: string | 'body';
}

// Контейнер с известными иконками доступными для переиспользования.
const reusableIcons: AnyObject = {}

function MDIIcon(props: IconProps) {
    const {
        id,
        path,
        title,
        description,
        size = 24,
        horizontal = false,
        vertical = false,
        rotate = 0,
        spin = false,
        style: customStyle = {},
        reuse,
        reusableItemContainerClass,
        reusableItemsContainerSelector = 'body',
        ...otherProps
    } = props

    const ref = useRef<SVGSVGElement>(null)
    const reusableIconId: string = 'reusable-svg-icon-' + reuse

    useEffect(() => {
        if (reuse && ref.current) {
            // Нам нужно дополнительно сохранить исходный SVG-элемент вне React приложения,
            // чтобы он хранился там даже при полной перерисовке React приложения.
            // При первом использовании svg элемент будет вставлен в оригинальном виде.
            // При повторных перерисовках он будет заменен на <svg><use href="#{reusableIconId}"/></svg>.
            // Если вне приложения не будет полной копии, то иконка не отобразится.
            reusableIcons[reuse] = true
            // Сначала удаляем существующий элемент, если он уже есть.
            const existing: HTMLElement | null = document.getElementById(reusableIconId)
            if (existing) {
                existing.parentElement?.remove()
            }
            // Создаем невидимый контейнер для хранения оригинала иконки.
            const iconContainter: HTMLDivElement = document.createElement('div')
            iconContainter.style.display = 'none'
            if (reusableItemContainerClass) {
                iconContainter.className = reusableItemContainerClass
            }
            // Клонируем иконку и добавляем ее в невидимый контейнер.
            const clone: SVGElement = ref.current.cloneNode(true) as SVGElement
            clone.id = reusableIconId
            iconContainter.append(clone)

            // Добавляем невидимый контейнер с иконкой в контейнер где хранятся все подобные элементы
            if (!reusableItemsContainerSelector || reusableItemsContainerSelector === 'body') {
                document.body.append(iconContainter)
            } else {
                const allIconsContainer = document.body.querySelector(reusableItemsContainerSelector)
                if (allIconsContainer) {
                    allIconsContainer.append(iconContainter)
                } else {
                    console.error(
                        '[MDIIcon] failed to find element for reusableItemsContainerSelector = '
                        + reusableItemsContainerSelector
                    )
                    document.body.append(iconContainter)
                }
            }
        }
    }, [ref.current, reuse])

    const index: string = useId()
    const pathStyle: CSSProperties = {}
    const transform = []
    const style = Object.assign({}, customStyle || {})
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
    const transformElement = (
        <path
            d={path}
            style={pathStyle}
        />
    )
    if (transform.length > 0) {
        style.transform = transform.join(' ')
        style.transformOrigin = 'center'
    }
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
    let ariaLabelledby
    const labelledById = `icon_labelledby_${index}`
    const describedById = `icon_describedby_${index}`
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
    if (reuse && reusableIcons[reuse]) {
        return (
            <svg
                viewBox="0 0 24 24"
                style={style}
                role={role}
                aria-labelledby={ariaLabelledby}
                data-reuse="1"
                {...otherProps}
            >
                <use href={'#' + reusableIconId}/>
            </svg>
        )
    } else {
        if (reuse) {
            reusableIcons[reuse] = true
        }
        return (
            <svg
                ref={ref}
                viewBox="0 0 24 24"
                style={style}
                role={role}
                aria-labelledby={ariaLabelledby}
                id={id}
                {...otherProps}
            >
                {title && <title id={labelledById}>{title}</title>}
                {description && <desc id={describedById}>{description}</desc>}
                {spin && (
                    inverse
                        ? <style>{'@keyframes spin-inverse { to { transform: rotate(-360deg) } }'}</style>
                        : <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
                )}
                {spinElement}
            </svg>
        )
    }
}

export default React.memo(MDIIcon)
