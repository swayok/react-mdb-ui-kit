import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'

interface Props extends Omit<AllHTMLAttributes<HTMLDivElement>, 'value'> {
    label: string;
    // true: обернуть в <span>, false: обернуть в <div>
    inline?: boolean
    // true: без отступа после элемента. При inline=true, всегда noMargin=true.
    noMargin?: boolean;
    children?: React.ReactNode | string;
    labelClassName?: string;
    valueClassName?: string;
    // Обернуть содержимое в круглые скобки.
    wrapInBraces?: boolean;
}

// Блок вида "Название: значение" ({label}: {value})
export default function LabeledValue(props: Props) {

    const {
        label,
        inline,
        noMargin,
        className,
        labelClassName,
        valueClassName,
        wrapInBraces,
        children,
        ...otherProps
    } = props

    const Tag = inline ? 'span' : 'div'

    return (
        <Tag
            className={clsx(
                noMargin || inline ? null : 'mb-1',
                className
            )}
            {...otherProps}
        >
            {wrapInBraces && '('}<span className={clsx(labelClassName, 'text-muted')}>
                {label}:
            </span> <span className={valueClassName}>
                {children}
            </span>{wrapInBraces && ')'}
        </Tag>
    )
}
