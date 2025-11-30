import React from 'react'
import clsx from 'clsx'

export interface SectionDividerProps {
    label?: string | null | React.ReactNode
    labelClassName?: string
    // Color of the divider line.
    color?: 'default' | 'darker' | 'lighter'
    margins?: 'normal' | 'large' | 'small' | 'none' | string
    className?: string
    style?: React.CSSProperties
}

// Разделитель с подписью.
export function SectionDivider(props: SectionDividerProps) {

    let margins: string = ''
    switch (props.margins) {
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
            margins = props.margins ?? 'mt-3 mb-3'
            break
    }

    const noLabel: boolean = (
        !props.label
        || (
            typeof props.label ==='string'
            && props.label.trim().length === 0
        )
    )

    return (
        <div
            className={clsx(
                'section-divider',
                (!props.color || props.color === 'default') ? null : props.color,
                margins,
                props.className
            )}
            style={props.style}
        >
            {!noLabel && (
                <span className={props.labelClassName}>
                    {props.label}
                </span>
            )}
        </div>
    )
}

/** @deprecated */
export default SectionDivider
