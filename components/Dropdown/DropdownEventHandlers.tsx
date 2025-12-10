import {useFloatingTree} from '@floating-ui/react'
import {useEffect} from 'react'
import {DropdownEventHandlersProps} from './DropdownTypes'

// Обработчик событий в дереве Dropdown компонентов.
export function DropdownEventHandlers(props: DropdownEventHandlersProps) {

    const {
        closeOnItemClick,
        isOpen,
        parentId,
        nodeId,
        setIsOpen,
    } = props

    // Генератор событий позволяет обмениваться данными между компонентами дерева.
    const tree = useFloatingTree()

    // Закрываем все меню в дереве при нажатии на DropdownItem, если разрешено.
    useEffect(() => {
        if (!tree || !closeOnItemClick) {
            return
        }

        function handleTreeClick() {
            setIsOpen(false)
        }

        function onSubMenuOpen(event: {nodeId: string; parentId: string;}) {
            if (event.nodeId !== nodeId && event.parentId === parentId) {
                setIsOpen(false)
            }
        }

        tree.events.on('click', handleTreeClick)
        tree.events.on('menuopen', onSubMenuOpen)

        return () => {
            tree.events.off('click', handleTreeClick)
            tree.events.off('menuopen', onSubMenuOpen)
        }
    }, [tree, nodeId, parentId])

    // Отправляем событие открытия меню.
    useEffect(() => {
        if (isOpen && tree) {
            tree.events.emit('menuopen', {parentId, nodeId})
        }
    }, [tree, isOpen, nodeId, parentId])

    return null
}
