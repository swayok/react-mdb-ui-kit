import React, {CSSProperties} from 'react'
import {Button} from './Button'
import clsx from 'clsx'

export interface AsyncDataLoadingErrorProps {
    className?: string,
    style?: CSSProperties,
    errorMessage: string,
    retryButtonTitle: string,
    onReload?: () => void,
}

// Ошибка загрузки данных с сервера.
export function AsyncDataLoadingError(props: AsyncDataLoadingErrorProps) {
    const {
        className,
        style,
        errorMessage,
        retryButtonTitle,
        onReload,
    } = props

    return (
        <div
            className={clsx(
                'text-center fs-5 pt-4 pb-4 ps-3 pe-3',
                className
            )}
            style={style}
        >
            <div className="text-center text-danger mb-3">
                {errorMessage}
            </div>
            {onReload && (
                <Button
                    onClick={() => onReload?.()}
                    color="primary"
                >
                    {retryButtonTitle}
                </Button>
            )}
        </div>
    )
}

/** @deprecated */
export default AsyncDataLoadingError
