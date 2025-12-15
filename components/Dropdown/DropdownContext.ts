import {FloatingRootContext} from '@floating-ui/react'
import {
    createContext,
    HTMLProps,
    useContext,
} from 'react'
import {DropdownContextProps} from './DropdownTypes'

// Контекст для компонентов Dropdown.
export const DropdownContext = createContext<DropdownContextProps>({
    disableAllItems: false,
    setDisableAllItems() {
    },
    getReferenceProps(userProps?: HTMLProps<Element>) {
        return (userProps ?? {}) as Record<string, unknown>
    },
    getFloatingProps(userProps?: HTMLProps<HTMLElement>) {
        return (userProps ?? {}) as Record<string, unknown>
    },
    getItemProps(userProps?: HTMLProps<HTMLElement>) {
        return (userProps ?? {}) as Record<string, unknown>
    },
    activeIndex: null,
    setActiveIndex() {
    },
    hasFocusInside: false,
    setHasFocusInside() {
    },
    isOpen: false,
    setIsOpen() {
    },
    toggleElement: null,
    setToggleElement() {
    },
    menuElement: null,
    setMenuElement() {
    },
    isNested: false,
    itemForParent: {
        ref() {
        },
        index: 0,
    },
    parentContext: null,
    rootContext: {} as FloatingRootContext,
    elementsRef: {current: []},
})

// Контекст выпадающего меню.
export function useDropdownContext<
    ToggleRefType extends HTMLElement = HTMLElement,
    MenuRefType extends HTMLElement = HTMLDivElement,
>(): DropdownContextProps<ToggleRefType, MenuRefType> {
    return useContext(DropdownContext) as unknown as DropdownContextProps<ToggleRefType, MenuRefType>
}
