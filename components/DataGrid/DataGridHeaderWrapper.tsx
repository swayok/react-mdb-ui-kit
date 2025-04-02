import React, {CSSProperties} from 'react'
import clsx from 'clsx'
import {normalizeDimensionForReactStyles, renderSortingIcon} from './dataGridHelpers'
import {DataGridHeaderWrapperProps, DataGridOrderingDirection} from '../../types/DataGrid'
import Ripple from '../Ripple/Ripple'
import {useAsyncDataGridContext} from '../AsyncDataGrid/AsyncDataGridContext'
import withStable from '../../helpers/withStable'

// Обертка заголовка колонки таблицы (<th>).
function DataGridHeaderWrapper(props: DataGridHeaderWrapperProps) {

    const {
        loading,
        orderBy,
        orderDirection,
        setOrder,
    } = useAsyncDataGridContext()

    const {
        minWidth,
        width,
        maxWidth,
        style = {},
        className,
        sortable = false,
        nowrap = false,
        numeric = false,
        children,
    } = props

    //todo: implement resizable
    const additionalStyles: CSSProperties = {}
    if (minWidth) {
        additionalStyles.minWidth = normalizeDimensionForReactStyles(minWidth)
    }
    if (width) {
        additionalStyles.width = normalizeDimensionForReactStyles(width)
        additionalStyles.minWidth ??= normalizeDimensionForReactStyles(width)
    }
    if (maxWidth) {
        additionalStyles.maxWidth = normalizeDimensionForReactStyles(maxWidth)
    }

    return (
        <th
            className={clsx('with-ripple', className)}
            style={{
                ...additionalStyles,
                ...style,
            }}
        >
            <Ripple
                noRipple={!sortable}
                rippleColor="primary"
                rippleTag="div"
                minRippleRadius={100}
                className={clsx(
                    'data-grid-column-header',
                    sortable ? 'cursor' : null,
                    nowrap ? 'text-nowrap' : null
                )}
                onClick={() => {
                    if (!loading && sortable) {
                        let newOrderDirection: DataGridOrderingDirection = 'asc'
                        if (orderBy === sortable) {
                            newOrderDirection = orderDirection === 'asc' ? 'desc' : 'asc'
                        }
                        setOrder(sortable, newOrderDirection)
                    }
                }}
            >
                <div
                    className={clsx(
                        'd-flex flex-row align-items-center',
                        sortable && !numeric ? 'justify-content-between' : null,
                        !sortable && !numeric ? 'justify-content-start' : null,
                        numeric ? 'justify-content-end' : null,
                        nowrap ? 'text-nowrap' : null
                    )}
                >
                    <span className={sortable ? 'data-grid-sortable-label' : ''}>
                        {children}
                    </span>
                    {sortable && renderSortingIcon(
                        orderBy === sortable ? orderDirection : null,
                        loading
                    )}
                </div>
            </Ripple>
        </th>
    )
}

export default withStable<DataGridHeaderWrapperProps>(
    ['onClick'],
    DataGridHeaderWrapper
)
