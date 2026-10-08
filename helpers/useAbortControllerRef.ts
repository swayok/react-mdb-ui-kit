import {
    type RefObject,
    useEffect,
    useRef,
} from 'react'

// Хук для создания ссылки на AbortController.
// При демонтаже компонента AbortController будет применен для отмены действий.
export function useAbortControllerRef(): RefObject<AbortController | null> {
    const ref = useRef<AbortController>(null)

    useEffect(() => () => {
        if (ref.current && !ref.current.signal.aborted) {
            ref.current.abort()
            ref.current = null
        }
    }, [])

    return ref
}
