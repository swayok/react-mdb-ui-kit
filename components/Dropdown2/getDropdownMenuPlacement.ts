import {DropdownDropDirection} from 'swayok-react-mdb-ui-kit/components/Dropdown2/DropdownTypes'
import {Placement} from '@popperjs/core'

export function getDropdownMenuPlacement(
    alignEnd: boolean,
    dropDirection?: DropdownDropDirection,
    isRTL?: boolean
): Placement {
    const topStart = isRTL ? 'top-end' : 'top-start'
    const topEnd = isRTL ? 'top-start' : 'top-end'
    const bottomStart = isRTL ? 'bottom-end' : 'bottom-start'
    const bottomEnd = isRTL ? 'bottom-start' : 'bottom-end'
    const leftStart = isRTL ? 'right-start' : 'left-start'
    const leftEnd = isRTL ? 'right-end' : 'left-end'
    const rightStart = isRTL ? 'left-start' : 'right-start'
    const rightEnd = isRTL ? 'left-end' : 'right-end'

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
