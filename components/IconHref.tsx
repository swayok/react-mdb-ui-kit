import React, {AnchorHTMLAttributes} from 'react'
import Icon from './Icon'
import clsx from 'clsx'
import Tooltip, {TooltipProps} from './Tooltip'
import {AnyObject, ReactComponentOrTagName, SvgIconInfo, TextColors} from '../types/Common'
import {Link} from 'react-router-dom'
import withStable from '../helpers/withStable'
import {IconProps} from './MDIIcon'

export interface IconHrefProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string,
    external?: boolean,
    color?: TextColors | 'link',
    tooltip: string,
    tooltipProps?: Pick<TooltipProps, 'placement' | 'options' | 'tooltipClassName' | 'tooltipStyle' | 'containsInteractiveElements'>,
    iconProps?: Omit<IconProps, 'onClick' | 'path' | 'size' | 'className'>,
    path: string | SvgIconInfo,
    size?: number | null,
    iconClassName?: string,
    disabled?: boolean,
    visible?: boolean,
}

// Ссылка в виде иконки без подписи
function IconHref(props: IconHrefProps) {

    const {
        tooltip,
        tooltipProps,
        color,
        disabled,
        iconProps,
        iconClassName,
        className,
        onClick,
        path,
        size,
        href,
        target,
        external,
        visible,
        children,
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
                'with-icon-flex inline-block',
                color ? 'text-' + props.color : null,
                disabled ? 'disabled' : null,
                className
            )}
            {...tooltipProps}
            disableClickHandler
            {...linkProps}
            onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                if (disabled) {
                    event.preventDefault()
                }
                onClick?.(event)
            }}
        >
            <Icon
                size={size}
                {...iconProps}
                className={iconClassName}
                path={path}
            />
            {children}
        </Tooltip>
    )
}

export default withStable<IconHrefProps>(
    ['onClick', 'iconProps', 'tooltipProps'],
    IconHref
)
