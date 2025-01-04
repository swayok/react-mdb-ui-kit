import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'
import ProgressBar from './ProgressBar'

export interface ProgressProps extends AllHTMLAttributes<HTMLDivElement> {
    // Высота полосы
    height?: number | string;
}

// Индикатор прогресса (внешний компонент).
// Должен содержать компонент <ProgressBar>, другие компоненты запрещены.
function Progress(props: ProgressProps, ref: React.ForwardedRef<HTMLDivElement>) {
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
            ref={ref}
            style={{
                height,
                ...style,
            }}
            {...otherProps}
        >
            {React.Children.map(children, child => {
                if (!React.isValidElement(child) || child.type !== ProgressBar) {
                    console.error('Progress component only allows ProgressBar as child')
                    return
                } else {
                    return child
                }
            })}
        </div>
    )
}

export default React.memo(React.forwardRef<HTMLDivElement, ProgressProps>(Progress))
