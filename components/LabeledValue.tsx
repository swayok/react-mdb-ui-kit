import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'

interface Props extends Omit<AllHTMLAttributes<HTMLDivElement>, 'value'> {
    label: string;
    // true: обернуть в <span>, false: обернуть в <div>
    inline?: boolean
    flex?: boolean
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
        flex,
        noMargin,
        className,
        labelClassName,
        valueClassName,
        wrapInBraces,
        children,
        ...otherProps
    } = props

    const Tag = inline ? 'span' : 'div'
    const InnerTag = flex ? 'div' : 'span'

    return (
        <Tag
            className={clsx(
                noMargin || inline ? null : 'mb-1',
                flex ? 'd-flex flex-row align-items-center justify-content-start gap-1' : null,
                className
            )}
            {...otherProps}
        >
            {wrapInBraces && '('}<InnerTag className={clsx(labelClassName, 'text-muted')}>
                {label}:
            </InnerTag> <InnerTag className={valueClassName}>
                {children}
            </InnerTag>{wrapInBraces && ')'}
        </Tag>
    )
}
