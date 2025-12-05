import {
    useEffect,
    useState,
} from 'react'

export interface WindowSize {
    width?: number
    height?: number
}

// Хук для получения размеров окна
export function useWindowSize(): WindowSize {
    const [windowSize,
        setWindowSize] = useState<WindowSize>({
        width: undefined,
        height: undefined,
    })
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        const abortController = new AbortController()
        window.addEventListener(
            'resize',
            handleResize,
            {signal: abortController.signal}
        )
        // Вызываем функцию сразу же, чтобы состояние обновилось при монтаже компонента.
        handleResize()
        return () => {
            abortController.abort()
        }
    }, [])
    return windowSize
}
