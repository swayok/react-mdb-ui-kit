import React, {CSSProperties} from 'react'
import Button from './Button'
import clsx from 'clsx'
import withStable from '../helpers/withStable'

export type AsyncDataLoadingErrorProps = {
    className?: string,
    style?: CSSProperties,
    errorMessage: string,
    retryButtonTitle: string,
    onReload?: () => void,
};

// Ошибка загрузки данных с сервера.
function AsyncDataLoadingError(props: AsyncDataLoadingErrorProps) {
    return (
        <div
            className={clsx('text-center fs-5 pt-4 pb-4 ps-3 pe-3', props.className)}
            style={props.style}
        >
            <div className="text-center text-danger mb-3">
                {props.errorMessage}
            </div>
            {props.onReload && (
                <Button
                    onClick={props.onReload}
                    color="primary"
                >
                    {props.retryButtonTitle}
                </Button>
            )}
        </div>
    )
}

export default withStable<AsyncDataLoadingErrorProps>(['onReload'], AsyncDataLoadingError)
