import {mdiDotsHorizontal} from '@mdi/js'
import clsx from 'clsx'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {Icon} from '../Icon/Icon'
import {DataGridPaginationPagesListFillerDropdown} from './DataGridPaginationPagesListFillerDropdown'
import {DataGridPaginationPagesListProps} from './DataGridTypes'

// Кнопка, открывающая выпадающее меню со списком номеров страниц
// в промежутке между явно отображаемыми номерами страниц в пагинаторе.
// Пагинация выглядит так:
// [1] [2] [3] [...] [90] [91] [92],
// где [...] - этот компонент.
export function DataGridPaginationPagesList(props: DataGridPaginationPagesListProps) {

    const {
        className,
        totalCount,
        offset,
        limit,
        disabled,
        onPageChange,
        maxVisiblePages,
        ...otherProps
    } = props

    const pagesCount = Math.floor(totalCount / limit) + (totalCount % limit === 0 ? 0 : 1)
    const currentPage = Math.floor(offset / limit) + 1

    const {
        items,
        hasFiller,
    } = getVisiblePageNumbers(pagesCount, currentPage, maxVisiblePages ?? 7)

    const renderItem = (
        numberOrFiller: number | '...',
        index: number
    ) => {
        if (numberOrFiller === '...') {
            return (
                <div
                    key={'page-number-filler-' + index}
                    className="page-item"
                >
                    <DropdownToggle
                        tag="div"
                        className="page-link with-icon"
                    >
                        <Icon path={mdiDotsHorizontal} />
                    </DropdownToggle>
                </div>
            )
        } else {
            return (
                <div
                    key={'page-number-' + numberOrFiller}
                    className={clsx(
                        'page-item me-1',
                        currentPage === numberOrFiller ? 'active' : null,
                        disabled ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link"
                        onClick={() => {
                            if (!disabled) {
                                onPageChange(numberOrFiller)
                            }
                        }}
                    >
                        {numberOrFiller}
                    </div>
                </div>
            )
        }
    }

    if (hasFiller) {
        return (
            <DataGridPaginationPagesListFillerDropdown
                DropdownToggle={
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        {items.map(renderItem)}
                    </div>
                }
                pagesCount={pagesCount}
                currentPage={currentPage}
                className={className}
                disabled={disabled}
                onPageSelect={onPageChange}
                {...otherProps}
            />
        )
    } else {
        return (
            <div
                className={clsx('d-flex flex-row align-items-center justify-content-center', className)}
                {...otherProps}
            >
                {items.map(renderItem)}
            </div>
        )
    }
}

// Собрать список номеров страниц, которые нужно отобразить в панели.
// Если страниц слишком много, то в середину списка будет добавлен "...".
function getVisiblePageNumbers(
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
