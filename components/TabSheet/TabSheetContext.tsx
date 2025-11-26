import React, {useContext} from 'react'
import {TabSheetContextProps} from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTypes'

// Контекст для компонентов Tabsheet.
const TabSheetContextInstance = React.createContext<TabSheetContextProps>({
    defaultTab: '',
    currentTab: '',
    setCurrentTab: () => undefined,
})

// Правильная типизация контекста.
function TabSheetContext<
    TabName extends string = string
>(): React.Context<TabSheetContextProps<TabName>> {
    return TabSheetContextInstance as unknown as React.Context<TabSheetContextProps<TabName>>
}

export default TabSheetContext

// Хук для получения контекста.
export function useTabSheetContext<
    TabName extends string = string
>(): TabSheetContextProps<TabName> {
    return useContext<TabSheetContextProps<TabName>>(TabSheetContext<TabName>())
}
