import React from 'react'
import {useDataGridContext} from './DataGridContext'
import {DataGridHeaderProps, DataGridOrderingDirection} from '../../types/DataGrid'
import DataGridHeaderWrapper from './DataGridHeaderWrapper'

// Заголовок колонки таблицы (<th>).
function DataGridHeader<
    OrderByOptions extends string = string
>(props: DataGridHeaderProps<OrderByOptions>) {

    const {
        orderBy,
        orderDirection,
        setOrder,
    } = useDataGridContext()

    const {
        sortingDataType,
        resetOffset,
        children,
        ...wrapperProps
    } = props

    return (
        <DataGridHeaderWrapper
            {...wrapperProps}
            onClick={() => {
                if (props.sortable) {
                    let newOrderDirection: DataGridOrderingDirection = 'asc'
                    if (orderBy === props.sortable) {
                        newOrderDirection = orderDirection === 'asc' ? 'desc' : 'asc'
                    }
                    setOrder(
                        props.sortable as unknown as string,
                        newOrderDirection,
                        !!resetOffset,
                        sortingDataType
                    )
                }
            }}
        >
            {children}
        </DataGridHeaderWrapper>
    )
}

export default React.memo(DataGridHeader) as typeof DataGridHeader
