import React from 'react'
import {DropdownContextProps} from 'swayok-react-mdb-ui-kit/components/Dropdown2/DropdownTypes'

// Контекст для компонентов Dropdown.
export const DropdownContext = React.createContext<DropdownContextProps>({
    disableAllItems: false,
    setDisableAllItems() {
    },
})

// Контекст выпадающего меню.
export function useDropdownContext(): DropdownContextProps {
    return React.useContext(DropdownContext)
}
