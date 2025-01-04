import React from 'react'

// Свойства контекста компонента ReorderableListItem.
export type ReorderableListItemContextProps = {
    hasChildToggler: boolean,
    setHasChildToggler: (value: boolean) => void,
    isDisabled: boolean,
    onDragStart: () => void
}

// Значения контекста по умолчанию.
export function getReorderableListItemContextDefaults(props?: Partial<ReorderableListItemContextProps>): ReorderableListItemContextProps {
    return Object.assign(
        {
            hasChildToggler: 0,
            setHasChildToggler() {
            },
            isDisabled: false,
            onDragStart() {
            },
        },
        props || {}
    )
}

// Контекст компонента ReorderableListItem.
const ReorderableListItemContext = React.createContext<ReorderableListItemContextProps>(
    getReorderableListItemContextDefaults()
)

export default ReorderableListItemContext
