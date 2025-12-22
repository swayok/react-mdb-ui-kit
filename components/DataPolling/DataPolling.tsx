import {
    useEffect,
    useRef,
} from 'react'
import {
    PollingService,
    PollingServiceHandlerFn,
} from '../../services/PollingService'

// Свойства компонента DataPolling.
export interface DataPollingProps {
    condition: boolean
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
        condition,
        name,
        interval,
        handler: propsHandler,
        immediate,
    } = props

    const handlerRef = useRef<PollingServiceHandlerFn>(
        propsHandler
    )
    handlerRef.current = propsHandler

    useEffect(() => {
        if (condition) {
            PollingService.startPolling(
                name,
                interval,
                handlerRef,
                !!immediate
            )
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
