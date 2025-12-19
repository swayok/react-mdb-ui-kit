import {MiddlewareState} from '@floating-ui/dom'
import {InputDropdownWidthCalculationStrategy} from '../SelectInput/SelectInputTypes'

export interface ApplyDropdownMenuSizeFnInfo extends MiddlewareState {
    availableWidth: number
    availableHeight: number
}

// Применить стили ширины и высоты выпадающего меню.
// Floating-ui middleware: size({apply: info => applyDropdownMenuSize(info, ...)}).
export function applyDropdownMenuSize(
    info: ApplyDropdownMenuSizeFnInfo,
    maxHeight: number | null = null,
    dropdownWidth: InputDropdownWidthCalculationStrategy = 'fit-input',
    dropUpOffset?: number
): void {
    const {
        rects,
        availableHeight,
        elements,
        placement,
    } = info
    switch (dropdownWidth) {
        case 'fit-input':
            elements.floating.style.width = `${rects.reference.width}px`
            break
        case 'fill-container':
            elements.floating.style.width = '100%'
            break
    }
    let height: number = availableHeight
    if (dropUpOffset && placement.startsWith('top')) {
        height -= dropUpOffset
        elements.floating.style.top = `${-1 * dropUpOffset}px`
    }
    if (maxHeight) {
        height = Math.min(maxHeight, height)
    }
    elements.floating.style.maxHeight = `${height}px`
    // Ищем внутренний scrollable.
    const scrollable = Array.from(elements.floating.children)
        .find(
            element => element.classList.contains('dropdown-menu-scrollable')
        ) as HTMLElement | null
    if (scrollable) {
        // Если scrollable не первый отображаемый элемент, то нужно
        // уменьшить высоту на размер элементов сверху (offsetTop).
        // Сверху может быть поле ввода для фильтрации опций.
        height -= scrollable.offsetTop
        scrollable.style.maxHeight = `${height}px`
    }
}
