import * as React from 'react'
import {AllHTMLAttributes, useEffect, useRef} from 'react'
import {
    ReusableSvgRepository,
    ReusableSvgRepositorySetSvgElementFn
} from '../helpers/ReusableSvgRepository'

export interface ReusableSvgProps extends AllHTMLAttributes<SVGSVGElement> {
    ref?: React.RefObject<SVGSVGElement>
    // HTML ID для переиспользования. Допустимые символы: a-z, A-Z, 0-9, -, _.
    // Если на странице большое количество одинаковых иконок, то браузер будет
    // довольно сильно тормозить из-за этого.
    // В этом случае можно использовать возможность копирования содержимого SVG
    // через тэг <use href="#reusable-svg-icon-{reuse}"/>.
    // Стоит учитывать, что в этом случае невозможно будет изменять содержимое SVG,
    // включая цвет через CSS класс поскольку внутри <svg> не будет <path>, <g> и т.п.
    reuse: string
    // Уникальный идентификатор внешнего элемента для определения, является ли
    // текущая версия основной или переиспользованной.
    // Используйте useId() для этого.
    uid: string | number
    // CSS класс контейнера, в котором будет сохранён оригинал иконки.
    // Класс нужно задавать, если стиль иконки зависит от CSS-класса родительского DOM элемента.
    reusableItemContainerClass?: string;
}

// Переиспользуемый <svg> элемент.
// Содержимое полностью отрисовывается только 1 раз, а при необходимости
// повторного использования будет использоваться ссылка вида:
// <use href="#reusable-svg-icon-{reuse}"/>
export function ReusableSvg(props: ReusableSvgProps) {
    const {
        ref,
        reuse,
        uid,
        reusableItemContainerClass,
        children,
        ...otherProps
    } = props

    const innerRef = useRef<SVGSVGElement>(null)
    const realRef = ref ?? innerRef

    const resolverRef = useRef<ReusableSvgRepositorySetSvgElementFn>(null)

    useEffect(() => {
        resolverRef.current?.(realRef.current)
    }, [realRef.current])

    return (
        <svg
            ref={realRef}
            {...otherProps}
        >
            {ReusableSvgRepository.getSvgContents(
                reuse,
                uid,
                resolve => {
                    resolverRef.current = resolve
                    return children
                },
                reusableItemContainerClass,
            )}
        </svg>
    )
}

/** @deprecated */
export default ReusableSvg
