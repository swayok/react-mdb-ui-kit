import {
    useCallback, useRef,
} from 'react'
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect'

type PickFunction<T extends Fn> = (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
) => ReturnType<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (this: any, ...args: any[]) => any

/**
 * Стабильная функция с доступом к актуальному состоянию компонента.
 * Для использования в обработчиках событий типа <button onClick={handler}/>.
 */
export function useEventCallback<T extends Fn>(fn: T): T {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        if (!(typeof fn === 'function')) {
            console.error(
                `useEvent expected parameter is a function, got ${typeof fn}`
            )
        }
    }

    const handlerRef = useRef(fn)
    useIsomorphicLayoutEffect(() => {
        handlerRef.current = fn
    }, [fn])

    return useCallback<PickFunction<T>>((...args) => {
        const fn = handlerRef.current
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return fn(...args)
    }, []) as T
}

