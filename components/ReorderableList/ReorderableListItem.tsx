import React, {AllHTMLAttributes, useContext, useState} from 'react'
import ReorderableListContext from './ReorderableListContext'
import clsx from 'clsx'
import ReorderableListItemContext, {getReorderableListItemContextDefaults} from './ReorderableListItemContext'
import {AnyObject, ComponentPropsWithModifiableTag} from '../../types/Common'

export interface DragAndDropItemProps extends Omit<ComponentPropsWithModifiableTag, 'draggable'> {
    position: number,
    disabled?: boolean,
    payload?: AnyObject | null,
    wrapperRef?: React.RefObject<HTMLElement>,
}

// Перетаскиваемый элемент списка.
function ReorderableListItem(props: DragAndDropItemProps) {
    const {
        tag,
        children,
        disabled,
        payload,
        position,
        className,
        wrapperRef,
        ...otherProps
    } = props

    const {
        onDragStart,
        onDragEnter,
        onDragEnd,
        isDisabled: isDisabledByContext,
        draggingElementPosition,
        draggingOverElementPosition,
        minPosition,
        maxPosition,
        droppedItemPlacement,
    } = useContext(ReorderableListContext)

    // Имеется ли специальный дочерний элемент, который используется для активации перетаскивания?
    const [hasChildToggler, setHasChildToggler] = useState<boolean>(false)
    // Активировано ли перетаскивание?
    const [childTogglerDragStarted, setChildTogglerDragStarted] = useState<boolean>(false)

    const calculatedProps: AllHTMLAttributes<unknown> = {}
    const isDisabled = disabled || isDisabledByContext
    if (!isDisabled) {
        calculatedProps.draggable = !hasChildToggler || childTogglerDragStarted
        calculatedProps.onDragStart = () => onDragStart(position, payload || null)
        calculatedProps.onDragEnter = () => {
            onDragEnter(position, payload || null)
        }
        calculatedProps.onDragOver = (event: React.DragEvent<HTMLElement>) => {
            // Ищем ближайший элемент с классом drag-and-drop-item.
            let item: HTMLElement | null = null
            let eventTarget: HTMLElement = event.currentTarget
            if (eventTarget.classList.contains('drag-and-drop-item')) {
                item = event.currentTarget
            } else {
                while (eventTarget.parentElement) {
                    if (eventTarget.parentElement.classList.contains('drag-and-drop-item')) {
                        item = eventTarget.parentElement
                        break
                    }
                    eventTarget = eventTarget.parentElement
                }
            }
            if (
                item?.classList.contains('drag-and-drop-over')
                || item?.classList.contains('drag-and-drop-current')
            ) {
                event.preventDefault()
            }
        }
        calculatedProps.onDragEnd = () => {
            onDragEnd()
            setChildTogglerDragStarted(false)
        }
    }

    const classes = clsx(
        'drag-and-drop-item',
        isDisabled || hasChildToggler ? null : 'drag-and-drop-toggler'
    )

    const Tag = tag || 'div'

    return (
        <ReorderableListItemContext.Provider
            value={getReorderableListItemContextDefaults({
                isDisabled,
                hasChildToggler,
                setHasChildToggler,
                onDragStart() {
                    setChildTogglerDragStarted(true)
                },
            })}
        >
            <Tag
                className={clsx(
                    className,
                    classes,
                    draggingElementPosition === position ? 'drag-and-drop-current' : null,
                    'drag-and-drop-place-' + droppedItemPlacement,
                    (
                        draggingOverElementPosition === position
                        && draggingElementPosition !== position
                    ) ? 'drag-and-drop-over' : null,
                    position === minPosition ? 'drag-and-drop-first-item' : null,
                    position === maxPosition ? 'drag-and-drop-last-item' : null
                )}
                {...otherProps}
                {...calculatedProps}
                ref={wrapperRef}
            >
                {children}
            </Tag>
        </ReorderableListItemContext.Provider>
    )
}

export default React.memo(ReorderableListItem)
