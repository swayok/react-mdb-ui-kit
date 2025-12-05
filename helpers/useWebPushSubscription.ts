import {useEffect} from 'react'
import {WebPushService} from '../services/WebPushService'

// Регистрация скрипта Service Worker и контроль подписки на Web PUSH уведомления.
export function useWebPushSubscription(userId?: null | number | string): void {

    // Регистрация скрипта Service Worker.
    useEffect(() => {
        if (WebPushService.enabled) {
            void WebPushService.current.registerServiceProvider()
        }
    }, [])

    // Контроль подписки на уведомления в зависимости от наличия авторизованного пользователя.
    useEffect(() => {
        if (!WebPushService.enabled) {
            return
        }
        if (userId) {
            if (!WebPushService.current.subscription) {
                void WebPushService.current.subscribe()
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
