import {
    useEffect,
    useEffectEvent,
} from 'react'
import {
    PollingService,
    type PollingServiceHandlerFn,
} from '../../services/PollingService'

// Свойства компонента DataPolling.
export interface DataPollingProps {
    condition?: boolean
    name: string
    interval: number
    handler: PollingServiceHandlerFn
    immediate?: boolean
}

// React компонент для регистрации и остановки регулярно выполняющегося действия.
// Регистрация происходит если condition === true.
// Остановка - если condition === false или при демонтаже компонента.
export function DataPolling(props: DataPollingProps): null {

    const {
        condition = true,
        name,
        interval,
        handler,
        immediate,
    } = props

    const startPolling = useEffectEvent(
        () => PollingService.startPolling(
            name,
            interval,
            handler,
            !!immediate
        )
    )

    useEffect(() => {
        if (condition) {
            startPolling()
        } else {
            PollingService.stopPolling(name)
        }
    }, [condition])

    // Остановить, если компонент демонтирован.
    useEffect(() => () => {
        PollingService.stopPolling(name)
    }, [])

    return null
}
