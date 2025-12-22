import clsx from 'clsx'
import {
    Children,
    isValidElement,
} from 'react'
import {ProgressBar} from './ProgressBar'
import {ProgressProps} from './ProgressTypes'

// Индикатор прогресса (внешний компонент).
// Должен содержать компонент <ProgressBar>, другие компоненты запрещены.
export function Progress(props: ProgressProps) {
    const {
        className,
        children,
        height,
        style,
        ...otherProps
    } = props

    return (
        <div
            className={clsx('progress', className)}
            style={{
                height,
                ...style,
            }}
            {...otherProps}
        >
            {Children.map(children, child => {
                if (!isValidElement(child) || child.type !== ProgressBar) {
                    console.error('Progress component only allows ProgressBar as child')
                    return
                } else {
                    return child
                }
            })}
        </div>
    )
}
