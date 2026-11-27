import clsx from 'clsx'
import {
    type CSSProperties,
    type MouseEvent,
    type ReactNode,
    type Ref,
} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import type {
    AnyObject,
    TextColors,
} from '../../types'
import {
    Icon,
    type IconProps,
    type IconTooltipProps,
} from './Icon'

export type IconButtonTooltipProps = Omit<IconTooltipProps, 'onClick' | 'onMouseDown'>

export interface IconButtonProps extends Omit<
    IconProps,
    'onClick' | 'onMouseDown' | 'ref'
    | 'tooltipDisableClickHandler' | 'tooltipToggleClassName' | 'tooltipProps'
> {
    tooltip?: string | ReactNode
    // Имя кнопки для скринридеров. По умолчанию: tooltip, если это строка.
    'aria-label'?: string
    color?: TextColors | 'link'
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    onMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void
    ref?: Ref<HTMLButtonElement>
    tooltipProps?: IconButtonTooltipProps
    iconClassName?: string
    iconStyle?: CSSProperties
    // Если ture: использовать CSS классы 'd-inline-block with-icon' для задания vertical align иконки.
    // Если false: использовать CSS класс 'with-icon-flex' для центрирования иконки по вертикали.
    // По умолчанию: false.
    inline?: boolean
}

// Иконка-кнопка (<button type="button">) со всплывающей подсказкой при наведении.
// ref, id, tabIndex, role, aria-* и обработчики событий (on*) задаются кнопке,
// остальные свойства - иконке. Это позволяет передавать IconButton как tag в DropdownToggle и т.п.
export function IconButton(props: IconButtonProps) {

    const {
        color,
        onClick,
        onMouseDown,
        disabled,
        className,
        iconClassName,
        style,
        iconStyle,
        inline = false,
        // Tooltip props:
        tooltip,
        'aria-label': ariaLabel = typeof tooltip === 'string' ? tooltip : undefined,
        ref,
        id,
        tabIndex,
        role,
        tooltipToggleTag = 'button',
        tooltipMaxWidth,
        tooltipTextClassName,
        tooltipPlacement,
        centerIconInTooltip,
        tooltipProps,
        ...restProps
    } = props

    const buttonProps: AnyObject = {
        ref,
        id,
        tabIndex,
        role,
        type: 'button',
        'aria-label': ariaLabel,
        // Не атрибут disabled: на отключённой кнопке не срабатывают события мыши и не показывается подсказка.
        'aria-disabled': disabled || undefined,
    }
    const otherProps: AnyObject = {}
    const rest: AnyObject = restProps
    for (const key in rest) {
        if (key.startsWith('aria-') || /^on[A-Z]/.test(key)) {
            buttonProps[key] = rest[key]
        } else {
            otherProps[key] = rest[key]
        }
    }

    const wrapperClassName: string = clsx(
        'button-reset',
        'clickable',
        inline ? 'd-inline-block with-icon' : 'with-icon-flex',
        color ? 'link-' + color : null,
        disabled ? 'disabled' : null,
        className
    )

    const handleClick = useEventCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (!disabled) {
                onClick?.(event)
            }
        }
    )

    const handleMouseDown = useEventCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (!disabled) {
                onMouseDown?.(event)
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
                    tooltipRole: 'label',
                    ...tooltipProps,
                    ...buttonProps,
                    onClick: handleClick,
                    onMouseDown: handleMouseDown,
                    style,
                }}
                className={iconClassName}
                style={iconStyle}
                {...otherProps as IconProps}
            />
        )
    } else {
        return (
            <button
                {...buttonProps}
                className={wrapperClassName}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                style={style}
            >
                <Icon
                    className={iconClassName}
                    style={iconStyle}
                    {...otherProps as IconProps}
                />
            </button>
        )
    }
}
