import clsx from 'clsx'
import type {
    ReactNode,
    MouseEvent,
} from 'react'
import type {
    HtmlComponentProps,
    TextColors,
} from '../../types'

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
    // Цвет текста для подписи. По умолчанию 'muted'.
    labelColor?: TextColors | null
    valueClassName?: string
    // Обернуть содержимое в круглые скобки.
    wrapInBraces?: boolean
    // Обработчик клика по значению.
    onValueClick?: (e: MouseEvent<HTMLDivElement | HTMLSpanElement>) => void
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
        labelColor = 'muted',
        valueClassName,
        wrapInBraces,
        children,
        onValueClick,
        ...otherProps
    } = props

    const Tag = inline ? 'span' : 'div'
    const InnerTag = flex ? 'div' : 'span'

    const labelClass = clsx(labelClassName, labelColor ? `text-${labelColor}` : null)

    return (
        <Tag
            className={clsx(
                noMargin || inline ? null : 'mb-1',
                flex ? 'd-flex flex-row align-items-center justify-content-start gap-1' : null,
                className
            )}
            {...otherProps}
        >
            {wrapInBraces && '('}<InnerTag className={labelClass}>{label}:</InnerTag> <InnerTag
                className={clsx(
                    valueClassName,
                    flex === 'with-icon' ? 'with-icon-flex gap-1' : null
                )}
                onClick={onValueClick}
            >
                {children}
            </InnerTag>{wrapInBraces && ')'}
        </Tag>
    )
}
