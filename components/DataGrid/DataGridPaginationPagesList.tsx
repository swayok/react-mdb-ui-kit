import React from 'react'
import clsx from 'clsx'
import {Icon} from '../Icon'
import {mdiDotsHorizontal} from '@mdi/js'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {DataGridPaginationPagesListProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

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
        onOffsetChange,
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
                                onOffsetChange((numberOrFiller - 1) * limit)
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
        const renderDropdownItems = () => {
            const dropdownItems = []
            for (let hiddenPageNumber = 1; hiddenPageNumber <= pagesCount; hiddenPageNumber++) {
                dropdownItems.push(
                    <div
                        key={'page-number-' + hiddenPageNumber}
                        className={clsx(
                            'page-item text-center',
                            currentPage === hiddenPageNumber ? 'active' : null,
                            disabled ? 'disabled' : null
                        )}
                    >
                        <DropdownItem
                            tag="div"
                            className="page-link"
                            onClick={() => {
                                if (!disabled) {
                                    onOffsetChange((hiddenPageNumber - 1) * limit)
                                }
                            }}
                        >
                            {hiddenPageNumber}
                        </DropdownItem>
                    </div>
                )
            }
            return dropdownItems
        }

        let gridColumns = 10
        if (pagesCount < 30) {
            gridColumns = 5
        }
        return (
            <Dropdown
                focusFirstItemOnShow={false}
                offset={[0, 6]}
                drop="up"
                autoClose={true}
                className={className}
                {...otherProps}
            >
                <div className="d-flex flex-row align-items-center justify-content-center">
                    {items.map(renderItem)}
                </div>
                <DropdownMenu
                    maxHeight={300}
                >
                    <div
                        className="d-grid grid-columns-gap-2 grid-rows-gap-2 p-2 shadow-2-strong"
                        style={{
                            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                        }}
                    >
                        {renderDropdownItems()}
                    </div>
                </DropdownMenu>
            </Dropdown>
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
