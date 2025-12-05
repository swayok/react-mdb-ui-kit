import clsx from 'clsx'
import {
    AppIconProps,
    Icon,
} from '../Icon'
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
        reusableItemContainerClass,
        onClick,
        iconClassName,
        tooltip,
        tooltipProps,
        tooltipMaxWidth,
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

    const iconProps: AppIconProps = {
        path,
        color,
        rotate,
        vertical,
        spin,
        size,
        label,
        reuse,
        reusableItemContainerClass,
        tooltip,
        tooltipProps,
        tooltipMaxWidth,
        centerIconInTooltip,
        className: iconClassName,
        onClick,
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
