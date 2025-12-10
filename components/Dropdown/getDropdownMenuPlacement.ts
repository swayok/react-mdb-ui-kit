import {Placement} from '@floating-ui/react'
import {DropdownDropDirection} from './DropdownTypes'

// Получить позицию выпадающего меню.
export function getDropdownMenuPlacement(
    alignEnd: boolean,
    dropDirection?: DropdownDropDirection,
    isRTL?: boolean
): Placement {
    const topStart: Placement = isRTL ? 'top-end' : 'top-start'
    const topEnd: Placement = isRTL ? 'top-start' : 'top-end'
    const bottomStart: Placement = isRTL ? 'bottom-end' : 'bottom-start'
    const bottomEnd: Placement = isRTL ? 'bottom-start' : 'bottom-end'
    const leftStart: Placement = isRTL ? 'right-start' : 'left-start'
    const leftEnd: Placement = isRTL ? 'right-end' : 'left-end'
    const rightStart: Placement = isRTL ? 'left-start' : 'right-start'
    const rightEnd: Placement = isRTL ? 'left-end' : 'right-end'

    let placement: Placement = alignEnd ? bottomEnd : bottomStart
    if (dropDirection === 'up') {
        placement = alignEnd ? topEnd : topStart
    } else if (dropDirection === 'end') {
        placement = alignEnd ? rightEnd : rightStart
    } else if (dropDirection === 'start') {
        placement = alignEnd ? leftEnd : leftStart
    } else if (dropDirection === 'down-centered') {
        placement = 'bottom'
    } else if (dropDirection === 'up-centered') {
        placement = 'top'
    }
    return placement
}
