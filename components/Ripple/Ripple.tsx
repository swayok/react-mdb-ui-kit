import clsx from 'clsx'
import React, {AllHTMLAttributes, RefObject, useCallback, useEffect, useRef, useState} from 'react'
import RippleWave from './RippleWave'
import {ButtonColors, ReactComponentOrTagName} from '../../types/Common'

export interface RippleProps extends AllHTMLAttributes<HTMLElement> {
    rippleUnbound?: boolean;
    // Центрирование относительно кнопки, а не относительно курсора.
    rippleColor?: ButtonColors;
    minRippleRadius?: number;
    rippleRadius?: number;
    rippleDuration?: number;
    rippleCentered?: boolean;
    rippleTag?: ReactComponentOrTagName;
    noRipple?: boolean;
}

interface RippleWaveStyle {
    left: string,
    top: string,
    height: string,
    width: string,
    transitionDelay: string,
    transitionDuration: string,
    backgroundImage?: string
}

interface DiameterOptions {
    offsetX: number,
    offsetY: number,
    height: number,
    width: number,
}

const GRADIENT = 'rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%'
const DEFAULT_RIPPLE_COLOR = [0, 0, 0]
const HEX_COLOR_LENGTH = 7

// Анимация волны при нажатии кнопки или другого элемента.
function Ripple(props: RippleProps, ref: React.ForwardedRef<HTMLAllCollection>) {
    const [
        rippleWaves,
        setRippleWaves,
    ] = useState<RippleWaveStyle[]>([])

    const [
        isBsColor,
        setIsBsColor,
    ] = useState(false)

    const timeout = useRef<number>(null)
    const refs = getRef(ref, useRef<HTMLAllCollection>(null))

    const {
        className,
        rippleTag: Tag = 'div',
        rippleCentered = false,
        rippleDuration = 500,
        rippleUnbound = false,
        // Если <=0, то вычисляется автоматически.
        minRippleRadius = 0,
        rippleRadius = 0,
        rippleColor = 'dark',
        children,
        onClick,
        noRipple,
        ...otherProps
    } = props

    // Останавливаем таймер при демонтаже.
    useEffect(
        () => () => window.clearTimeout(timeout.current ?? undefined),
        []
    )

    const classes = noRipple
        ? className
        : clsx(
            'ripple',
            'ripple-surface',
            rippleUnbound ? 'ripple-surface-unbound' : 'ripple-surface-inbound',
            isBsColor ? `ripple-surface-${rippleColor}` : null,
            className
        )

    // Цвет волны.
    const setupColor = useCallback((): string | undefined => {
        const isBootstrapColor = (
            rippleColor
            && rippleColor.toLowerCase().match(/^(#[0-9A-F]{3,6}|transparent$|rgb\()/i) === null
        )

        if (isBootstrapColor) {
            setIsBsColor(true)
            return undefined
        } else {
            const rgbValue = colorToRGB(rippleColor).join(',')
            const gradientImage = GRADIENT.replace(/\{\{color}}/g, rgbValue)
            return `radial-gradient(circle, ${gradientImage})`
        }
    }, [rippleColor])

    // Нажатие на элемент: запуск проигрывания анимации волны.
    const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!noRipple) {
            const styles = getStyles(
                e,
                refs.localRef.current as (HTMLElement | null),
                rippleRadius,
                minRippleRadius,
                rippleDuration,
                rippleCentered
            )
            styles.backgroundImage = setupColor()

            setRippleWaves(rippleStyles => rippleStyles.concat(styles))

            // Удаляем все <RippleWave> по окончании анимации последней запущенной волны.
            window.clearTimeout(timeout.current ?? undefined)
            timeout.current = window.setTimeout(() => {
                setRippleWaves([])
            }, rippleDuration + 100)
        }
        onClick?.(e)
    }, [noRipple, onClick, rippleRadius, rippleCentered, rippleDuration, setupColor])

    return (
        <Tag
            className={classes}
            onClick={handleClick}
            ref={refs.elementRef}
            {...otherProps}
        >
            {children}
            {!noRipple && (
                <div className="ripple-waves-wrapper">
                    {rippleWaves.map((style: RippleWaveStyle, i: number) => (
                        <RippleWave key={i} style={style}/>
                    ))}
                </div>
            )}
        </Tag>
    )
}

export default React.memo(React.forwardRef<HTMLAllCollection, RippleProps>(Ripple))

function colorToRGB(color?: string): number[] {
    if (!color) {
        return DEFAULT_RIPPLE_COLOR
    }
    if (color.toLowerCase() === 'transparent') {
        return DEFAULT_RIPPLE_COLOR
    }
    if (color.startsWith('#')) {
        return hexToRgb(color)
    }
    if (color.startsWith('rgb')) {
        return rgbaToRgb(color)
    }

    return DEFAULT_RIPPLE_COLOR
}

function hexToRgb(color: string): number[] {
    const isShortHex = color.length < HEX_COLOR_LENGTH

    if (isShortHex) {
        color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    }

    return [
        parseInt(color.substring(1, 3), 16),
        parseInt(color.substring(3, 5), 16),
        parseInt(color.substring(5, 7), 16),
    ]
}

function rgbaToRgb(color: string): number[] {
    const matches = color.match(/[.\d]+/g)
    if (!matches) {
        return DEFAULT_RIPPLE_COLOR
    }
    const ret = matches.map((a: string) => +Number(a))
    ret.length = 3
    return ret
}

function getDiameter(data: DiameterOptions) {
    const {offsetX, offsetY, height, width} = data

    const top = offsetY <= height / 2
    const left = offsetX <= width / 2
    const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2)

    const positionCenter = offsetY === height / 2 && offsetX === width / 2

    const quadrant = {
        first: top && !left,
        second: top && left,
        third: !top && left,
        fourth: !top && !left,
    }

    const getCorner = {
        topLeft: pythagorean(offsetX, offsetY),
        topRight: pythagorean(width - offsetX, offsetY),
        bottomLeft: pythagorean(offsetX, height - offsetY),
        bottomRight: pythagorean(width - offsetX, height - offsetY),
    }

    let diameter = 0

    if (positionCenter || quadrant.fourth) {
        diameter = getCorner.topLeft
    } else if (quadrant.third) {
        diameter = getCorner.topRight
    } else if (quadrant.second) {
        diameter = getCorner.bottomRight
    } else if (quadrant.first) {
        diameter = getCorner.bottomLeft
    }
    return diameter * 2
}

function getStyles(
    e: React.MouseEvent,
    element: HTMLElement | null,
    rippleRadius: number,
    minRippleRadius: number,
    rippleDuration: number,
    rippleCentered: boolean
): RippleWaveStyle {
    const itemRect = (element ?? e.target as HTMLElement).getBoundingClientRect()

    const offsetX = e.clientX - itemRect.left
    const offsetY = e.clientY - itemRect.top
    const height = itemRect.height
    const width = itemRect.width

    const diameterOptions: DiameterOptions = {
        offsetX: rippleCentered ? height / 2 : offsetX,
        offsetY: rippleCentered ? width / 2 : offsetY,
        height,
        width,
    }

    const opacity = {
        delay: rippleDuration && rippleDuration * 0.5,
        duration: rippleDuration && rippleDuration - rippleDuration * 0.5,
    }

    const diameter = getDiameter(diameterOptions)
    const normalizedRadius = Math.max(
        minRippleRadius,
        rippleRadius > 0 ? rippleRadius : diameter / 2
    )

    return {
        left: rippleCentered ? `${width / 2 - normalizedRadius}px` : `${offsetX - normalizedRadius}px`,
        top: rippleCentered ? `${height / 2 - normalizedRadius}px` : `${offsetY - normalizedRadius}px`,
        height: `${normalizedRadius * 2}px`,
        width: `${normalizedRadius * 2}px`,
        transitionDelay: `0s, ${opacity.delay}ms`,
        transitionDuration: `${rippleDuration}ms, ${opacity.duration}ms`,
    }
}

/**
 * Нормализация ref.
 */
function getRef(
    ref: React.ForwardedRef<HTMLAllCollection>,
    fallbackRef: RefObject<HTMLAllCollection | null>
): {
    elementRef: ((instance: HTMLAllCollection | null) => void) | RefObject<HTMLAllCollection | null>,
    localRef: RefObject<HTMLAllCollection | null>,
} {
    let elementRef
    let localRef = fallbackRef
    if (!ref) {
        elementRef = fallbackRef
    } else if (typeof ref === 'function') {
        elementRef = (newRef: HTMLAllCollection | null) => {
            ref(newRef)
            fallbackRef.current = newRef
        }
    } else {
        elementRef = localRef = ref
    }
    return {
        elementRef,
        localRef,
    }
}
