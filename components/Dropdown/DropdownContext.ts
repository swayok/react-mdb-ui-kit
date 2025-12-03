import {
    createContext,
    useContext,
} from 'react'
import {DropdownContextProps} from './DropdownTypes'

// Контекст для компонентов Dropdown.
export const DropdownContext = createContext<DropdownContextProps>({
    disableAllItems: false,
    setDisableAllItems() {
    },
})

// Контекст выпадающего меню.
export function useDropdownContext(): DropdownContextProps {
    return useContext(DropdownContext)
}
