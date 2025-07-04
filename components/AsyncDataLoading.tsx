import React, {CSSProperties} from 'react'
import clsx from 'clsx'
import AsyncDataLoadingError from './AsyncDataLoadingError'
import Loading from './Loading'
import withStable from '../helpers/withStable'
import FadeSwitch from './FadeSwitch'

export interface AsyncDataLoadingProps<DataType = undefined> {
    loading: boolean | null;
    loadingLabel?: string | React.ReactNode;
    // Отложить отображение индикатора загрузки на указанное кол-во миллисекунд.
    loadingShowDelay?: number | null;
    error?: boolean | number;
    errorMessage: string;
    onReload?: () => unknown;
    retryButtonTitle: string;
    showContent?: boolean;
    className?: string;
    style?: CSSProperties;
    loadedData?: DataType | null,
    render: (loadedData: DataType) => React.ReactNode;
}

// Показывает индикатор загрузки данных пока не загрузятся данные.
// Если загрузка не удалась (error), то отображает ошибку (errorMessage)
// с кнопкой перезагрузки данных (retryButtonTitle, onReload).
function AsyncDataLoading<DataType = undefined>(props: AsyncDataLoadingProps<DataType>) {

    // Можно ли показывать контент?
    const canShowContent = (): boolean => props.showContent ?? props.showContent === undefined

    // Отрисовка контента.
    const renderContents = () => {
        if (props.error) {
            return (
                <AsyncDataLoadingError
                    onReload={props.onReload}
                    errorMessage={props.errorMessage}
                    retryButtonTitle={props.retryButtonTitle}
                    style={{position: 'relative', zIndex: 2}}
                />
            )
        } else if (props.loading === false && !props.error && canShowContent()) {
            return props.render(props.loadedData as DataType) ?? <div/>
        } else {
            return <div/>
        }
    }

    let key: string = 'content'
    if (props.error) {
        key = 'error'
    } else if (props.loading || !canShowContent()) {
        key = 'loading'
    }

    return (
        <div
            className={clsx(
                'async-data-loading-container',
                props.loading ? 'is-loading' : 'is-loaded',
                props.className
            )}
            style={props.style}
        >
            <Loading
                loading={!!props.loading && !props.error}
                showDelay={props.loadingShowDelay}
                label={props.loadingLabel}
                floating
            />
            <FadeSwitch transitionKey={key}>
                {renderContents()}
            </FadeSwitch>
        </div>
    )
}

export default withStable<AsyncDataLoadingProps>(['onReload'], AsyncDataLoading) as typeof AsyncDataLoading
