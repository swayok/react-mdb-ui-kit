import {mdiDotsHorizontal} from '@mdi/js'
import clsx from 'clsx'
import {useEventCallback} from '../../helpers/useEventCallback'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {Icon} from '../Icon/Icon'
import {DataGridPaginationPagesListFillerDropdown} from './DataGridPaginationPagesListFillerDropdown'
import type {DataGridPaginationPagesListProps} from './DataGridTypes'
import {getVisibleDataGridPageNumbers} from './helpers/getVisibleDataGridPageNumbers'

// Навигация по номерам страниц в DataGridPagination.
// Результат выглядит так:
// [1] [2] [3] [...] [90] [91] [92],
// где [...] - выпадающее меню со списком всех номеров страниц или полем ввода номера страницы,
// если страниц слишком много для нормального взаимодействия.
export function DataGridPaginationPagesList(props: DataGridPaginationPagesListProps) {

    const {
        className,
        totalCount,
        offset,
        limit,
        disabled,
        onPageChange: propsOnPageChange,
        maxVisiblePages,
        ...otherProps
    } = props

    const pagesCount = Math.floor(totalCount / limit) + (totalCount % limit === 0 ? 0 : 1)
    const currentPage = Math.floor(offset / limit) + 1

    const {
        items,
        hasFiller,
    } = getVisibleDataGridPageNumbers(pagesCount, currentPage, maxVisiblePages ?? 7)

    const onPageChange = useEventCallback((pageNumber: number) => {
        if (disabled) {
            return
        }
        setTimeout(() => {
            propsOnPageChange?.(pageNumber)
        }, 0)
    })

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
                            onPageChange(numberOrFiller)
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
