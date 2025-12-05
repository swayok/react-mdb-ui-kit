// Функция, которая будет вызвана при совершении события.
export type SubscriptionCallbackFn<Payload = undefined> = (payload?: Payload) => unknown

// Функция отписки от события.
export type CancelSubscriptionFn = () => void

interface Subscription<Payload = undefined> {
    callback: SubscriptionCallbackFn<Payload>
    unsubscribeAfterEmit?: CancelSubscriptionFn
}

/**
 * Обработчик одного произвольного события.
 * Позволяет подписаться на безымянное событие и вызвать все обработчики при запуске события.
 *
 * @see useCustomEventEmitter()
 */
export class CustomEventEmitter<Payload = undefined> {

    // Подписки.
    private subscriptions: Subscription<Payload>[] = []

    /**
     * Подписаться на событие.
     * Возвращает функцию для отписки от события.
     */
    subscribe = (callback: SubscriptionCallbackFn<Payload>, once: boolean = false): CancelSubscriptionFn => {
        const unsubscribe = () => {
            this.subscriptions = this.subscriptions.filter(
                subscription => subscription.callback !== callback
            )
        }
        this.subscriptions.push({
            callback,
            unsubscribeAfterEmit: once ? unsubscribe : undefined,
        })

        return unsubscribe
    }

    // Подписаться на событие только один раз.
    once = (
        callback: SubscriptionCallbackFn<Payload>
    ): CancelSubscriptionFn => this.subscribe(callback, true)

    // Вызвать все обработчики события.
    emit = (payload?: Payload) => {
        this.subscriptions.slice().forEach(subscription => {
            subscription.callback(payload)
            subscription.unsubscribeAfterEmit?.()
        })
    }

    // Удалить все обработчики событий
    reset = () => {
        this.subscriptions = []
    }
}
