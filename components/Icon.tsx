import React from 'react'
import clsx from 'clsx'
import Tooltip, {TooltipProps} from './Tooltip'
import MDIIcon, {IconProps} from './MDIIcon'
import {SvgIconInfo} from '../types/Common'
import SvgIcon, {SvgIconProps} from './SvgIcon'

export interface AppIconProps extends Omit<IconProps, 'path'> {
    path: IconProps['path'] | SvgIconInfo
    label?: string | number
    tooltip?: string
    tooltipProps?: Omit<TooltipProps, 'title'>
    centerIconInTooltip?: boolean
    tooltipMaxWidth?: number
}

// SVG-иконка с дополнительными функциями (всплывающая подсказка, подпись).
function Icon(props: AppIconProps) {
    const {
        className,
        label,
        tooltip,
        tooltipProps,
        centerIconInTooltip,
        tooltipMaxWidth,
        path,
        ...otherProps
    } = props
    let icon
    if (typeof path == 'string') {
        const modifiedClassName = clsx(
            'mdi-icon',
            props.rotate !== undefined ? 'mdi-rotatable' : null,
            className
        )
        icon = (
            <MDIIcon
                path={path}
                className={modifiedClassName}
                {...otherProps}
            />
        )
    } else {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            title,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            description,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            spin,
            ...customIconProps
        } = otherProps
        icon = (
            <SvgIcon
                iconInfo={path}
                className={className}
                {...customIconProps as Partial<SvgIconProps>}
            />
        )
    }
    if (tooltip) {
        const {
            className: tooltipWrapperClassName,
            tag: tooltipTag,
            disableClickHandler: tooltipDisableClickHandler,
            tooltipMaxWidth: tooltipMaxWidthFromProps = tooltipMaxWidth,
            ...otherTooltipProps
        } = tooltipProps || {}
        const commonTooltipProps: Partial<TooltipProps> = {
            title: tooltip,
            disableClickHandler: tooltipDisableClickHandler === undefined
                ? true
                : tooltipDisableClickHandler,
            tooltipMaxWidth: tooltipMaxWidthFromProps,
        }
        if (label !== undefined) {
            return (
                <Tooltip
                    tag="div"
                    {...otherTooltipProps}
                    className={clsx('mdi-icon-wrapper d-flex flex-row align-items-center justify-content-start', tooltipWrapperClassName)}
                    {...commonTooltipProps}
                >
                    {icon}
                    <div className="flex-1 ms-1 mdi-icon-label">{label}</div>
                </Tooltip>
            )
        } else {
            return (
                <Tooltip
                    {...tooltipProps}
                    tag={tooltipTag || 'span'}
                    className={clsx(centerIconInTooltip ? 'd-flex flex-row align-items-center' : null, tooltipWrapperClassName)}
                    {...commonTooltipProps}
                >
                    {icon}
                </Tooltip>
            )
        }
    } else {
        if (label !== undefined) {
            return (
                <div className="mdi-icon-wrapper d-flex flex-row align-items-center justify-content-start">
                    {icon}
                    <div className="flex-1 ms-1 mdi-icon-label">{label}</div>
                </div>
            )
        } else {
            return icon
        }
    }
}

export default React.memo(Icon)
