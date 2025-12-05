import {
    useEffect,
    useMemo,
} from 'react'
import {CustomEventEmitter} from './CustomEventEmitter'

// Получить CustomEventEmitter для компонента.
export function useCustomEventEmitter<Payload = undefined>(): CustomEventEmitter<Payload> {

    const emitter = useMemo(() => new CustomEventEmitter<Payload>(), [])

    // Сброс всех подписок при демонтаже компонента.
    useEffect(() => () => emitter.reset(), [])

    return emitter
}
