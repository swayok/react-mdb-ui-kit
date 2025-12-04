import {
    useEffect,
    useRef,
} from 'react'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AnyObject} from '../../types'
import {AsyncDataGridEventsProps} from './AsyncDataGridTypes'

// Выполняет заданные функции, когда происходят определенные события с таблицей.
export function AsyncDataGridEvents<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject,
>(props: AsyncDataGridEventsProps<RowDataType, FiltersDataType>) {

    const context = useAsyncDataGridContext<RowDataType, FiltersDataType>()
    const propsRef = useRef(props)

    // Получен новый набор данных.
    useEffect(() => {
        propsRef.current.onSetRows?.(context)
    }, [context.rows])

    // Демонтаж таблицы.
    useEffect(() => () => {
        propsRef.current.onUnmount?.()
    }, [])

    // Запрошен новый набор данных.
    useEffect(() => {
        propsRef.current.onDraw?.(context)
    }, [context.drawsCount])

    return null
}
