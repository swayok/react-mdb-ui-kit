import clsx from 'clsx'
import {
    SvgIconInfo,
    TextColors,
} from '../types'
import {
    IconProps,
    MDIIcon,
} from './MDIIcon'
import {
    SvgIcon,
    SvgIconProps,
} from './SvgIcon'
import {Tooltip} from './Tooltip/Tooltip'
import {DefaultTooltipProps} from './Tooltip/TooltipTypes'

export interface AppIconProps extends Omit<IconProps, 'path' | 'color'> {
    path: IconProps['path'] | SvgIconInfo
    color?: TextColors
    label?: string | number
    tooltip?: string
    tooltipProps?: Omit<DefaultTooltipProps, 'title'>
    centerIconInTooltip?: boolean
    tooltipMaxWidth?: number
}

// SVG-иконка с дополнительными функциями (всплывающая подсказка, подпись).
export function Icon(props: AppIconProps) {
    const {
        className,
        label,
        tooltip,
        tooltipProps = {},
        centerIconInTooltip,
        tooltipMaxWidth,
        path,
        color,
        ...otherProps
    } = props
    let icon
    const colorClassName = color ? 'text-' + color : null
    if (typeof path == 'string') {
        const modifiedClassName = clsx(
            'mdi-icon',
            props.rotate !== undefined ? 'mdi-rotatable' : null,
            colorClassName,
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
            title,
            description,
            spin,
            ...customIconProps
        } = otherProps
        icon = (
            <SvgIcon
                iconInfo={path}
                className={clsx(
                    className,
                    colorClassName
                )}
                {...customIconProps as Partial<SvgIconProps>}
            />
        )
    }
    if (tooltip) {
        const {
            className: tooltipWrapperClassName,
            tag: tooltipTag = 'span',
            disableClickHandler: tooltipDisableClickHandler = true,
            tooltipMaxWidth: tooltipMaxWidthFromProps = tooltipMaxWidth,
            ...otherTooltipProps
        } = tooltipProps
        const commonTooltipProps: Partial<DefaultTooltipProps> = {
            title: tooltip,
            disableClickHandler: tooltipDisableClickHandler,
            tooltipMaxWidth: tooltipMaxWidthFromProps,
        }
        if (label !== undefined) {
            return (
                <Tooltip
                    tag="div"
                    {...otherTooltipProps}
                    className={clsx(
                        'mdi-icon-wrapper d-flex flex-row align-items-center justify-content-start',
                        tooltipWrapperClassName
                    )}
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
                    tag={tooltipTag}
                    className={clsx(
                        centerIconInTooltip ? 'd-flex flex-row align-items-center' : null,
                        tooltipWrapperClassName
                    )}
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

/** @deprecated */
export default Icon
