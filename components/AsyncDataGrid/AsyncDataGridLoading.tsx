import React from 'react'
import Loading from '../Loading'
import AsyncDataLoadingError from '../AsyncDataLoadingError'
import clsx from 'clsx'
import {AsyncDataGridLoadingProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import withStable from '../../helpers/withStable'
import FadeIn from '../FadeIn'

// Индикатор загрузки данных для таблицы с сервера.
function AsyncDataGridLoading(props: AsyncDataGridLoadingProps) {

    const {translations} = useAsyncDataGridContext()

    return (
        <>
            <Loading
                loading={props.loading && !props.error}
                overlayFillsParent
                overlayColor="semitransparent-white"
                className="data-grid-loading"
                label={translations.loading}
                showDelay={props.showDelay === undefined ? 2000 : props.showDelay}
            />
            <FadeIn visible={!!props.error}>
                <AsyncDataLoadingError
                    onReload={props.onReload}
                    errorMessage={props.errorMessage || translations.loading_error}
                    retryButtonTitle={props.retryButtonTitle || translations.retry_loading}
                    className={clsx(
                        'data-grid-error',
                        props.fill ? 'data-grid-error data-grid-error-fill-container' : null
                    )}
                />
            </FadeIn>
        </>
    )
}

export default withStable<AsyncDataGridLoadingProps>(
    ['onReload'],
    AsyncDataGridLoading
)
