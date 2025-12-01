import clsx from 'clsx'
import {AsyncDataGridLoadingProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import {AsyncDataLoadingError} from '../AsyncDataLoadingError'
import {FadeIn} from '../FadeIn'
import {Loading} from '../Loading'
import {useAsyncDataGridContext} from './AsyncDataGridContext'

// Индикатор загрузки данных для таблицы с сервера.
export function AsyncDataGridLoading(props: AsyncDataGridLoadingProps) {

    const {
        loading,
        retryButtonTitle,
        error,
        errorMessage,
        fill,
        onReload,
        showDelay,
        errorClassName,
        errorStyle,
    } = props

    const {translations} = useAsyncDataGridContext()

    return (
        <>
            <Loading
                loading={loading && !error}
                overlayFillsParent
                overlayColor="semitransparent-white"
                className="data-grid-loading"
                label={translations.loading}
                showDelay={showDelay === undefined ? 2000 : showDelay}
            />
            <FadeIn visible={!!error}>
                <AsyncDataLoadingError
                    onReload={onReload}
                    errorMessage={errorMessage || translations.loading_error}
                    retryButtonTitle={retryButtonTitle || translations.retry_loading}
                    className={clsx(
                        'data-grid-error',
                        fill ? 'data-grid-error data-grid-error-fill-container' : null,
                        errorClassName
                    )}
                    style={errorStyle}
                />
            </FadeIn>
        </>
    )
}
