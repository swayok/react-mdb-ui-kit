import clsx from 'clsx'
import {
    CSSProperties,
    MouseEvent,
} from 'react'
import {useEventCallback} from '../helpers/useEventCallback'
import {TextColors} from '../types'
import {
    IconProps,
    Icon,
} from './Icon'

export interface IconButtonProps extends Omit<
    IconProps,
    'onClick' | 'tooltipDisableClickHandler' | 'tooltipToggleClassName' | 'tooltipProps'
> {
    tooltip?: string
    color?: TextColors | 'link'
    onClick?: (event: MouseEvent<HTMLDivElement>) => void
    tooltipProps?: Omit<IconProps['tooltipProps'], 'onClick'>
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
        color,
        onClick,
        disabled,
        className,
        iconClassName,
        reusableItemContainerClassName,
        style,
        iconStyle,
        inline = false,
        // Tooltip props:
        tooltip,
        tooltipToggleTag = 'div',
        tooltipMaxWidth,
        tooltipTextClassName,
        tooltipPlacement,
        centerIconInTooltip,
        tooltipProps,
        ...otherProps
    } = props

    const wrapperClassName: string = clsx(
        'clickable',
        inline ? 'd-inline-block with-icon' : 'with-icon-flex',
        color ? 'link-' + color : null,
        disabled ? 'disabled' : null,
        className
    )

    const handleClick = useEventCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (!disabled) {
                onClick?.(event)
            }
        }
    )

    if (tooltip) {
        const iconTooltipProps: Partial<IconProps> = {
            tooltip,
            tooltipToggleTag,
            tooltipMaxWidth,
            tooltipTextClassName,
            tooltipPlacement,
            centerIconInTooltip,
        }
        return (
            <Icon
                {...iconTooltipProps}
                tooltipToggleClassName={wrapperClassName}
                tooltipDisableClickHandler
                tooltipProps={{
                    ...tooltipProps,
                    onClick: handleClick,
                    style,
                }}
                className={iconClassName}
                reusableItemContainerClassName={clsx(
                    wrapperClassName,
                    reusableItemContainerClassName
                )}
                style={iconStyle}
                {...otherProps}
            />
        )
    } else {
        return (
            <div
                className={wrapperClassName}
                onClick={handleClick}
                style={style}
            >
                <Icon
                    className={iconClassName}
                    reusableItemContainerClassName={clsx(wrapperClassName, reusableItemContainerClassName)}
                    style={iconStyle}
                    {...otherProps}
                />
            </div>
        )
    }
}

/** @deprecated */
export default IconButton
