import React from 'react'

export type DropdownOpenState = 'open' | 'opening' | 'opened' | 'close' | 'closing' | 'closed'

interface DropdownContextProps {
    id: string | null,
    isVisible: boolean,
    isOpened: boolean,
    isAnimationActive: boolean,
    toggleOpenClose: () => void,
    handleClose: () => void,
    itemsCount: number,
    increment: () => Promise<number>,
    decrement: () => Promise<number>,
    setReferenceElement: React.Dispatch<React.SetStateAction<null | HTMLElement>>,
    setPopperElement: React.Dispatch<React.SetStateAction<null | HTMLElement>>,
    styles: { [key: string]: React.CSSProperties },
    activeIndex: number | null,
    setActiveIndex: (position: number) => void,
    moveActiveIndexUp: () => void,
    moveActiveIndexDown: () => void,
    attributes: Record<string, unknown>,
    animation?: boolean,
    isAllItemsDisabled?: boolean,
    setIsAllItemsDisabled: (disabled: boolean) => void,
}

// Контекст для компонентов Dropdown.
const DropdownContext = React.createContext<DropdownContextProps>({
    id: null,
    animation: true,
    toggleOpenClose: () => undefined,
    handleClose: () => undefined,
    setActiveIndex: (): number | null => null,
    moveActiveIndexUp: () => undefined,
    moveActiveIndexDown: () => undefined,
    itemsCount: 0,
    increment: () => Promise.resolve(0),
    decrement: () => Promise.resolve(0),
    isVisible: false,
    isOpened: false,
    isAnimationActive: false,
    activeIndex: null,
    setPopperElement() {},
    setReferenceElement() {},
    styles: {},
    attributes: {},
    isAllItemsDisabled: false,
    setIsAllItemsDisabled() {},
})

export default DropdownContext

// Контекст выпадающего меню.
export function useDropdownContext(): DropdownContextProps {
    return React.useContext(DropdownContext)
}
