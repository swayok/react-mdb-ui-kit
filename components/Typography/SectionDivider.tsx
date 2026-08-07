import clsx from 'clsx'
import {
    type CSSProperties,
    type ReactNode,
    type RefObject,
} from 'react'

export interface SectionDividerProps {
    label?: string | null | ReactNode
    labelClassName?: string
    // Color of the divider line.
    color?: 'default' | 'darker' | 'lighter'
    margins?: 'normal' | 'large' | 'small' | 'none' | string
    className?: string
    style?: CSSProperties
    ref?: RefObject<HTMLDivElement | null>
}

// Разделитель с подписью.
export function SectionDivider(props: SectionDividerProps) {

    const {
        label,
        labelClassName,
        color,
        margins: propsMargins,
        className,
        style,
        ref,
    } = props

    let margins: string = ''
    switch (propsMargins) {
        case 'none':
            break
        case 'small':
            margins = 'mt-2 mb-2'
            break
        case 'large':
            margins = 'mt-4 mb-4'
            break
        case 'normal':
            margins = 'mt-3 mb-3'
            break
        default:
            margins = propsMargins ?? 'mt-3 mb-3'
            break
    }

    const noLabel: boolean = (
        !label
        || (
            typeof label === 'string'
            && label.trim().length === 0
        )
    )

    return (
        <div
            ref={ref}
            className={clsx(
                'section-divider',
                (!color || color === 'default') ? null : color,
                margins,
                className
            )}
            style={style}
        >
            {!noLabel && (
                <span className={labelClassName}>
                    {label}
                </span>
            )}
        </div>
    )
}
