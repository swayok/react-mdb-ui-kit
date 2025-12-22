import {
    ReactNode,
    useCallback,
    useEffect,
    useEffectEvent,
    useState,
} from 'react'

export interface CountdownProps {
    // Секунд до 0.
    seconds: number
    // Вызывается при достижении 0.
    onZero?: () => void
    // Как часто вызывать onTick.
    tick?: 'second' | 'minute' | 'hour' | 'day'
    // Вызывается на каждый tick.
    onTick?: (seconds: number) => void
    // Замена отображения.
    formatter?: ((seconds: number) => string | ReactNode)
    // Дополнительные CSS классы для <span> элемента.
    className?: string
    // Перезапуск отсчета при достижении 0.
    // Если число, то оно будет использовано для задания нового значения seconds.
    restartOnZero?: boolean | number
}

// Обратный отсчет.
// Перезапуск извне не предусмотрен: используйте key для пересоздания компонента.
export function Countdown(props: CountdownProps) {

    const {
        seconds: startingSeconds,
        onZero,
        tick,
        onTick,
        formatter: propsFormatter,
        className,
        restartOnZero,
    } = props

    const [
        seconds,
        setSeconds,
    ] = useState<number>(startingSeconds)

    // Возвращает true пока значение не опустилось до 0.
    const tickHandler = useEffectEvent((): boolean => {
        let remainingSeconds: number = seconds
        if (seconds === 0) {
            if (restartOnZero) {
                remainingSeconds = startingSeconds + 1
            } else {
                return false
            }
        }
        remainingSeconds--
        setSeconds(Math.max(0, remainingSeconds))
        if (remainingSeconds === 1 && onZero) {
            window.setTimeout(onZero, 1000)
        }
        if (tick && onTick) {
            switch (tick) {
                case 'second':
                    onTick(remainingSeconds)
                    break
                case 'minute':
                    if (remainingSeconds % 60 === 0) {
                        onTick(remainingSeconds)
                    }
                    break
                case 'hour':
                    if (remainingSeconds % 3600 === 0) {
                        onTick(remainingSeconds)
                    }
                    break
                case 'day':
                    if (remainingSeconds % 86400 === 0) {
                        onTick(remainingSeconds)
                    }
                    break
            }
        }
        return true
    })

    // Запускаем отсчет при монтировании или при изменении startingSeconds.
    useEffect(() => {
        if (startingSeconds === 0) {
            return
        }
        const interval = window.setInterval(() => {
            if (!tickHandler()) {
                window.clearInterval(interval)
            }
        }, 1000)
        return () => {
            window.clearInterval(interval)
        }
    }, [startingSeconds])

    const formatter = useCallback(
        (seconds: number): string | ReactNode => {
            if (propsFormatter) {
                return propsFormatter(seconds)
            } else {
                return seconds
            }
        },
        [propsFormatter]
    )

    return (
        <span className={className}>
            {formatter(seconds)}
        </span>
    )
}
