import {ApiRequestService} from './ApiRequestService'
import {ApiResponseData} from '../types'

// Настройки WebPushService.
export interface WebPushServiceConfig {
    enabled: boolean
    // Публичный ключ VAPID.
    publicKey: string
    /*
     * Базовый URL к Web PUSH API на сервере относительно
     * базового API URL в ApiRequestService.
     * Пример: /v1/web-push
     */
    baseApiUrl?: string
    /*
     * URL к JS файлу Service Worker.
     * Пример: /js/frontend/sw.js
     */
    serviceWorkerScriptUrl?: string
}

// Сервис для работы с Web PUSH уведомлениями.
export class WebPushService {

    // Текущий экземпляр.
    private static instance: WebPushService | null = null

    // Настройки.
    private readonly config: Required<WebPushServiceConfig> = {
        enabled: false,
        publicKey: '',
        baseApiUrl: '/web-push',
        serviceWorkerScriptUrl: '/service-worker.js',
    }

    // Регистрация службы.
    private workerRegistration: ServiceWorkerRegistration | null = null

    // Подписка.
    private activeSubscription: PushSubscription | null = null

    // Ключ доступа для отписки.
    private unsubscribeAccessKey: string | null = null

    // API URL.
    private urls = {
        subscribe: '/subscribe',
        unsubscribe: '/unsubscribe',
    }

    // Конструктор.
    constructor(config: Partial<WebPushServiceConfig>) {
        this.config = {
            ...this.config,
            ...config,
        }
    }

    // Создание экземпляра сервиса и сохранение его в WebPushService.instance.
    static configure(config: Partial<WebPushServiceConfig>) {
        if (!this.instance) {
            this.instance = new WebPushService(config)
        } else if (
            this.instance.config.publicKey !== config.publicKey
            || this.instance.config.serviceWorkerScriptUrl !== config.serviceWorkerScriptUrl
            || this.instance.config.baseApiUrl !== config.baseApiUrl
        ) {
            void this.instance.unsubscribe()
            this.instance = new WebPushService(config)
        }
        // Ни одной настройки не изменено: игнорируем.
    }

    // Получить текущий экземпляр WebPushService.
    static get current(): WebPushService {
        if (!this.instance) {
            throw new Error('WebPushService not configured')
        }
        return this.instance
    }

    // Включено?
    static get enabled(): boolean {
        return this.instance?.config.enabled ?? false
    }

    // Получить endpoint текущей подписки.
    static get endpoint(): string | null {
        return this.instance?.subscription?.endpoint ?? null
    }

    // Регистрация скрипта Service Worker.
    async registerServiceProvider(): Promise<boolean> {
        if (!this.config.enabled) {
            return false
        }
        if (!('serviceWorker' in navigator)) {
            console.warn('[WebPushService] navigator.serviceWorker not defined.')
            return false
        }
        if (this.workerRegistration) {
            return true
        }
        try {
            // Регистрируем Service Worker.
            this.workerRegistration = await navigator.serviceWorker.register(
                this.config.serviceWorkerScriptUrl
            )
            return true
        } catch (error) {
            console.error(
                '[WebPushService] Service Worker registration error: ',
                error
            )
            // TODO: add report to Sentry.
            return false
        }
    }

    // Регистрация сервиса и подписка на уведомления.
    async subscribe(): Promise<boolean> {
        if (!this.config.enabled) {
            return false
        }
        if (!('serviceWorker' in navigator)) {
            console.warn('[WebPushService] navigator.serviceWorker not defined.')
            return false
        }
        if (!this.workerRegistration) {
            console.error('[WebPushService] Service provider not registered.')
            return false
        }
        if (!this.config.publicKey || this.config.publicKey.length === 0) {
            console.warn('[WebPushService] VAPID Public key not defined.')
            return false
        }
        if (this.activeSubscription) {
            console.warn('[WebPushService] Already subscribed.')
            return true
        }

        // Ожидаем активации Service Worker.
        await navigator.serviceWorker.ready

        try {
            // Подписываемся на PUSH уведомления.
            this.activeSubscription = await this.workerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.config.publicKey,
            })
        } catch (error) {
            console.error(
                '[WebPushService] Failed to get subscription from pushManager: ',
                error
            )
            // TODO: add report to Sentry.
            return false
        }

        // Подписка в API.
        const subscriptionInfo: PushSubscriptionJSON = this.activeSubscription.toJSON()
        return ApiRequestService.post<SubscribeResponseData>(this.getFullApiUrl('subscribe'), {
            endpoint: subscriptionInfo.endpoint,
            expirationTime: subscriptionInfo.expirationTime ?? null,
            key: subscriptionInfo.keys?.p256dh ?? '',
            token: subscriptionInfo.keys?.auth ?? '',
        })
            .then(response => {
                console.log('[WebPushService] Subscription success.')
                this.unsubscribeAccessKey = response.data.accessKey
                return true
            })
            .catch(error => {
                console.error('[WebPushService] Subscription error: ', error)
                // TODO: add report to Sentry.
                return false
            })
    }

    // Отписка от уведомлений.
    async unsubscribe(): Promise<boolean> {
        if (!this.config.enabled) {
            return false
        }
        if (!this.activeSubscription) {
            console.error('[WebPushService] Not subscribed.')
            return false
        }
        return ApiRequestService.post(this.getFullApiUrl('unsubscribe'), {
            endpoint: this.activeSubscription.endpoint,
            accessKey: this.unsubscribeAccessKey,
        })
            .then(() => {
                this.activeSubscription = null
                console.log('[WebPushService] Unsubscribed')
                return true
            })
            .catch(error => {
                console.error('[WebPushService] Failed to unsubscribe: ', error)
                // TODO: add report to Sentry.
                return false
            })
    }

    // Получить активную подписку.
    get subscription(): PushSubscription | null {
        return this.activeSubscription
    }

    // Получить полный URL к API.
    private getFullApiUrl(type: keyof typeof this.urls): string {
        return this.config.baseApiUrl + this.urls[type]
    }
}

// Данные ответа на запрос на подписку на Web PUSH уведомления.
interface SubscribeResponseData extends ApiResponseData {
    accessKey: string
}
