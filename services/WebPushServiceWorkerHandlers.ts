// export empty type because of tsc --isolatedModules flag
export type {}
declare const self: ServiceWorkerGlobalScope

export interface NotificationPayload extends NotificationOptions {
    title?: string
    image?: string
}

export interface WebPushServiceWorkerDefaults {
    title: string
    icon: string
    redirectUrl: string
}

let defaults: WebPushServiceWorkerDefaults = {
    title: '',
    icon: '/img/android-chrome-192x192.png',
    redirectUrl: 'https://' + self.location.host,
}

// Задать значения по умолчанию для service worker.
export function setWebPushServiceWorkerDefaults(newDefaults: Partial<WebPushServiceWorkerDefaults>): void {
    defaults = {
        ...defaults,
        ...newDefaults,
    }
}

// Получить значения по умолчанию для service worker.
export function getWebPushServiceWorkerDefaults(): WebPushServiceWorkerDefaults {
    return defaults
}

// Обработка PUSH уведомления.
export function handlePushNotification(event: PushEvent) {
    let message: NotificationPayload | null
    try {
        message = event.data?.json()
    } catch (_error) {
        const body = event.data?.text()
        message = body ? {body} : null
    }
    console.log('[Service Worker] PUSH received', message)
    if (message) {
        if (!message.icon) {
            message.icon = defaults.icon
        }
        event.waitUntil(
            self.registration.showNotification(
                message.title ?? defaults.title,
                message
            )
        )
    }
}

// Обработка нажатия на уведомление.
export function handleWebPushNotificationClick(event: NotificationEvent) {
    event.notification.close()
    if ('url' in event.notification.data && event.notification.data.url) {
        // Открываем целевую страницу.
        const url: string = event.notification.data.url
        event.waitUntil(
            self.clients.matchAll({type: 'window', includeUncontrolled: true})
                .then(clients => {
                    /*
                     * Проверить, есть ли уже открытое окно/вкладка с целевым URL.
                     * Если есть, то показать её.
                     */
                    for (const client of clients) {
                        if (client.url === url && 'focus' in client) {
                            // Не возвращать Promise из client.focus() и не использовать await!
                            void client.focus()
                            return
                        }
                    }
                    // Открыть новое окно/вкладку, если не найдена вкладка с целевым URL.
                    if (self.clients.openWindow) {
                        // Не возвращать Promise из openWindow() и не использовать await! Виснет вкладка.
                        void self.clients.openWindow(url)
                        return
                    }
                })
        )
    } else {
        // Открываем первую доступную вкладку
        event.waitUntil(
            self.clients.matchAll({type: 'window', includeUncontrolled: true})
                .then(clients => {
                    /*
                     * Проверить, есть ли уже открытое окно/вкладка сайта (любой URL).
                     * Если есть, то показать её.
                     */
                    for (const client of clients) {
                        if ('focus' in client) {
                            // Не возвращать Promise из client.focus() и не использовать await!
                            void client.focus()
                            return
                        }
                    }
                    // Открыть новое окно/вкладку, если не открыто ни одной вкладки сайта.
                    if (self.clients.openWindow) {
                        // Не возвращать Promise из openWindow() и не использовать await! Виснет вкладка.
                        void self.clients.openWindow(defaults.redirectUrl)
                        return
                    }
                })
        )
    }
}
