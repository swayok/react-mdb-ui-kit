import React from 'react'
import clsx from 'clsx'
import Icon from '../Icon'
import {mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast} from '@mdi/js'
import DataGridPaginationPagesList from './DataGridPaginationPagesList'
import {DataGridPaginationProps} from '../../types/DataGrid'
import withStable from '../../helpers/withStable'

// Пагинация таблицы с данными.
function DataGridPagination(props: DataGridPaginationProps) {

    const {
        className,
        totalCount,
        offset,
        limit,
        disabled,
        firstLast = true,
        prevNext = true,
        numbers = true,
        maxVisiblePages,
        onOffsetChange,
        ...otherProps
    } = props

    const pagesCount = Math.floor(totalCount / limit) + (totalCount % limit === 0 ? 0 : 1)
    const currentPage = Math.floor(offset / limit) + 1

    return (
        <div
            className={clsx(
                'data-grid-pagination ms-3 d-flex flex-row align-items-center justify-content-start',
                className
            )}
            {...otherProps}
        >
            {firstLast && !numbers && (
                <div
                    className={clsx(
                        'page-item me-1',
                        disabled || currentPage <= 1 ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link cursor with-icon"
                        onClick={() => {
                            if (!disabled && currentPage > 1) {
                                onOffsetChange(0)
                            }
                        }}
                    >
                        <Icon
                            path={mdiPageFirst}
                            color={disabled || currentPage <= 1 ? 'muted' : undefined}
                        />
                    </div>
                </div>
            )}
            {prevNext && (
                <div
                    className={clsx(
                        'page-item me-1',
                        disabled || offset < limit ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link cursor with-icon"
                        onClick={() => {
                            if (!disabled && currentPage > 1) {
                                onOffsetChange((currentPage - 2) * limit)
                            }
                        }}
                    >
                        <Icon
                            path={mdiChevronLeft}
                            className={disabled || currentPage <= 1 ? 'text-muted' : ''}
                        />
                    </div>
                </div>
            )}
            {numbers && (
                <DataGridPaginationPagesList
                    totalCount={totalCount}
                    offset={offset}
                    limit={limit}
                    onOffsetChange={onOffsetChange}
                    maxVisiblePages={maxVisiblePages}
                    disabled={disabled}
                />
            )}
            {prevNext && (
                <div
                    className={clsx(
                        'page-item',
                        disabled || currentPage >= pagesCount ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link cursor with-icon"
                        onClick={() => {
                            if (!disabled && currentPage < pagesCount) {
                                onOffsetChange(currentPage * limit)
                            }
                        }}
                    >
                        <Icon
                            path={mdiChevronRight}
                            color={disabled || currentPage >= pagesCount ? 'muted' : undefined}
                        />
                    </div>
                </div>
            )}
            {firstLast && !numbers && (
                <div
                    className={clsx(
                        'page-item',
                        prevNext ? 'ms-1' : null,
                        disabled || currentPage >= pagesCount ? 'disabled' : null
                    )}
                >
                    <div
                        className="page-link cursor with-icon"
                        onClick={() => {
                            if (!disabled && currentPage < pagesCount) {
                                onOffsetChange(pagesCount * limit)
                            }
                        }}
                    >
                        <Icon
                            path={mdiPageLast}
                            className={disabled || currentPage >= pagesCount ? 'text-muted' : ''}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default withStable<DataGridPaginationProps>(
    ['onOffsetChange'],
    DataGridPagination
)
