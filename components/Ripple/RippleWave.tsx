import React, {HTMLProps, useEffect, useRef} from 'react'

// Отыгрывание анимации "Волна".
function RippleWave(props: Omit<HTMLProps<HTMLDivElement>, 'ref'>) {

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

export default React.memo(RippleWave)
