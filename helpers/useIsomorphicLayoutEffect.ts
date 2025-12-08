import {
    useEffect,
    useLayoutEffect,
} from 'react'

/**
 * Хук, который обеспечивает то же поведение, что и useLayoutEffect в React,
 * в зависимости от среды (сервер/браузер).
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined'
    ? useLayoutEffect
    : useEffect
