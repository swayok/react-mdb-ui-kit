import clsx from 'clsx'
import React from 'react'
import {ProgressBarProps} from './ProgressTypes'

// Индикатор прогресса (внутренний компонент, отображает прогресс в %).
export function ProgressBar(props: ProgressBarProps) {
    const {
        animated,
        children,
        className,
        style,
        currentValue,
        maxValue,
        striped,
        color,
        minValue,
        ...otherProps
    } = props

    const classes = clsx(
        'progress-bar',
        color ? `bg-${color}` : null,
        striped ? 'progress-bar-striped' : null,
        animated ? 'progress-bar-animated' : null,
        className
    )
    const min: number = minValue || 0
    const max: number = maxValue || 100
    const width: number = Math.max(
        0,
        Math.min(
            100,
            Math.round(currentValue / (max - min) * 10000) / 100
        )
    )
    const styles = {
        width: `${width}%`,
        ...style,
    }

    return (
        <div
            className={classes}
            style={styles}
            role="progressbar"
            {...otherProps}
            aria-valuenow={currentValue}
            aria-valuemin={min}
            aria-valuemax={max}
        >
            {children}
        </div>
    )
}

/** @deprecated */
export default ProgressBar
