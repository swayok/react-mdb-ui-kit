import {
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react'
import {withStable} from '../helpers/withStable'

interface Props {
    // Секунд до 0.
    seconds: number,
    // Вызывается при достижении 0.
    onZero?: () => void,
    // Как часто вызывать onTick.
    tick?: 'second' | 'minute' | 'hour' | 'day',
    // Вызывается на каждый tick.
    onTick?: (seconds: number) => void,
    // Замена отображения.
    formatter?: ((seconds: number) => string | ReactNode),
    // Дополнительные CSS классы для <span> элемента.
    className?: string,
    // Перезапуск отсчета при достижении 0.
    // Если число, то оно будет использовано для задания нового значения seconds.
    restartOnZero?: boolean | number,
}

// Обратный отсчет.
function _Countdown(props: Props) {

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

    useEffect(() => {
        if (startingSeconds === 0) {
            return
        }
        let seconds = startingSeconds
        const interval = window.setInterval(() => {
            if (seconds === 0) {
                if (restartOnZero) {
                    seconds = startingSeconds + 1
                } else {
                    return
                }
            }
            seconds--
            setSeconds(Math.max(0, seconds))
            if (seconds === 1 && onZero) {
                window.setTimeout(onZero, 1000)
            }
            if (tick && onTick) {
                switch (tick) {
                    case 'second':
                        onTick(seconds)
                        break
                    case 'minute':
                        if (seconds % 60 === 0) {
                            onTick(seconds)
                        }
                        break
                    case 'hour':
                        if (seconds % 3600 === 0) {
                            onTick(seconds)
                        }
                        break
                    case 'day':
                        if (seconds % 86400 === 0) {
                            onTick(seconds)
                        }
                        break
                }
            }
        }, 1000)
        return () => {
            window.clearInterval(interval)
        }
    }, [onZero, startingSeconds, tick, onTick])

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

export const Countdown = withStable<Props>(['onTick', 'formatter', 'onZero'], _Countdown)

/** @deprecated */
export default Countdown
