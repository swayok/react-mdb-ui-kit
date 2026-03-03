import {RefObject} from 'react'
import {ReusableSvgRepository} from '../../helpers/ReusableSvgRepository'
import {HtmlComponentProps} from '../../types'

export interface ReusableSvgProps extends HtmlComponentProps<SVGSVGElement> {
    ref?: RefObject<SVGSVGElement>
    // HTML ID для переиспользования. Допустимые символы: a-z, A-Z, 0-9, -, _.
    // Если на странице большое количество одинаковых иконок, то браузер будет
    // довольно сильно тормозить из-за этого.
    // В этом случае можно использовать возможность копирования содержимого SVG
    // через тэг <use href="#reusable-svg-icon-{reuse}"/>.
    // Стоит учитывать, что в этом случае невозможно будет изменять содержимое SVG,
    // включая цвет через CSS класс поскольку внутри <svg> не будет <path>, <g> и т.п.
    reuse: string
}

// Переиспользуемый <svg> элемент.
// Содержимое полностью отрисовывается только 1 раз, а при необходимости
// повторного использования будет использоваться ссылка вида:
// <use href="#reusable-svg-icon-{reuse}"/>
export function ReusableSvg(props: ReusableSvgProps) {
    const {
        reuse,
        children,
        ...otherProps
    } = props

    return ReusableSvgRepository.getSvgContents(
        reuse,
        children,
        otherProps
    )
}
