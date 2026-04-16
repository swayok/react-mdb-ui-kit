import type {CSSProperties} from 'react'
import type {ButtonColors} from '../../types'
import {Button} from '../Button/Button'

export interface AsyncDataLoadingErrorProps {
    className?: string
    textClassName?: string
    buttonColor?: ButtonColors
    style?: CSSProperties
    errorMessage: string
    retryButtonTitle: string
    onReload?: () => void
}

// Ошибка загрузки данных с сервера.
export function AsyncDataLoadingError(props: AsyncDataLoadingErrorProps) {
    const {
        className = 'text-center py-4 px-3',
        textClassName = 'text-center text-danger fs-5 mb-3',
        buttonColor = 'primary',
        style,
        errorMessage,
        retryButtonTitle,
        onReload,
    } = props

    return (
        <div
            className={className}
            style={style}
        >
            <div className={textClassName}>
                {errorMessage}
            </div>
            {onReload && (
                <Button
                    onClick={() => onReload?.()}
                    color={buttonColor}
                >
                    {retryButtonTitle}
                </Button>
            )}
        </div>
    )
}
