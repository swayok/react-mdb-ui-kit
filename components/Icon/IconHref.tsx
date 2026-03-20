import clsx from 'clsx'
import {
    type AnchorHTMLAttributes,
    type CSSProperties,
    type MouseEvent,
    type ReactNode,
} from 'react'
import {Link} from 'react-router-dom'
import type {
    AnyObject,
    ReactComponentOrTagName,
    SvgIconInfo,
    TextColors,
} from '../../types'
import {Icon} from './Icon'
import type {MdiIconProps} from './MDIIcon'
import {Tooltip} from '../Tooltip/Tooltip'
import type {DefaultTooltipProps} from '../Tooltip/TooltipTypes'

export type IconHrefTooltipProps = Pick<
    DefaultTooltipProps,
    'tooltipPlacement' | 'tooltipClassName' | 'tooltipStyle'
>

export interface IconHrefProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    external?: boolean
    color?: TextColors | 'link'
    tooltip?: string | ReactNode
    tooltipProps?: IconHrefTooltipProps
    iconProps?: Omit<MdiIconProps, 'onClick' | 'path' | 'size' | 'className'>
    path: string | SvgIconInfo
    reuse?: MdiIconProps['reuse']
    size?: number | null
    iconClassName?: string
    iconStyle?: CSSProperties
    disabled?: boolean
    visible?: boolean
    // Если ture: использовать CSS классы 'd-inline-block with-icon' для задания vertical align иконки.
    // Если false: использовать CSS класс 'with-icon-flex' для центрирования иконки по вертикали.
    // По умолчанию: false.
    inline?: boolean
}

// Ссылка в виде иконки без подписи
export function IconHref(props: IconHrefProps) {

    const {
        tooltip,
        tooltipProps,
        color,
        disabled,
        iconProps,
        iconClassName,
        iconStyle,
        className,
        onClick,
        path,
        size,
        href,
        target,
        external,
        visible,
        children,
        inline = false,
        reuse,
        ...linkProps
    } = props

    // Если указан target или external, то ссылку считаем внешней (не должна идти через роутер)
    const Tag: ReactComponentOrTagName = external ? 'a' : Link
    const urlProps: AnyObject = Tag === 'a'
        ? {href}
        : {to: href}
    if (target) {
        urlProps.target = target
    }

    if (visible === false) {
        return null
    }

    return (
        <Tooltip
            tag={Tag}
            {...urlProps}
            title={tooltip}
            className={clsx(
                inline ? 'd-inline-block with-icon' : 'with-icon-flex',
                color ? 'link-' + props.color : null,
                disabled ? 'disabled' : null,
                className
            )}
            {...tooltipProps}
            tooltipDisableClickHandler
            {...linkProps}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                if (disabled) {
                    event.preventDefault()
                }
                onClick?.(event)
            }}
        >
            <Icon
                size={size}
                reuse={reuse}
                {...iconProps}
                className={iconClassName}
                style={iconStyle}
                path={path}
            />
            {children}
        </Tooltip>
    )
}
