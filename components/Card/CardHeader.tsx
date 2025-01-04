import React from 'react'
import clsx from 'clsx'
import {BackgroundColors, BorderColors, ComponentPropsWithModifiableTag} from '../../types/Common'

export interface CardHeaderProps extends ComponentPropsWithModifiableTag {
    // толщина нижней границы: 0, 1, 2, 3, 4, 5
    border?: number,
    // цвет границы
    borderColor?: BorderColors,
    // цвет фона
    background?: BackgroundColors,
}

// Шапка карточки
function CardHeader(props: CardHeaderProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const {
        className,
        children,
        border,
        borderColor,
        background,
        tag,
        ...otherProps
    } = props

    const classes = clsx(
        'card-header',
        border !== undefined ? `border-${border}` : null,
        border !== undefined && borderColor ? `border-${borderColor}` : null,
        background ? `bg-${background}` : null,
        className
    )

    const Tag = tag || 'div'

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

export default React.memo(React.forwardRef<HTMLAllCollection, CardHeaderProps>(CardHeader))
