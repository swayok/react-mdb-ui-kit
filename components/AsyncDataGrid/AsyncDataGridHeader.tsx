import React, {useCallback} from 'react'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {DataGridOrderingDirection} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'
import {AsyncDataGridHeaderProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import DataGridHeaderWrapper from '../DataGrid/DataGridHeaderWrapper'

// Заголовок колонки таблицы с данными получаемыми с сервера (<th>).
function AsyncDataGridHeader<
    OrderByOptions extends string = string
>(props: AsyncDataGridHeaderProps<OrderByOptions>) {

    const {
        loading,
        orderBy,
        orderDirection,
        setOrder,
    } = useAsyncDataGridContext()

    const handleClick = useCallback(() => {
        if (!loading && props.sortable) {
            let newOrderDirection: DataGridOrderingDirection = 'asc'
            if (orderBy === props.sortable) {
                newOrderDirection = orderDirection === 'asc' ? 'desc' : 'asc'
            }
            setOrder(props.sortable, newOrderDirection, !!props.resetOffset)
        }
    }, [props.sortable, loading, orderBy, orderDirection])

    return (
        <DataGridHeaderWrapper
            {...props}
            onClick={handleClick}
        />
    )
}

export default React.memo(AsyncDataGridHeader) as typeof AsyncDataGridHeader
