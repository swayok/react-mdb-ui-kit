import {
    useEffect,
    useRef,
} from 'react'
import {
    WebsocketEventData,
    WebsocketEventHandler,
    WebSocketService,
} from '../../services/WebSocketService'

// Свойства компонента WebSocketEventsHandler.
export interface WebSocketEventsHandlerProps<EventData extends WebsocketEventData = WebsocketEventData> {
    subscriptionId: string
    event: string
    handler: WebsocketEventHandler<EventData>
    // Список каналов, на которые нужно подписаться.
    // Если null: подписаться на все каналы.
    // Можно использовать псевдонимы каналов,
    // указанные при вызове WebSocketConnector (channels).
    channels?: string[] | null
}

// React компонент для регистрации и остановки обработки событий указанного типа передаваемых через websocket.
// Регистрация происходит при монтаже компонента, остановка - при демонтаже.
// Важно: Свойство channels должно быть стабильным, чтобы не запускать переподключения постоянно.
// Плохо: <WebSocketEventsHandlerBase channels={['public']} />, ['public'] нужно вынести в константу вне компонента.
export function WebSocketEventsHandler<
    EventData extends WebsocketEventData = WebsocketEventData,
>(props: WebSocketEventsHandlerProps<EventData>): null {

    const {
        subscriptionId,
        event,
        handler: propsHandler,
        channels,
    } = props

    const handlerRef = useRef(propsHandler)
    handlerRef.current = propsHandler

    useEffect(
        () => WebSocketService.subscribe<EventData>(
            subscriptionId,
            event,
            handlerRef,
            channels
        ),
        [subscriptionId, event, channels]
    )
    return null
}
