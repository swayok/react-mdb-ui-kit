import React, {useState} from 'react'
import ReorderableListContext, {
    getReorderableListContextDefaults,
    ReorderableListContextProps,
} from './ReorderableListContext'

type Props<PayloadType> = {
    children: React.ReactNode | React.ReactNode[],
    itemsCount: number,
    minPosition: number,
    maxPosition: number,
    droppedItemPlacement?: ReorderableListContextProps['droppedItemPlacement'],
    disabled?: boolean,
    onDragFinish: (
        draggedElementPosition: number,
        draggedElementPayload: PayloadType,
        droppedOnElementPosition: number,
        droppedOnElementPayload: PayloadType
    ) => void
};

// Обертка для контроля списка компонентов, которые можно менять местами.
// Внутри этого компонента предполагается размещение компонентов ReorderableListItem.
function ReorderableList<PayloadType = unknown>(
    props: Props<PayloadType>
) {

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
    const cancelDragging = () => {
        setDraggingElementPosition(null)
        setDraggingElementPayload(undefined)
        setDraggingOverElementPosition(null)
        setDraggingOverElementPayload(undefined)
    }

    const contextProps: ReorderableListContextProps<PayloadType> = getReorderableListContextDefaults<PayloadType>({
        itemsCount: props.itemsCount,
        minPosition: props.minPosition,
        maxPosition: props.maxPosition,
        droppedItemPlacement: props.droppedItemPlacement || 'after',
        isDisabled: !!props.disabled || props.itemsCount < 2,

        draggingElementPosition,
        draggingElementPayload: draggingElementPayload as PayloadType,

        draggingOverElementPosition,
        draggingOverElementPayload: draggingOverElementPayload as PayloadType,

        onDragStart(position: number, payload?: PayloadType) {
            // console.log('start', {position, payload});
            setDraggingElementPosition(position)
            setDraggingElementPayload(payload)
        },
        onDragEnter(position: number, payload?: PayloadType) {
            // console.log('over', {position, payload});
            if (draggingElementPosition !== null) {
                setDraggingOverElementPosition(position)
                setDraggingOverElementPayload(payload)
            }
        },
        onDragEnd() {
            // console.log('end', {
            //     draggingElementPosition, draggingElementPayload, draggingOverElementPosition, draggingOverElementPayload
            // });
            if (
                draggingElementPosition !== null
                && draggingOverElementPosition !== null
                && draggingElementPosition !== draggingOverElementPosition
            ) {
                props.onDragFinish(
                    draggingElementPosition,
                    draggingElementPayload as PayloadType,
                    draggingOverElementPosition,
                    draggingOverElementPayload as PayloadType
                )
            }
            cancelDragging()
        },
    })

    return (
        <ReorderableListContext.Provider
            value={contextProps as ReorderableListContextProps}
        >
            {props.children}
        </ReorderableListContext.Provider>
    )
}

export default React.memo(ReorderableList) as typeof ReorderableList
