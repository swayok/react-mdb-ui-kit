import clsx from 'clsx'
import {
    IconProps,
    Icon,
} from '../Icon/Icon'
import {InputGroupIconProps} from './InputTypes'

// Иконка для вставки в <InputGroup>.
export function InputGroupIcon(props: InputGroupIconProps) {
    const {
        // Icon props:
        path,
        color,
        rotate,
        vertical,
        spin,
        size,
        label,
        reuse,
        reusableItemContainerClassName,
        onClick,
        iconClassName,
        // Tooltip props:
        tooltipProps,
        tooltipToggleTag,
        tooltip,
        tooltipToggleClassName,
        tooltipDisableClickHandler,
        tooltipTextClassName,
        tooltipMaxWidth,
        tooltipPlacement,
        centerIconInTooltip,
        // Wrapper props:
        className,
        noBorder,
        small,
        large,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const classes = clsx(
        'input-group-text with-icon-flex',
        noBorder ? 'border-0' : null,
        small && !large ? 'input-group-text-sm' : null,
        !small && large ? 'input-group-text-lg' : null,
        className
    )

    const iconProps: IconProps = {
        path,
        color,
        rotate,
        vertical,
        spin,
        size,
        label,
        reuse,
        className: iconClassName,
        reusableItemContainerClassName,
        onClick,
        // Tooltip props:
        tooltipProps,
        tooltipToggleTag,
        tooltip,
        tooltipToggleClassName,
        tooltipDisableClickHandler,
        tooltipTextClassName,
        tooltipMaxWidth,
        tooltipPlacement,
        centerIconInTooltip,
    }

    return (
        <Tag
            className={classes}
            {...otherProps}
        >
            <Icon {...iconProps} />
        </Tag>
    )
}
