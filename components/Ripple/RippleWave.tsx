import {
    useEffect,
    useRef,
} from 'react'
import {RippleWaveProps} from './RippleTypes'

// Отыгрывание анимации "Волна".
export function RippleWave(props: RippleWaveProps) {

    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!elementRef.current) {
            return
        }
        // Без задержки анимация не отыгрывается.
        setTimeout(() => {
            elementRef.current?.classList.add('active')
        }, 50)
    }, [elementRef.current])

    return (
        <div
            className="ripple-wave"
            ref={elementRef}
            {...props}
        />
    )
}
