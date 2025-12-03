import type {
    ReactNode,
    RefObject,
} from 'react'
import type {ComponentPropsWithModifiableTag} from '../../types'

// Свойства контекста для ReorderableList.
export interface ReorderableListContextProps<T = unknown> {
    itemsCount: number
    // Где будет размещен перетаскиваемый элемент: перед элементом, на который перетаскивается, или после?
    droppedItemPlacement: 'before' | 'after'
    minPosition: number
    maxPosition: number
    isDisabled: boolean
    onDragStart: (position: number, payload?: T) => void
    onDragEnter: (position: number, payload?: T) => void
    onDragEnd: () => void
    draggingElementPosition: number | null
    draggingElementPayload: T
    draggingOverElementPosition: number | null
    draggingOverElementPayload: T
}

// Свойства компонента ReorderableList.
export interface ReorderableListProps<PayloadType> {
    children: ReactNode | ReactNode[]
    itemsCount: number
    minPosition: number
    maxPosition: number
    droppedItemPlacement?: ReorderableListContextProps['droppedItemPlacement']
    disabled?: boolean
    onDragFinish: (
        draggedElementPosition: number,
        draggedElementPayload: PayloadType,
        droppedOnElementPosition: number,
        droppedOnElementPayload: PayloadType
    ) => void
}

// Свойства компонента ReorderableListItem.
export interface ReorderableListItemItemProps<PayloadType = unknown> extends Omit<ComponentPropsWithModifiableTag, 'draggable'> {
    position: number
    disabled?: boolean
    payload?: PayloadType
    wrapperRef?: RefObject<HTMLElement | null>
}
