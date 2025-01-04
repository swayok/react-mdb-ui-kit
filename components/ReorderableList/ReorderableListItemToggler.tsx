import React, {useContext, useEffect} from 'react'
import clsx from 'clsx'
import ReorderableListItemContext from './ReorderableListItemContext'
import {AnyObject, ComponentPropsWithModifiableTag} from '../../types/Common'

export interface DragAndDropTogglerProps extends Omit<ComponentPropsWithModifiableTag, 'onMouseDown' | 'disabled' | 'draggable'> {
    payload?: AnyObject | null
}

// Компонент, который позволяет перетаскивать элементы списка.
// Вставляется в ReorderableListItem.
// Если имеется такой компонент, то только им можно перетаскивать элементы списка.
function ReorderableListItemToggler(props: DragAndDropTogglerProps) {

    const {
        children,
        className,
        href,
        onClick,
        tag,
        ...otherProps
    } = props

    const {
        isDisabled,
        setHasChildToggler,
        onDragStart,
    } = useContext(ReorderableListItemContext)

    // Устанавливаем флаг, чтобы родительский компонент ReorderableListItem знал,
    // что в нём имеется специальный ReorderableListItemToggler.
    useEffect(() => {
        setHasChildToggler(true)
        return () => {
            setHasChildToggler(false)
        }
    }, [])

    const Tag = tag || 'a'

    return (
        <Tag
            {...otherProps}
            className={clsx(className, 'drag-and-drop-toggler', isDisabled ? 'disabled' : null)}
            disabled={isDisabled}
            onMouseDown={isDisabled ? undefined : onDragStart}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault()
                onClick?.(e)
            }}
            draggable={false}
            href={href || '#'}
        >
            {children}
        </Tag>
    )
}

export default React.memo(ReorderableListItemToggler)
