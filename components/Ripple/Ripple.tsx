import clsx from 'clsx'
import {
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    getRippleColor,
    getRippleWaveStyles,
} from './rippleHelpers'
import {
    RippleProps,
    RippleWaveStyle,
} from './RippleTypes'
import {RippleWave} from './RippleWave'

// Анимация волны при нажатии кнопки или другого элемента.
export function Ripple(props: RippleProps) {

    const {
        className,
        tag: Tag = 'div',
        centered = false,
        duration = 500,
        unbound = false,
        // Если <=0, то вычисляется автоматически.
        minRadius = 0,
        radius = 0,
        color = 'dark',
        children,
        onClick: propsOnClick,
        noRipple,
        ref: propsRef,
        ...otherProps
    } = props

    const fallbackRef = useRef<HTMLElement>(null)
    const ref = propsRef ?? fallbackRef

    const [
        rippleWaves,
        setRippleWaves,
    ] = useState<RippleWaveStyle[]>([])

    const timeout = useRef<number>(null)
    const onClickRef = useRef<RippleProps['onClick']>(propsOnClick)
    onClickRef.current = propsOnClick

    // Останавливаем таймер при демонтаже.
    useEffect(
        () => () => window.clearTimeout(timeout.current ?? undefined),
        []
    )

    // Фоновая картинка волны, если rippleColor содержит цвет, а не суффикс CSS класса.
    const rippleBgImage: string | null = useMemo(
        () => getRippleColor(color),
        [color]
    )

    // Нажатие на элемент: запуск проигрывания анимации волны.
    const handleClick = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (!noRipple) {
                setRippleWaves(rippleWaves => rippleWaves.concat(
                    getRippleWaveStyles(
                        event,
                        ref.current as HTMLElement,
                        radius,
                        minRadius,
                        duration,
                        centered,
                        rippleBgImage
                    )
                ))

                // Удаляем все <RippleWave> по окончании анимации последней запущенной волны.
                window.clearTimeout(timeout.current ?? undefined)
                timeout.current = window.setTimeout(() => {
                    setRippleWaves([])
                }, duration + 100)
            }
            onClickRef.current?.(event)
        },
        [noRipple, radius, centered, duration, rippleBgImage]
    )

    const classes = noRipple
        ? className
        : clsx(
            'ripple',
            'ripple-surface',
            unbound ? 'ripple-surface-unbound' : 'ripple-surface-inbound',
            rippleBgImage ? null : `ripple-surface-${color}`,
            className
        )

    return (
        <Tag
            className={classes}
            onClick={handleClick}
            ref={ref}
            {...otherProps}
        >
            {children}
            {!noRipple && (
                <div className="ripple-waves-wrapper">
                    {rippleWaves.map((style: RippleWaveStyle, i: number) => (
                        <RippleWave
                            key={i}
                            style={style}
                        />
                    ))}
                </div>
            )}
        </Tag>
    )
}

/** @deprecated */
export default Ripple
