import {useDataGridContext} from './DataGridContext'
import {DataGridHeaderWrapper} from './DataGridHeaderWrapper'
import {
    DataGridHeaderProps,
    DataGridOrderingDirection,
} from './DataGridTypes'

// Заголовок колонки таблицы (<th>).
export function DataGridHeader<
    OrderByOptions extends string = string,
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

/** @deprecated */
export default DataGridHeader
