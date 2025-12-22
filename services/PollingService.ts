import {RefObject} from 'react'
import {AnyObject} from '../types'

export type PollingServiceHandlerFn = () => Promise<unknown>

// Сервис для контроля регулярно выполняющихся действий.
export abstract class PollingService {

    static timeouts: AnyObject<number> = {}
    static fails: AnyObject<number> = {}

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
        handlerRef: RefObject<PollingServiceHandlerFn>,
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
            this.pollingCallback(name, interval, handlerRef)
        }
        this.timeouts[name] = window.setTimeout(
            () => this.pollingCallback(name, interval, handlerRef),
            interval
        )
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
        handlerRef: RefObject<PollingServiceHandlerFn>
    ): void {
        handlerRef.current()
            .then(() => {
                this.clearPollingTimeout(name)
                this.fails[name] = 0
                this.timeouts[name] = window.setTimeout(
                    () => this.pollingCallback(name, interval, handlerRef),
                    interval
                )
            })
            .catch(() => {
                this.clearPollingTimeout(name)
                this.fails[name] = (this.fails[name] || 0) + 1
                this.timeouts[name] = window.setTimeout(
                    () => this.pollingCallback(name, interval, handlerRef),
                    interval * (this.fails[name] + 1)
                )
            })
    }
}
