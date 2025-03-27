import React from 'react'
import clsx from 'clsx'
import {BackgroundColors, BorderColors, ComponentPropsWithModifiableTag} from '../../types/Common'

export interface CardFooterProps extends ComponentPropsWithModifiableTag {
    // толщина верхней границы: 0, 1, 2, 3, 4, 5
    border?: number,
    // цвет границы
    borderColor?: BorderColors,
    // цвет фона
    background?: BackgroundColors,
}

// Подвал карточки
function CardFooter(props: CardFooterProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        border,
        borderColor,
        background,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const classes = clsx(
        'card-footer',
        border ? `border-${border}` : null,
        border && borderColor ? `border-${borderColor}` : null,
        background ? `bg-${background}` : null,
        className
    )

    return (
        <Tag
            className={classes}
            {...otherProps}
            ref={ref}
        >
            {children}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLAllCollection, CardFooterProps>(CardFooter))
