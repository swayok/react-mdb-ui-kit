import React, {useCallback, useEffect, useState} from 'react'
import withStable from '../helpers/withStable'

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
    formatter?: ((seconds: number) => string | React.ReactNode),
    // Дополнительные CSS классы для <span> элемента.
    className?: string,
    // Перезапуск отсчета при достижении 0.
    // Если число, то оно будет использовано для задания нового значения seconds.
    restartOnZero?: boolean | number,
}

// Обратный отсчет.
function Countdown(props: Props) {

    const [
        seconds,
        setSeconds,
    ] = useState<number>(props.seconds)

    useEffect(() => {
        if (props.seconds === 0) {
            return
        }
        let seconds = props.seconds
        const interval = window.setInterval(() => {
            if (seconds === 0) {
                if (props.restartOnZero) {
                    seconds = props.seconds + 1
                } else {
                    return
                }
            }
            seconds--
            setSeconds(Math.max(0, seconds))
            if (seconds === 1 && props.onZero) {
                window.setTimeout(props.onZero, 1000)
            }
            if (props.tick && props.onTick) {
                switch (props.tick) {
                    case 'second':
                        props.onTick(seconds)
                        break
                    case 'minute':
                        if (seconds % 60 === 0) {
                            props.onTick(seconds)
                        }
                        break
                    case 'hour':
                        if (seconds % 3600 === 0) {
                            props.onTick(seconds)
                        }
                        break
                    case 'day':
                        if (seconds % 86400 === 0) {
                            props.onTick(seconds)
                        }
                        break
                }
            }
        }, 1000)
        return () => {
            window.clearInterval(interval)
        }
    }, [props.onZero, props.seconds, props.tick, props.onTick])

    const formatter = useCallback((seconds: number): string | React.ReactNode => {
        if (props.formatter) {
            return props.formatter(seconds)
        } else {
            return seconds
        }
    }, [props.formatter])

    return (
        <span className={props.className}>
            {formatter(seconds)}
        </span>
    )
}

export default withStable<Props>(['onTick', 'formatter', 'onZero'], Countdown)
