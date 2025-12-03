import React from 'react'
import {
    RipplePositionAndDimensions,
    RippleWaveStyle,
} from './RippleTypes'

const DEFAULT_RIPPLE_COLOR = [0, 0, 0]
const HEX_COLOR_LENGTH = 7
const GRADIENT = 'rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%'

// Конвертация цвета в RGB.
export function colorToRGB(color?: string): number[] {
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

// Конвертация цвета из HEX (#XXX, #XXXXXX) в RGB.
export function hexToRgb(color: string): number[] {
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

// Конвертация цвета из RGBA в RGB.
export function rgbaToRgb(color: string): number[] {
    const matches = color.match(/[.\d]+/g)
    if (!matches) {
        return DEFAULT_RIPPLE_COLOR
    }
    const ret = matches.map((a: string) => +Number(a))
    ret.length = 3
    return ret
}

// Определение диаметра волны.
export function getRippleDiameter(data: RipplePositionAndDimensions) {
    const {offsetX, offsetY, height, width} = data

    const top = offsetY <= height / 2
    const left = offsetX <= width / 2
    const pythagorean = (
        sideA: number,
        sideB: number
    ) => Math.sqrt((sideA ** 2) + (sideB ** 2))

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

// Стили для волны.
export function getRippleWaveStyles(
    e: React.MouseEvent,
    element: HTMLElement | null,
    radius: number,
    minRadius: number,
    duration: number,
    centered: boolean,
    bgImage: string | null | undefined
): RippleWaveStyle {
    const itemRect = (element ?? e.target as HTMLElement).getBoundingClientRect()

    const offsetX = e.clientX - itemRect.left
    const offsetY = e.clientY - itemRect.top
    const height = itemRect.height
    const width = itemRect.width

    const diameterOptions: RipplePositionAndDimensions = {
        offsetX: centered ? height / 2 : offsetX,
        offsetY: centered ? width / 2 : offsetY,
        height,
        width,
    }

    const opacity = {
        delay: duration && duration * 0.5,
        duration: duration && duration - (duration * 0.5),
    }

    const diameter = getRippleDiameter(diameterOptions)
    const normalizedRadius = Math.max(
        minRadius,
        radius > 0 ? radius : diameter / 2
    )

    return {
        left: centered ? `${(width / 2) - normalizedRadius}px` : `${offsetX - normalizedRadius}px`,
        top: centered ? `${(height / 2) - normalizedRadius}px` : `${offsetY - normalizedRadius}px`,
        height: `${normalizedRadius * 2}px`,
        width: `${normalizedRadius * 2}px`,
        transitionDelay: `0s, ${opacity.delay}ms`,
        transitionDuration: `${duration}ms, ${opacity.duration}ms`,
        backgroundImage: bgImage ?? undefined,
    }
}

// Цвет волны.
// Возвращает null, если используется название цвета для CSS класса ripple-surface-${rippleColor}.
export function getRippleColor(rippleColor: string): string | null {
    const isCssClass: boolean = (
        !!rippleColor
        && rippleColor.toLowerCase().match(/^(#[0-9A-F]{3,6}|transparent$|rgb\()/i) === null
    )

    if (isCssClass) {
        return null
    } else {
        const rgbValue = colorToRGB(rippleColor).join(',')
        const gradientImage = GRADIENT.replace(/\{\{color}}/g, rgbValue)
        return `radial-gradient(circle, ${gradientImage})`
    }
}
