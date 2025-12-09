import {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {TooltipProps} from './TooltipTypes'
import {TooltipWithTitle} from './TooltipWithTitle'

// Всплывающая подсказка.
export function Tooltip<InjectedComponentProps extends object = HtmlComponentProps>(
    props: MergedComponentProps<TooltipProps, InjectedComponentProps>
) {
    // Оптимизация на случай если title не указан.
    // В TooltipWithTitle используется много хуков, которые не нужны, когда нет title.
    if (!props.title) {
        const {
            children,
            tag: Tag = 'div',
            placement,
            title,
            disableClickHandler,
            disableHover,
            // Свойства для подсказки.
            tooltipClassName,
            tooltipTextClassName,
            tooltipStyle,
            tooltipMaxWidth,
            tooltipOffset,
            tooltipRole,
            ...otherProps
        } = props
        return (
            <Tag
                {...otherProps}
            >
                {children}
            </Tag>
        )
    }

    const {
        title,
        ...otherProps
    } = props

    return (
        <TooltipWithTitle
            title={title}
            {...otherProps}
        />
    )
}

/** @deprecated */
export default Tooltip
