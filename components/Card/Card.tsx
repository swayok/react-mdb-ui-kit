import React from 'react'
import clsx from 'clsx'
import {BackgroundColors, BorderColors, ComponentPropsWithModifiableTag} from 'swayok-react-mdb-ui-kit/types/Common'

export interface CardProps extends ComponentPropsWithModifiableTag {
    // толщина границы: 0, 1, 2, 3, 4, 5
    border?: number,
    // цвет границы
    borderColor?: BorderColors,
    // цвет фона
    background?: BackgroundColors,
    // тень: inner, 0, 1, 2, 3, 4, 5, 6. Суффиксы: '{w}-soft' ('2-soft'), '{w}-strong' ('2-strong')
    shadow?: number | string,
    // Расположение текста в карточке
    alignment?: 'end' | 'center' | 'start',
}

// Контейнер каточки (блок с белым фоном, скругленными углами и тенью)
// Структура:
// Card
//      CardHeader
//          CardTitle
//              Текст заголовка
//      CardBody
//          Содержимое карточки
//      CardFooter
//          Кнопки или другие элементы
function Card(props: CardProps, ref: React.ForwardedRef<HTMLElement>) {
    const {
        className,
        children,
        border,
        borderColor,
        background,
        tag: Tag = 'div',
        shadow,
        alignment,
        ...otherProps
    } = props

    const classes = clsx(
        'card',
        border ? `border border-${border}` : null,
        border && borderColor ? `border-${borderColor}` : null,
        background ? `bg-${background}` : null,
        shadow ? `shadow-${shadow}` : null,
        alignment ? `text-${alignment}` : null,
        className
    )

    return (
        <Tag
            className={classes}
            ref={ref}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLElement, CardProps>(Card))
