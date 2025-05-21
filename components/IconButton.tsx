import React, {CSSProperties} from 'react'
import Icon, {AppIconProps} from './Icon'
import clsx from 'clsx'
import {TooltipProps} from './Tooltip'
import {TextColors} from '../types/Common'
import withStable from '../helpers/withStable'

export interface IconButtonProps extends Omit<AppIconProps, 'onClick'> {
    tooltip?: string,
    color?: TextColors | 'link',
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void,
    tooltipProps?: Omit<TooltipProps, 'onClick' | 'title' | 'disableClickHandler'>,
    iconClassName?: string,
    iconStyle?: CSSProperties,
    // Если ture: использовать CSS классы 'd-inline-block with-icon' для задания vertical align иконки.
    // Если false: использовать CSS класс 'with-icon-flex' для центрирования иконки по вертикали.
    // По умолчанию: false.
    inline?: boolean,
}

// Иконка-кнопка со всплывающей подсказкой при наведении
function IconButton(props: IconButtonProps) {

    const {
        tooltipProps,
        color,
        onClick,
        disabled,
        className,
        iconClassName,
        reusableItemContainerClass,
        style,
        iconStyle,
        inline = false,
        ...otherProps
    } = props

    const wrapperClass: string = clsx(
        'clickable',
        inline ? 'd-inline-block with-icon' : 'with-icon-flex',
        color ? 'link-' + props.color : null,
        disabled ? 'disabled' : null,
        className
    )

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
            onClick(event)
        }
    }

    if (props.tooltip) {
        return (
            <Icon
                tooltipProps={{
                    tag: 'div',
                    ...tooltipProps,
                    className: wrapperClass,
                    disableClickHandler: true,
                    onClick: handleClick,
                    style,
                }}
                className={iconClassName}
                reusableItemContainerClass={clsx(wrapperClass, reusableItemContainerClass)}
                style={iconStyle}
                {...otherProps}
            />
        )
    } else {
        return (
            <div
                className={wrapperClass}
                onClick={handleClick}
                style={style}
            >
                <Icon
                    className={iconClassName}
                    reusableItemContainerClass={clsx(wrapperClass, reusableItemContainerClass)}
                    style={iconStyle}
                    {...otherProps}
                />
            </div>
        )
    }
}

export default withStable<IconButtonProps>(['onClick'], IconButton)
