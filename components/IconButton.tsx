import clsx from 'clsx'
import {
    CSSProperties,
    MouseEvent,
} from 'react'
import {useEventCallback} from '../helpers/useEventCallback'
import {TextColors} from '../types'
import {
    AppIconProps,
    Icon,
} from './Icon'
import {DefaultTooltipProps} from './Tooltip/TooltipTypes'

export interface IconButtonProps extends Omit<AppIconProps, 'onClick'> {
    tooltip?: string
    color?: TextColors | 'link'
    onClick: (event: MouseEvent<HTMLDivElement>) => void
    tooltipProps?: Omit<DefaultTooltipProps, 'onClick' | 'title' | 'disableClickHandler'>
    iconClassName?: string
    iconStyle?: CSSProperties
    // Если ture: использовать CSS классы 'd-inline-block with-icon' для задания vertical align иконки.
    // Если false: использовать CSS класс 'with-icon-flex' для центрирования иконки по вертикали.
    // По умолчанию: false.
    inline?: boolean
}

// Иконка-кнопка со всплывающей подсказкой при наведении
export function IconButton(props: IconButtonProps) {

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
        color ? 'link-' + color : null,
        disabled ? 'disabled' : null,
        className
    )

    const handleClick = useEventCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (!disabled) {
                onClick(event)
            }
        }
    )

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

/** @deprecated */
export default IconButton
