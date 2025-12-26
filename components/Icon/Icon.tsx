import clsx from 'clsx'
import {
    SvgIconInfo,
    TextColors,
} from '../../types'
import {
    MdiIconProps,
    MDIIcon,
} from './MDIIcon'
import {
    SvgIcon,
    SvgIconProps,
} from './SvgIcon'
import {Tooltip} from '../Tooltip/Tooltip'
import {
    DefaultTooltipProps,
    TooltipProps,
} from '../Tooltip/TooltipTypes'
import {ReactNode} from 'react'

export interface IconProps extends Omit<MdiIconProps, 'path' | 'color' | 'title'> {
    path: MdiIconProps['path'] | SvgIconInfo
    color?: TextColors
    label?: string | number
    tooltip?: string | ReactNode
    tooltipProps?: Omit<
        DefaultTooltipProps,
        'title' | 'className' | 'tooltipMaxWidth' | 'tooltipDisableClickHandler'
        | 'tag' | 'tooltipTextClassName' | 'tooltipPlacement'
    >
    tooltipDisableClickHandler?: boolean
    tooltipToggleTag?: string
    tooltipToggleClassName?: string
    centerIconInTooltip?: boolean
    tooltipMaxWidth?: number
    tooltipTextClassName?: string
    tooltipPlacement?: TooltipProps['tooltipPlacement']
}

// SVG-иконка с дополнительными функциями (всплывающая подсказка, подпись).
export function Icon(props: IconProps) {
    const {
        className,
        label,
        tooltip,
        tooltipProps = {},
        centerIconInTooltip,
        tooltipMaxWidth,
        tooltipToggleClassName,
        tooltipDisableClickHandler = true,
        tooltipToggleTag = label ? 'div' : 'span',
        tooltipTextClassName,
        tooltipPlacement,
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
        const commonTooltipProps: Partial<DefaultTooltipProps> = {
            tag: tooltipToggleTag,
            title: tooltip,
            tooltipDisableClickHandler,
            tooltipMaxWidth,
            tooltipTextClassName,
            tooltipPlacement,
        }
        if (label !== undefined) {
            return (
                <Tooltip
                    {...tooltipProps}
                    className={clsx(
                        'mdi-icon-wrapper d-flex flex-row align-items-center justify-content-start',
                        tooltipToggleClassName
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
                    className={clsx(
                        centerIconInTooltip ? 'd-flex flex-row align-items-center' : null,
                        tooltipToggleClassName
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
