import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'
import {BackgroundColors} from '../../types/Common'

export interface ProgressBarProps extends AllHTMLAttributes<HTMLDivElement> {
    // Анимация.
    animated?: boolean;
    // Цвет.
    color?: BackgroundColors;
    // С полосками?
    striped?: boolean;
    // Текущее значение (при minValue=0 и maxValue=100 - аналог процента).
    currentValue: number;
    // Минимальное значение (по умолчанию: 0).
    minValue?: number;
    // Максимальное значение (по умолчанию: 100).
    maxValue?: number;
}

// Индикатор прогресса (внутренний компонент, отображает прогресс в %).
function ProgressBar(props: ProgressBarProps, ref: React.ForwardedRef<HTMLDivElement>) {
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
            ref={ref}
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

export default React.memo(React.forwardRef<HTMLDivElement, ProgressBarProps>(ProgressBar))
