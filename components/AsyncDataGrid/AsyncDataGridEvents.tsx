import React from 'react'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {AsyncDataGridEventsProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import withStable from '../../helpers/withStable'

// Выполняет заданные функции, когда происходят определенные события с таблицей.
function AsyncDataGridEvents<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
>(props: AsyncDataGridEventsProps<RowDataType, FiltersDataType>) {

    const context = useAsyncDataGridContext<RowDataType, FiltersDataType>()

    // Получен новый набор данных.
    React.useEffect(() => {
        props.onSetRows?.(context)
    }, [context.rows])

    // Демонтаж таблицы.
    React.useEffect(() => () => {
        props.onUnmount?.()
    }, [])

    // Запрошен новый набор данных.
    React.useEffect(() => {
        props.onDraw?.(context)
    }, [context.drawsCount])

    return null
}

export default withStable<AsyncDataGridEventsProps>(
    ['onSetRows', 'onUnmount', 'onDraw'],
    AsyncDataGridEvents
) as typeof AsyncDataGridEvents
