import {useCallback} from 'react'
import {DataGridHeaderWrapper} from '../DataGrid/DataGridHeaderWrapper'
import {DataGridOrderingDirection} from '../DataGrid/DataGridTypes'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AsyncDataGridHeaderProps} from './AsyncDataGridTypes'

// Заголовок колонки таблицы с данными, получаемыми с сервера (<th>).
export function AsyncDataGridHeader<
    OrderByOptions extends string = string,
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
