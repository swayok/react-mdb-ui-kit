import {useEffect} from 'react'
import {WebPushService} from '../services/WebPushService'

interface UseWebPushSubscriptionHookCallbacks {
    onServiceWorkerError?: (error: unknown) => void
    onSubscriptionDecision?: (serId: number | string, granted: boolean) => void
}

// Регистрация скрипта Service Worker и контроль подписки на Web PUSH уведомления.
export function useWebPushSubscription(
    userId?: null | number | string,
    callbacks?: UseWebPushSubscriptionHookCallbacks
): void {

    const {
        onServiceWorkerError = () => {
        },
        onSubscriptionDecision = () => {
        },
    } = callbacks ?? {}

    // Регистрация скрипта Service Worker.
    useEffect(() => {
        if (WebPushService.enabled) {
            WebPushService.current.registerServiceProvider()
                .catch(onServiceWorkerError)
        }
    }, [])

    // Контроль подписки на уведомления в зависимости от наличия авторизованного пользователя.
    useEffect(() => {
        if (!WebPushService.enabled) {
            return
        }
        if (userId) {
            if (!WebPushService.current.subscription) {
                WebPushService.current.subscribe()
                    .then(granted => onSubscriptionDecision(userId, granted))
                    .catch(() => {
                    })
            }
        }
        return () => {
            // Отписка при изменении ID пользователя.
            if (WebPushService.current.subscription) {
                void WebPushService.current.unsubscribe()
            }
        }
    }, [userId])
}
