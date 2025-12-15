import {
    FloatingNode,
    FloatingTree,
    OpenChangeReason,
    safePolygon,
    useClick,
    useDismiss,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useFloatingRootContext,
    useHover,
    useInteractions,
    useListItem,
    useListNavigation,
    useRole,
} from '@floating-ui/react'
import {
    useRef,
    useState,
} from 'react'
import {useUncontrolled} from 'uncontrollable'
import {useEventCallback} from '../../helpers/useEventCallback'
import {
    DropdownContext,
    useDropdownContext,
} from './DropdownContext'
import {DropdownEventHandlers} from './DropdownEventHandlers'
import {
    DropdownContextProps,
    DropdownProps,
} from './DropdownTypes'

// Обёртка и контекст выпадающего меню.
// Структура:
// Dropdown
//   DropdownToggle
//   DropdownMenu
//      DropdownHeader
//      DropdownItem
//      DropdownText
//      DropdownDivider
export function Dropdown(props: DropdownProps) {
    const parentId = useFloatingParentNodeId()

    if (parentId === null) {
        return (
            <FloatingTree>
                <DropdownWrapper {...props} />
            </FloatingTree>
        )
    }

    return (
        <DropdownWrapper {...props} />
    )
}

// Обёртка и контекст выпадающего меню.
function DropdownWrapper(props: DropdownProps) {
    const {
        open = false,
        onOpenChange = useEventCallback(() => {
        }),
        focusFirstItemOnOpen = false,
        autoClose = true,
        closeOnScrollOutside = false,
        disabled,
        children,
    } = useUncontrolled(props, {open: 'onOpenChange'})

    const [
        hasFocusInside,
        setHasFocusInside,
    ] = useState(false)

    const [
        activeIndex,
        setActiveIndex,
    ] = useState<number | null>(null)

    const [
        disableAllItems,
        setDisableAllItems,
    ] = useState<boolean>(false)

    const [
        toggleElement,
        setToggleElement,
    ] = useState<HTMLElement | null>(null)
    const [
        menuElement,
        setMenuElement,
    ] = useState<HTMLDivElement | null>(null)

    const elementsRef = useRef<(HTMLElement | null)[]>([])
    const parentContext = useDropdownContext()

    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()
    const itemForParent = useListItem()

    const isNested = parentId != null

    const setIsOpen = useEventCallback(
        (open: boolean, event?: Event, reason?: OpenChangeReason) => {
            onOpenChange(open, event, reason)
            if (open && focusFirstItemOnOpen) {
                setActiveIndex(0)
            }
        }
    )

    const rootContext = useFloatingRootContext({
        open,
        onOpenChange: setIsOpen,
        elements: {
            reference: toggleElement,
            floating: menuElement,
        },
    })

    // Настройка взаимодействий с выпадающим меню.
    const hover = useHover(rootContext, {
        enabled: isNested,
        delay: {open: 75},
        handleClose: safePolygon({
            blockPointerEvents: true,
        }),
    })
    const click = useClick(rootContext, {
        enabled: !disabled,
        event: 'mousedown',
        toggle: !isNested,
        ignoreMouse: isNested,
    })
    const role = useRole(rootContext, {role: 'menu'})
    // noinspection PointlessBooleanExpressionJS
    const dismiss = useDismiss(rootContext, {
        bubbles: true,
        ancestorScroll: closeOnScrollOutside,
        outsidePress: autoClose === true || autoClose === 'outside',
    })
    const listNavigation = useListNavigation(rootContext, {
        listRef: elementsRef,
        activeIndex,
        nested: isNested,
        onNavigate: setActiveIndex,
        focusItemOnOpen: focusFirstItemOnOpen,
        virtual: true,
    })

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps,
    } = useInteractions([
        hover,
        click,
        dismiss,
        role,
        listNavigation,
    ])

    // Контекст.
    const contextProps: DropdownContextProps<HTMLElement, HTMLDivElement> = {
        rootContext,
        disableAllItems,
        setDisableAllItems,
        getItemProps,
        getReferenceProps,
        getFloatingProps,
        activeIndex,
        setActiveIndex,
        hasFocusInside,
        setHasFocusInside,
        isOpen: open,
        setIsOpen,
        parentContext: isNested ? parentContext : null,
        toggleElement,
        setToggleElement,
        menuElement,
        setMenuElement,
        isNested,
        itemForParent: isNested ? itemForParent : null,
        elementsRef,
    }

    // noinspection PointlessBooleanExpressionJS
    return (
        <>
            <DropdownEventHandlers
                closeOnItemClick={autoClose === true || autoClose === 'inside'}
                isOpen={open}
                setIsOpen={setIsOpen}
                parentId={parentId}
                nodeId={nodeId}
            />
            <FloatingNode id={nodeId}>
                <DropdownContext.Provider value={contextProps}>
                    {children}
                </DropdownContext.Provider>
            </FloatingNode>
        </>
    )
}
