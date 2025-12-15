import clsx from 'clsx'
import {CardProps} from './CardTypes'

// Контейнер каточки (блок с белым фоном, скругленными углами и тенью).
// Структура:
// Card
//      CardHeader
//          CardTitle
//              Текст заголовка
//      CardBody
//          Содержимое карточки
//      CardFooter
//          Кнопки или другие элементы
export function Card(props: CardProps) {
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
            {...otherProps}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default Card
