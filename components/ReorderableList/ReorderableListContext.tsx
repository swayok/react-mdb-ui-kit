import {
    createContext,
    useContext,
} from 'react'
import {ReorderableListContextProps} from './ReorderableListTypes'

// Контекст компонента ReorderableList.
export const ReorderableListContext = createContext<
    ReorderableListContextProps
>({
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
})

// Получить данные контекста компонента ReorderableList.
export function useReorderableListContext<T = unknown>(): ReorderableListContextProps<T> {
    return useContext(ReorderableListContext) as unknown as ReorderableListContextProps<T>
}
