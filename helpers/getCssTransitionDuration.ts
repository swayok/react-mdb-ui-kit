// Проверка наличия CSS-анимации для свойства у HTML элемента.
// Возвращает длительность анимации для указанного свойства в миллисекундах.
// Если анимации нет, возвращается 0.
// Если анимация есть, но по какой-то причине не удается получить значение
// длительности анимации, то возвращается defaultDuration.
export function getCssTransitionDuration(
    element: HTMLElement,
    property: string,
    defaultDuration: number = 300
): number {
    const stylesMap = element.computedStyleMap()
    if (!stylesMap.has('transition-duration') || !stylesMap.has('transition-property')) {
        return 0
    }
    // Проверка наличия анимации для указанного свойства.
    const transitionProperties: string[] = (stylesMap.get('transition-property') as CSSStyleValue)
        .toString()
        .split(/\s*,\s*/)

    if (
        !transitionProperties.includes('all')
        && !transitionProperties.includes(property)
    ) {
        // Нет анимации по указанному свойству или по всем свойствам.
        return 0
    }
    const transitionDuration = stylesMap.getAll('transition-duration') as CSSUnitValue[]
    let propIndex = transitionProperties.indexOf(property)
    if (propIndex < 0) {
        // Ищем index для свойства 'all'.
        propIndex = transitionProperties.indexOf('all')
        if (propIndex < 0) {
            // Быть такого не может, но перестрахуемся.
            return defaultDuration
        }
    }
    return transitionDuration[propIndex] && transitionDuration[propIndex].value > 0
        ? getDurationInMs(transitionDuration[propIndex])
        : 0
}

function getDurationInMs(transitionDuration: CSSUnitValue): number {
    const multiplier: number = transitionDuration.unit === 'ms' ? 1 : 1000
    return transitionDuration.value * multiplier
}
