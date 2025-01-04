import clsx from 'clsx'
import React, {HTMLProps, useEffect, useState} from 'react'

// Отыгрывание анимации "Волна".
function RippleWave(props: HTMLProps<HTMLDivElement>) {
    const [isActive, setIsActive] = useState(false)

    const rippleClasses: string = clsx(
        'ripple-wave',
        isActive ? 'active' : null
    )

    useEffect(() => {
        const secondTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
            setIsActive(true)
        }, 50)

        return () => {
            clearTimeout(secondTimer)
        }
    }, [])

    return (
        <div className={rippleClasses} {...props}/>
    )
}

export default React.memo(RippleWave)
