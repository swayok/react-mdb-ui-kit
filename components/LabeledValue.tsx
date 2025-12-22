import clsx from 'clsx'
import {ReactNode} from 'react'
import {HtmlComponentProps} from '../types'

interface Props extends Omit<HtmlComponentProps<HTMLDivElement>, 'value'> {
    label: string
    // true: обернуть в <span>, false: обернуть в <div>
    inline?: boolean
    // true | string: использовать flexbox для позиционирование содержимого.
    // 'with-icon' - добавить CSS классы 'with-icon-flex gap-1' к контейнеру значения.
    flex?: boolean | 'with-icon'
    // true: без отступа после элемента. При inline=true, всегда noMargin=true.
    noMargin?: boolean
    children?: ReactNode | string
    labelClassName?: string
    valueClassName?: string
    // Обернуть содержимое в круглые скобки.
    wrapInBraces?: boolean
}

// Блок вида "Название: значение" ({label}: {value})
export function LabeledValue(props: Props) {

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
            </InnerTag> <InnerTag
                className={clsx(
                    valueClassName,
                    flex === 'with-icon' ? 'with-icon-flex gap-1' : null
                )}
            >
                {children}
            </InnerTag>{wrapInBraces && ')'}
        </Tag>
    )
}
