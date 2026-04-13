import clsx from 'clsx'
import {
    type CSSProperties,
    type ReactNode,
} from 'react'
import {AsyncDataLoadingError} from './AsyncDataLoadingError'
import {FadeSwitch} from '../Animation/FadeSwitch'
import {Loading} from './Loading'

export interface AsyncDataLoadingProps<DataType = undefined> {
    loading: boolean | null
    loadingLabel?: string | ReactNode
    // Отложить отображение индикатора загрузки на указанное кол-во миллисекунд.
    loadingShowDelay?: number | null
    error?: boolean | number
    errorMessage: string
    onReload?: () => unknown
    retryButtonTitle: string
    showContent?: boolean
    className?: string
    style?: CSSProperties
    loadedData?: DataType | null
    render: (loadedData: DataType) => ReactNode
}

// Показывает индикатор загрузки данных пока не загрузятся данные.
// Если загрузка не удалась (error), то отображает ошибку (errorMessage)
// с кнопкой перезагрузки данных (retryButtonTitle, onReload).
export function AsyncDataLoading<DataType = undefined>(props: AsyncDataLoadingProps<DataType>) {

    const {
        loading,
        loadingLabel,
        loadingShowDelay,
        error,
        errorMessage,
        onReload,
        retryButtonTitle,
        showContent,
        className,
        style,
        loadedData,
        render,
    } = props

    // Можно ли показывать контент?
    const canShowContent = (): boolean => showContent ?? showContent === undefined

    // Отрисовка контента.
    const renderContents = () => {
        if (error) {
            return (
                <AsyncDataLoadingError
                    onReload={onReload}
                    errorMessage={errorMessage}
                    retryButtonTitle={retryButtonTitle}
                    style={{position: 'relative', zIndex: 2}}
                />
            )
        } else if (loading === false && !error && canShowContent()) {
            return render(loadedData as DataType) ?? <div />
        } else {
            return <div />
        }
    }

    let key: string = 'content'
    if (error) {
        key = 'error'
    } else if (loading || !canShowContent()) {
        key = 'loading'
    }

    return (
        <div
            className={clsx(
                'async-data-loading-container',
                loading ? 'is-loading' : 'is-loaded',
                className
            )}
            style={style}
        >
            <Loading
                loading={!!loading && !error}
                showDelay={loadingShowDelay}
                label={loadingLabel}
                floating
            />
            <FadeSwitch transitionKey={key}>
                {renderContents()}
            </FadeSwitch>
        </div>
    )
}
