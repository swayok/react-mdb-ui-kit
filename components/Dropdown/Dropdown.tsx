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
    useTypeahead,
} from '@floating-ui/react'
import * as React from 'react'
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
        show = false,
        onToggle = useEventCallback(() => {
        }),
        focusFirstItemOnShow = false,
        autoClose = true,
        closeOnScrollOutside = false,
        disabled,
        children,
    } = useUncontrolled(props, {show: 'onToggle'})

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
    ] = useState<HTMLElement | null>(null)

    const elementsRef = useRef<(HTMLElement | null)[]>([])
    const labelsRef = useRef<(string | null)[]>([])
    const parentContext = useDropdownContext()

    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()
    const itemForParent = useListItem()

    const isNested = parentId != null

    const setIsOpen = useEventCallback(
        (open: boolean, event?: Event, reason?: OpenChangeReason) => {
            onToggle(open, event, reason)
            if (open && focusFirstItemOnShow) {
                setActiveIndex(0)
            }
        }
    )

    const rootContext = useFloatingRootContext({
        open: show,
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
        focusItemOnOpen: focusFirstItemOnShow,
    })
    // todo: возможно typeahead тут не нужен или должен быть опциональным.
    const typeahead = useTypeahead(rootContext, {
        listRef: labelsRef,
        onMatch: show ? setActiveIndex : undefined,
        activeIndex,
    })

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps,
    } = useInteractions([
        hover,
        click,
        role,
        dismiss,
        listNavigation,
        typeahead,
    ])

    // Контекст.
    const contextProps: DropdownContextProps = {
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
        isOpen: show,
        setIsOpen,
        parentContext: isNested ? parentContext : null,
        setToggleElement,
        setMenuElement,
        isNested,
        itemForParent: isNested ? itemForParent : null,
        elementsRef,
        labelsRef,
    }

    // noinspection PointlessBooleanExpressionJS
    return (
        <>
            <DropdownEventHandlers
                closeOnItemClick={autoClose === true || autoClose === 'inside'}
                isOpen={show}
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
