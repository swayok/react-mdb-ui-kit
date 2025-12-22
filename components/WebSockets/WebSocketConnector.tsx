import {
    ReactNode,
    useEffect,
} from 'react'
import {WebSocketService} from '../../services/WebSocketService'
import {AnyObject} from '../../types'

// Свойства компонента WebSocketConnector.
export interface WebSocketConnectorProps {
    key: string
    userId: number
    authToken?: string | null
    // Ключ: псевдоним канала, значение: полное название канала.
    channels: AnyObject<string>
    children?: ReactNode | ReactNode[]
}

// Компонент для контроля соединения с WebSocket каналом пользователя.
// Соединение происходит при монтаже компонента.
// Отсоединение - при демонтаже.
// Можно размещать <WebSocketEventsHandler> внутри этого компонента для удобства.
// Примечание: аналогичного смысла React-хук работает достаточно криво.
export function WebSocketConnector(props: WebSocketConnectorProps) {

    // Открыть/закрыть соединение.
    useEffect(() => {
        WebSocketService.connect(props.userId, props.authToken ?? null, props.channels)
        return () => {
            WebSocketService.disconnect()
        }
    }, [])

    return (
        <>
            {props.children}
        </>
    )
}
