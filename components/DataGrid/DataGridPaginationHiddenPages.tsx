import React from 'react'
import clsx from 'clsx'
import Icon from '../Icon'
import {mdiDotsHorizontal} from '@mdi/js'
import DropdownToggle from '../Dropdown/DropdownToggle'
import DropdownItem from '../Dropdown/DropdownItem'
import Dropdown from '../Dropdown/Dropdown'
import DropdownMenu from '../Dropdown/DropdownMenu'
import {DataGridPaginationHiddenPagesProps} from '../../types/DataGrid'
import withStable from '../../helpers/withStable'

// Кнопка открывающая выпадающее меню со списком номеров страниц
// в промежутке между явно отображаемыми номерами страниц в пагинаторе.
// Пагинация выглядит так:
// [1] [2] [3] [...] [90] [91] [92],
// где [...] - этот компонент.
function DataGridPaginationHiddenPages(props: DataGridPaginationHiddenPagesProps) {

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

    const pagesMap = getPagesMap(pagesCount, currentPage, maxVisiblePages || 7)

    const pages = []
    let hasFillers: boolean = false
    for (let i = 0; i < pagesMap.length; i++) {
        if (pagesMap[i] === '...') {
            pages.push(
                <div
                    key={'page-number-filler-' + i}
                    className="page-item"
                >
                    <DropdownToggle
                        tag="div"
                        className="page-link with-icon"
                    >
                        <Icon path={mdiDotsHorizontal}/>
                    </DropdownToggle>
                </div>
            )
            hasFillers = true
        } else {
            pages.push(
                <div
                    key={'page-number-' + pagesMap[i]}
                    className={clsx(
                        'page-item me-1',
                        currentPage === pagesMap[i] ? 'active' : null,
                        disabled ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link"
                        onClick={() => {
                            if (!disabled) {
                                onOffsetChange((pagesMap[i] as number - 1) * limit)
                            }
                        }}
                    >
                        {pagesMap[i]}
                    </div>
                </div>
            )
        }
    }

    if (hasFillers) {
        const dropdownItems = []
        for (let hiddenPageNumber = 1; hiddenPageNumber <= pagesCount; hiddenPageNumber++) {
            dropdownItems.push(
                <DropdownItem
                    tag="div"
                    key={'page-number-' + hiddenPageNumber}
                    className={clsx(
                        'page-item text-center',
                        currentPage === hiddenPageNumber ? 'active' : null,
                        disabled ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link"
                        onClick={() => {
                            if (!disabled) {
                                onOffsetChange((hiddenPageNumber - 1) * limit)
                            }
                        }}
                    >
                        {hiddenPageNumber}
                    </div>
                </DropdownItem>
            )
        }
        let gridColumns = 10
        if (pagesCount < 30) {
            gridColumns = 5
        }
        return (
            <Dropdown
                selectFirstOnOpen={false}
                offset={[0, 6]}
                placement="top"
                positioningContainer="wrapper"
                className={className}
                {...otherProps}
            >
                <div className="d-flex flex-row align-items-center justify-content-center">
                    {pages}
                </div>
                <DropdownMenu
                    className="d-grid grid-columns-gap-2 grid-rows-gap-2 p-2 shadow-2-strong"
                    style={{
                        maxHeight: 300,
                        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                    }}
                >
                    {dropdownItems}
                </DropdownMenu>
            </Dropdown>
        )
    } else {
        return (
            <div
                className={clsx('d-flex flex-row align-items-center justify-content-center', className)}
                {...otherProps}
            >
                {pages}
            </div>
        )
    }
}

export default withStable<DataGridPaginationHiddenPagesProps>(
    ['onOffsetChange'],
    DataGridPaginationHiddenPages
)

// Собрать список номеров страниц, которые невозможно показать явно.
function getPagesMap(pagesCount: number, currentPage: number, maxVisiblePages: number): Array<number | '...'> {
    const pagesMap: Array<number | '...'> = []
    if (pagesCount <= maxVisiblePages) {
        // pages count within limits - show all without fillers
        for (let i = 1; i <= pagesCount; i++) {
            pagesMap.push(i)
        }
    } else {
        if (currentPage <= maxVisiblePages - 3) {
            // at the beginning of the list
            for (let i = 1; i <= maxVisiblePages - 2; i++) {
                pagesMap.push(i)
            }
            pagesMap.push('...')
            pagesMap.push(pagesCount)
        } else if (currentPage > pagesCount - maxVisiblePages + 3) {
            // at the end of the list
            pagesMap.push(1)
            pagesMap.push('...')
            for (let i = pagesCount - maxVisiblePages + 3; i <= pagesCount; i++) {
                pagesMap.push(i)
            }
        } else {
            // in the middle of th list
            pagesMap.push(1)
            pagesMap.push('...')
            const delta = Math.floor((maxVisiblePages - 4) / 2)
            for (let i = currentPage - delta; i <= currentPage + delta; i++) {
                pagesMap.push(i)
            }
            pagesMap.push('...')
            pagesMap.push(pagesCount)
        }
    }
    return pagesMap
}
