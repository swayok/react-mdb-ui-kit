import Echo, {Channel} from 'laravel-echo'
import React, {useEffect} from 'react'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import withStable from 'swayok-react-mdb-ui-kit/helpers/withStable'

type WebSocketServiceAuthInfo = {
    userId: number,
    authToken: string | null,
    channels: AnyObject<string>
}

// Настройки Laravel Echo.
export interface LaravelEchoConfigType {
    broadcaster: 'pusher' | string;
    key?: string;
    wsHost?: string;
    wsPort?: string;
    wssPort?: string | number;
    cluster?: string;
    authEndpoint?: string;
    forceTLS: boolean;
    encrypted: boolean;
    disableStats: boolean;
    enabledTransports: Array<'ws' | 'wss' | string>;
    auth?: {
        headers?: AnyObject<string>,
    }
}

export type WebsocketEventData = AnyObject
export type WebsocketEventHandler<EventData extends WebsocketEventData = WebsocketEventData> = (eventData: EventData) => void
export type WebsocketUnsubscribeHandler = () => void;

type WebsocketSubscription = {
    id: string,
    event: string,
    handler: WebsocketEventHandler,
    channels: string[] | null,
}

// Сервис для работы с web сокетами и уведомлениями через них.
abstract class WebSocketService {

    private static laravelEchoConfig: LaravelEchoConfigType = {
        broadcaster: 'pusher',
        forceTLS: true,
        encrypted: true,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
    }
    private static laravelEcho: Echo<'pusher'> | null = null
    private static authInfo: WebSocketServiceAuthInfo | null = null
    private static isConnected: boolean = false
    private static channels: AnyObject<Channel> = {}
    private static channelAliases: AnyObject<string> = {}
    private static subscriptions: AnyObject<WebsocketSubscription> = {}

    // Настройка Laravel Echo.
    static configure(laravelEchoConfig: LaravelEchoConfigType | null): void {
        if (!this.isValidConfig(laravelEchoConfig)) {
            return
        }
        this.laravelEchoConfig = laravelEchoConfig as LaravelEchoConfigType
        if (this.authInfo) {
            this.connect(
                this.authInfo.userId,
                this.authInfo.authToken,
                this.authInfo.channels
            )
        }
    }

    // Валидация настроек Laravel Echo.
    private static isValidConfig(config: LaravelEchoConfigType | null): boolean {
        return !!(
            config
            && config.key
            && config.wsHost
        )
    }

    // Создание соединения с WebSocket сервером.
    static connect(
        userId: number,
        authToken: string | null,
        channels: AnyObject<string>
    ): Echo<'pusher'> | null {
        this.disconnect()
        try {
            this.authInfo = {
                userId,
                authToken,
                channels,
            }
            if (!this.isValidConfig(this.laravelEchoConfig)) {
                return null
            }
            const laravelEchoConfig: LaravelEchoConfigType = {...this.laravelEchoConfig}
            if (authToken) {
                laravelEchoConfig.auth = {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            } // else: то авторизация не требуется или происходит через cookies.
            // Затыкаем eslint т.к. пакет laravel-echo не экспортирует тип EchoOptions.
            // eslint-disable-next-line
            this.laravelEcho = new Echo<'pusher'>(laravelEchoConfig as any)
            for (const channelAlias in channels) {
                const channelName: string = channels[channelAlias]
                const channel: Channel = this.laravelEcho.private(channelName)
                this.channels[channelName] = channel
                this.channelAliases[channelAlias] = channelName
                console.log(`[WebSocketService] Connected to '${channelName}' channel`)
                // Ловим все события для отладки
                // @ts-ignore
                if (process?.env?.NODE_ENV !== 'production') {
                    console.log('[WebSocketService] Started listening for all subscriptions, events and errors')
                    channel.subscribed(() => {
                        console.log('[WebSocketService] subscription success')
                    })
                    channel.error((status: unknown) => {
                        console.warn('[WebSocketService] error', status)
                    })
                    if ('listenToAll' in channel) {
                        // @ts-ignore - этот метод есть в PusherChannel
                        channel.listenToAll((name: string) => {
                            console.log(`[WebSocketService] New event received: ${name}`)
                        })
                    }
                }
            }
            this.isConnected = true

            // Зарегистрировать все обработчики событий в новом канале
            for (const id in this.subscriptions) {
                this.activateSubscription(this.subscriptions[id])
            }
            return this.laravelEcho
        } catch (e) {
            this.isConnected = false
            console.error('[WebSocketService] Connect exception', e)
            return null
        }
    }

    // Закрытие соединения с WebSocket сервером.
    static disconnect(): void {
        try {
            if (this.laravelEcho) {
                this.laravelEcho.disconnect()
                this.isConnected = false
                console.log('[WebSocketService] Disconnected from Laravel Echo')
                this.laravelEcho = null
                this.channels = {}
                this.channelAliases = {}
            }
        } catch (e) {
            console.error('[WebSocketService] Disconnect exception', e)
        }
    }

    // Подписка на события.
    static subscribe<EventType extends WebsocketEventData = WebsocketEventData>(
        id: string,
        event: string,
        handler: WebsocketEventHandler<EventType>,
        channels?: string[] | null
    ): WebsocketUnsubscribeHandler {
        if (this.subscriptions[id]) {
            console.warn(
                `'[WebSocketService] Failed to create '${id}' subscription: subscription ID already used'`,
                {
                    id,
                    eventName: event,
                    channel: this.subscriptions[id].channels || 'all',
                }
            )
            return () => {
            }
        }
        this.subscriptions[id] = {
            id,
            event,
            handler: handler as WebsocketEventHandler,
            channels: channels || null,
        }
        this.activateSubscription(this.subscriptions[id])
        return () => {
            WebSocketService.unsubscribe(id)
        }
    }

    private static activateSubscription(subscription: WebsocketSubscription): void {
        if (!this.isConnected) {
            return
        }
        try {
            const channelsToListen: AnyObject<Channel>
                = this.getChannelsForSubscription(subscription)
            for (const channelName in channelsToListen) {
                console.log(
                    `[WebSocketService] Created '${subscription.id}' subscription`
                    + ` for '${subscription.event}' events in '${channelName}' channel`
                )
                channelsToListen[channelName].listen(
                    subscription.event,
                    subscription.handler
                )
                channelsToListen[channelName].listenForWhisper(
                    subscription.event,
                    subscription.handler
                )
            }
        } catch (e) {
            console.error('[WebSocketService] Activate subscription exception', e)
        }
    }

    // Отписка от событий.
    static unsubscribe(id: string): void {
        try {
            if (!this.subscriptions[id]) {
                console.log(
                    `[WebSocketService] Failed to unsubscribe ID '${id}': subscription does not exist`
                )
                return
            }
            const subscription: WebsocketSubscription = this.subscriptions[id]
            if (this.isConnected) {
                const channelsToListen: AnyObject<Channel>
                    = this.getChannelsForSubscription(subscription)
                for (const channelName in channelsToListen) {
                    channelsToListen[channelName].stopListening(
                        subscription.event,
                        subscription.handler
                    )
                }
            }
            console.log(
                `[WebSocketService] Unsubscribed '${id}' subscription`,
                {...this.subscriptions[id], handler: undefined}
            )
            delete this.subscriptions[id]
        } catch (e) {
            console.error('[WebSocketService] Unsubscribe exception', e)
        }
    }

    // Получить список каналов для подписки.
    private static getChannelsForSubscription(subscription: WebsocketSubscription): AnyObject<Channel> {
        if (subscription.channels) {
            const channelsToListen: AnyObject<Channel> = {}
            for (let i = 0; i < subscription.channels.length; i++) {
                const channelNameOrAlias: string = subscription.channels[i]
                if (channelNameOrAlias in this.channels) {
                    channelsToListen[subscription.channels[i]] = this.channels[subscription.channels[i]]
                } else if (channelNameOrAlias in this.channelAliases) {
                    const channelName: string = this.channelAliases[channelNameOrAlias]
                    channelsToListen[channelName] = this.channels[channelName]
                } else {
                    console.warn(
                        `[WebSocketService] Cannot subscribe for '${subscription.event}' events`
                        + ` in '${channelNameOrAlias}' channel: unknown channel`
                    )
                }
            }
            return channelsToListen
        } else {
            return this.channels
        }
    }
}

export default WebSocketService

export type WebSocketConnectorProps = {
    key: string,
    userId: number,
    authToken?: string | null,
    // Ключ: псевдоним канала, значение: полное название канала.
    channels: AnyObject<string>,
    children?: React.ReactNode | React.ReactNode[],
}

// Компонент для контроля соединения с WebSocket каналом пользователя.
// Соединение происходит при монтаже компонента.
// Отсоединение - при демонтаже.
// Можно размещать <WebSocketEventsHandler> внутри этого компонента для удобства.
// Примечание: аналогичного смысла React-хук работает достаточно криво.
function WebSocketConnectorComponent(props: WebSocketConnectorProps) {

    // Открыть/закрыть соединение.
    useEffect(() => {
        WebSocketService.connect(props.userId, props.authToken || null, props.channels)
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

export const WebSocketConnector = React.memo(WebSocketConnectorComponent)

export type WebSocketEventsHandlerProps<EventData extends WebsocketEventData = WebsocketEventData> = {
    subscriptionId: string,
    event: string,
    handler: WebsocketEventHandler<EventData>,
    // Список каналов, на которые нужно подписаться.
    // Если null: подписаться на все каналы.
    // Можно использовать псевдонимы каналов, указанные при вызове WebSocketConnector (channels).
    channels?: string[] | null
}

// React компонент для регистрации и остановки обработки событий указанного типа передаваемых через websocket.
// Регистрация происходит при монтаже компонента, остановка - при демонтаже.
// Важно: Свойство channels должно быть стабильным, чтобы не запускать переподключения постоянно.
// Плохо: <WebSocketEventsHandlerBase channels={['public']} />, ['public'] нужно вынести в константу вне компонента.
function WebSocketEventsHandlerBase<
    EventData extends WebsocketEventData = WebsocketEventData
>(props: WebSocketEventsHandlerProps<EventData>): null {
    useEffect(
        () => WebSocketService.subscribe<EventData>(
            props.subscriptionId,
            props.event,
            props.handler,
            props.channels
        ),
        [props.handler, props.subscriptionId, props.event, props.channels]
    )
    return null
}

// Обертка WebSocketEventsHandlerBase для уменьшения количества пересоединений из-за перерисовок.
export const WebSocketEventsHandler = withStable(
    ['handler'],
    WebSocketEventsHandlerBase
) as typeof WebSocketEventsHandlerBase
