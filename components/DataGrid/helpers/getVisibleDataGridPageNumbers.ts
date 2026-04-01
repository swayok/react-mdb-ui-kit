// Собрать список номеров страниц, которые нужно отобразить в панели.
// Если страниц слишком много, то в середину списка будет добавлен "...".
export function getVisibleDataGridPageNumbers(
    pagesCount: number,
    currentPage: number,
    maxVisiblePages: number
): {
    items: (number | '...')[]
    hasFiller: boolean
} {
    const items: (number | '...')[] = []
    let hasFiller = false
    if (pagesCount <= maxVisiblePages) {
        // pages count within limits - show all without fillers
        for (let i = 1; i <= pagesCount; i++) {
            items.push(i)
        }
    } else {
        if (currentPage <= maxVisiblePages - 3) {
            // at the beginning of the list
            for (let i = 1; i <= maxVisiblePages - 2; i++) {
                items.push(i)
            }
            items.push('...')
            items.push(pagesCount)
            hasFiller = true
        } else if (currentPage > pagesCount - maxVisiblePages + 3) {
            // at the end of the list
            items.push(1)
            items.push('...')
            for (let i = pagesCount - maxVisiblePages + 3; i <= pagesCount; i++) {
                items.push(i)
            }
            hasFiller = true
        } else {
            // in the middle of the list
            items.push(1)
            items.push('...')
            const delta = Math.floor((maxVisiblePages - 4) / 2)
            for (let i = currentPage - delta; i <= currentPage + delta; i++) {
                items.push(i)
            }
            items.push('...')
            items.push(pagesCount)
            hasFiller = true
        }
    }
    return {
        items,
        hasFiller,
    }
}
