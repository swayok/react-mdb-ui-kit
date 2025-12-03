import React, {
    useCallback,
    useState,
} from 'react'
import {ReorderableListContext} from './ReorderableListContext'
import {
    ReorderableListContextProps,
    ReorderableListProps,
} from './ReorderableListTypes'

// Обертка для контроля списка компонентов, которые можно менять местами.
// Внутри этого компонента предполагается размещение компонентов ReorderableListItem.
export function ReorderableList<PayloadType = unknown>(
    props: ReorderableListProps<PayloadType>
) {
    const {
        disabled,
        droppedItemPlacement,
        maxPosition,
        minPosition,
        itemsCount,
        children,
        onDragFinish,
    } = props

    // Позиция перетаскиваемого элемента.
    const [
        draggingElementPosition,
        setDraggingElementPosition,
    ] = useState<number | null>(null)
    // Данные перетаскиваемого элемента.
    const [
        draggingElementPayload,
        setDraggingElementPayload,
    ] = useState<PayloadType | undefined>(undefined)
    // Позиция элемента, над котором производится перетаскивание.
    const [
        draggingOverElementPosition,
        setDraggingOverElementPosition,
    ] = useState<number | null>(null)
    // Данные элемента, над котором производится перетаскивание.
    const [
        draggingOverElementPayload,
        setDraggingOverElementPayload,
    ] = useState<PayloadType | undefined>(undefined)

    // Отмена перетаскивания.
    const cancelDragging = useCallback(() => {
        setDraggingElementPosition(null)
        setDraggingElementPayload(undefined)
        setDraggingOverElementPosition(null)
        setDraggingOverElementPayload(undefined)
    }, [])

    const contextProps: ReorderableListContextProps<PayloadType> = {
        itemsCount,
        minPosition,
        maxPosition,
        droppedItemPlacement: droppedItemPlacement || 'after',
        isDisabled: !!disabled || itemsCount < 2,

        draggingElementPosition,
        draggingElementPayload: draggingElementPayload as PayloadType,

        draggingOverElementPosition,
        draggingOverElementPayload: draggingOverElementPayload as PayloadType,

        onDragStart: useCallback((position: number, payload?: PayloadType) => {
            // console.log('start', {position, payload});
            setDraggingElementPosition(position)
            setDraggingElementPayload(payload)
        }, []),
        onDragEnter: useCallback((position: number, payload?: PayloadType) => {
            // console.log('over', {position, payload});
            if (draggingElementPosition !== null) {
                setDraggingOverElementPosition(position)
                setDraggingOverElementPayload(payload)
            }
        }, [draggingElementPosition]),
        onDragEnd: useCallback(() => {
            // console.log('end', {
            //     draggingElementPosition,
            //     draggingElementPayload,
            //     draggingOverElementPosition,
            //     draggingOverElementPayload
            // });
            if (
                draggingElementPosition !== null
                && draggingOverElementPosition !== null
                && draggingElementPosition !== draggingOverElementPosition
            ) {
                onDragFinish(
                    draggingElementPosition,
                    draggingElementPayload as PayloadType,
                    draggingOverElementPosition,
                    draggingOverElementPayload as PayloadType
                )
            }
            cancelDragging()
        }, [draggingElementPosition, draggingOverElementPosition, onDragFinish, cancelDragging]),
    }

    return (
        <ReorderableListContext.Provider
            value={contextProps as ReorderableListContextProps}
        >
            {children}
        </ReorderableListContext.Provider>
    )
}

/** @deprecated */
export default ReorderableList
