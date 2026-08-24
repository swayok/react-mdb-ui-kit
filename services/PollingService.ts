import type {AnyObject} from '../types'

export type PollingServiceHandlerFn = (
    // Дополнительные настройки запроса.
    requestConfig: RequestInit
) => Promise<unknown>

export type VisibilityChangeCallbackFn = (visible: boolean) => void

// Сервис для контроля регулярно выполняющихся действий.
export abstract class PollingService {

    static timeouts: AnyObject<number> = {}
    static fails: AnyObject<number> = {}
    // Работа с видимостью страницы.
    // Если страница скрыта, то не нужно запускать выполнение функций.
    static isVisibilityChangeHandlerInitiated: boolean = false
    static isPageVisible: boolean = true
    // Интервал попыток запуска функций при скрытой странице.
    static invisibilityPollingInterval: number = 3000

    // Запуск выполнения функции handle с именем name каждые interval миллисекунд.
    // Если функция отрабатывает ошибкой, то интервал увеличивается (interval * fails_count).
    // Таким образом не будет спама на сервер или еще куда-то, если функция не работает.
    // Счетчик fails_count сбрасывается при первом же успешном выполнении.
    static startPolling(
        // Имя функции (используется для остановки).
        name: string,
        // Частота запуска.
        interval: number,
        // Функция, которую нужно запускать.
        handler: PollingServiceHandlerFn,
        // Запустить сразу же или через interval?
        immediate: boolean = false
    ): void {
        if (this.timeouts[name]) {
            console.log('[Polling] ignored: ' + name)
            return
        }
        console.log('[Polling] started: ' + name)
        this.fails[name] = 0
        if (immediate) {
            this.pollingCallback(name, interval, handler)
        }
        this.timeouts[name] = window.setTimeout(
            () => this.pollingCallback(name, interval, handler),
            interval
        )
        this.initPageVisibilityChangeHandler()
    }

    // Остановка выполнения функции name.
    static stopPolling(name: string): void {
        this.clearPollingTimeout(name, true)
    }

    // Остановка всех функций.
    static stopAll(): void {
        for (const key in this.timeouts) {
            this.stopPolling(key)
        }
    }

    // Удаление тайм-аута (остановка выполнения функции name).
    private static clearPollingTimeout(name: string, isStopped: boolean = false): void {
        if (this.timeouts[name]) {
            window.clearTimeout(this.timeouts[name])
            delete this.timeouts[name]
            if (isStopped) {
                console.log('[Polling] ended: ' + name)
            }
        }
    }

    // Обработка результата выполнения функции name и запуск её еще раз.
    private static pollingCallback(
        name: string,
        interval: number,
        handler: PollingServiceHandlerFn
    ): void {
        if (!this.isPageVisible) {
            // Откладываем выполнение функции, пока страница не станет видимой.
            // При этом снижаем интервал опроса this.invisibilityPollingInterval.
            // В этом случае функция запуститься вскоре после того как страница станет видимой.
            this.timeouts[name] = window.setTimeout(
                () => this.pollingCallback(name, interval, handler),
                this.invisibilityPollingInterval
            )
            return
        }
        handler({
            keepalive: false,
            headers: {
                'Cache-Control': 'no-cache',
                'X-Is-Polling': 'true',
            },
        })
            .then(() => {
                this.clearPollingTimeout(name)
                this.fails[name] = 0
                this.timeouts[name] = window.setTimeout(
                    () => this.pollingCallback(name, interval, handler),
                    interval
                )
            })
            .catch(() => {
                this.clearPollingTimeout(name)
                this.fails[name] = (this.fails[name] || 0) + 1
                this.timeouts[name] = window.setTimeout(
                    () => this.pollingCallback(name, interval, handler),
                    interval * (this.fails[name] + 1)
                )
            })
    }

    // Инициализация обработчика изменения видимости страницы.
    private static initPageVisibilityChangeHandler() {
        if (this.isVisibilityChangeHandlerInitiated) {
            return
        }
        this.isVisibilityChangeHandlerInitiated = true
        const handleVisibilityChange = () => {
            this.isPageVisible = document.visibilityState === 'visible'
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
    }
}
