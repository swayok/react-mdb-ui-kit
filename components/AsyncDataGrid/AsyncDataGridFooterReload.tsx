import {
    mdiRefresh,
    mdiRefreshAuto,
} from '@mdi/js'
import clsx from 'clsx'
import {
    useEffect,
    useRef,
} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import {DataPolling} from '../DataPolling/DataPolling'
import {Icon} from '../Icon/Icon'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AsyncDataGridFooterReloadProps} from './AsyncDataGridTypes'

// Кнопка перезагрузки данных в подвале таблицы.
export function AsyncDataGridFooterReload(props: AsyncDataGridFooterReloadProps) {
    const {
        reload,
        loading,
        drawsCount,
    } = useAsyncDataGridContext()

    const {
        disabled,
        autoReloadMs,
    } = props

    const isDisabled: boolean = !!disabled || loading
    const isAutoReload: boolean = !!autoReloadMs && autoReloadMs > 0 && !disabled

    const onClick = useEventCallback(() => {
        if (!isDisabled && !isAutoReload) {
            reload()
        }
    })

    const autoReloadResolveRef = useRef<() => void | null>(null)

    // Обработчик автообновления данных.
    const onAutoReload = useEventCallback((): Promise<void> => {
        if (!isDisabled) {
            reload(true)
            return new Promise<void>(resolve => {
                autoReloadResolveRef.current = resolve
            })
        }
        return Promise.resolve()
    })

    // Вызывает resolve для Promise автообновления при изменении количества отрисовок.
    useEffect(() => {
        if (autoReloadResolveRef.current) {
            autoReloadResolveRef.current()
            autoReloadResolveRef.current = null
        }
    }, [drawsCount])


    return (
        <div
            className={clsx(
                'page-item',
                isDisabled ? 'disabled' : null
            )}
        >
            {isAutoReload && (
                <DataPolling
                    name="async-data-grid-footer-autoreload"
                    interval={autoReloadMs!}
                    handler={onAutoReload}
                />
            )}
            <div
                className={clsx(
                    'page-link with-icon ms-2 clickable',
                    isDisabled || !!autoReloadResolveRef.current ? 'disabled' : null,
                    isAutoReload ? 'link-green' : undefined
                )}
                onClick={onClick}
            >
                <Icon
                    path={isAutoReload ? mdiRefreshAuto : mdiRefresh}
                    tooltip={isAutoReload ? autoReloadMs!.toString() + ' ms' : undefined}
                />
            </div>
        </div>
    )
}
