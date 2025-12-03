import {
    createContext,
    useContext,
} from 'react'

// Свойства контекста компонента ReorderableListItem.
export interface ReorderableListItemContextProps {
    hasChildToggler: boolean
    setHasChildToggler: (value: boolean) => void
    isDisabled: boolean
    onDragStart: () => void
}

// Значения контекста по умолчанию.
const reorderableListItemContextDefaults: ReorderableListItemContextProps = {
    hasChildToggler: false,
    setHasChildToggler() {
    },
    isDisabled: false,
    onDragStart() {
    },
}

// Контекст компонента ReorderableListItem.
export const ReorderableListItemContext = createContext<
    ReorderableListItemContextProps
>(reorderableListItemContextDefaults)

// Получить данные контекста компонента ReorderableListItem.
export function useReorderableListItemContext(): ReorderableListItemContextProps {
    return useContext(ReorderableListItemContext)
}
