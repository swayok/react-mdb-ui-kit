import React, {useContext} from 'react'

// Свойства контекста для ReorderableList.
export type ReorderableListContextProps<T = unknown> = {
    itemsCount: number,
    // Где будет размещен перетаскиваемый элемент: перед элементом, на который перетаскивается, или после?
    droppedItemPlacement: 'before' | 'after',
    minPosition: number,
    maxPosition: number,
    isDisabled: boolean,
    onDragStart: (position: number, payload?: T) => void,
    onDragEnter: (position: number, payload?: T) => void,
    onDragEnd: () => void,
    draggingElementPosition: number | null,
    draggingElementPayload: T,
    draggingOverElementPosition: number | null,
    draggingOverElementPayload: T,
}

// Значения контекста по умолчанию.
export function getReorderableListContextDefaults<T = unknown>(
    props?: Partial<ReorderableListContextProps<T>>
): ReorderableListContextProps<T> {
    return Object.assign(
        {
            itemsCount: 0,
            droppedItemPlacement: 'after',
            minPosition: 0,
            maxPosition: 0,
            isDisabled: false,
            onDragStart() {
            },
            onDragEnter() {
            },
            onDragEnd() {
            },
            draggingElementPosition: null,
            draggingElementPayload: null,
            draggingOverElementPosition: null,
            draggingOverElementPayload: null,
        },
        props || {}
    )
}

// Контекст компонента ReorderableList.
const ReorderableListContext = React.createContext<ReorderableListContextProps>(
    getReorderableListContextDefaults()
)

export function useReorderableListContext<T = unknown>(): ReorderableListContextProps<T> {
    return useContext(ReorderableListContext) as unknown as ReorderableListContextProps<T>
}

export default ReorderableListContext
