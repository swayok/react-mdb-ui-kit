import {useEffect} from 'react'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import withStable from '../helpers/withStable'

// Сервис для контроля регулярно выполняющихся действий.
export default class PollingService {

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
        handler: () => Promise<unknown>,
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
        handler: () => Promise<unknown>
    ): void {
        handler()
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
}

export type DataPollingProps = {
    condition: boolean,
    name: string,
    interval: number,
    handler: () => Promise<unknown>,
    immediate?: boolean
}

// React компонент для регистрации и остановки регулярно выполняющегося действия.
// Регистрация происходит если condition === true.
// Остановка - если condition === false или при демонтаже компонента.
function DataPollingComponent(props: DataPollingProps): null {
    useEffect(() => {
        if (props.condition) {
            PollingService.startPolling(
                props.name,
                props.interval,
                props.handler,
                !!props.immediate
            )
        } else {
            PollingService.stopPolling(props.name)
        }
    }, [props.condition])
    // Остановить, если компонент демонтирован.
    useEffect(() => () => {
        PollingService.stopPolling(props.name)
    }, [])
    return null
}

// Оборачиваем в withStable для уменьшения перерисовок.
export const DataPolling = withStable<DataPollingProps>(
    ['handler'],
    DataPollingComponent
)
