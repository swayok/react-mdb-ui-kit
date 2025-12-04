import {
    Context,
    createContext,
    useContext,
} from 'react'
import {TabSheetContextProps} from './TabSheetTypes'

// Контекст для компонентов Tabsheet.
const TabSheetContextInstance = createContext<
    TabSheetContextProps
>({
    defaultTab: '',
    currentTab: '',
    setCurrentTab: () => undefined,
})

// Правильная типизация контекста.
export function TabSheetContext<
    TabName extends string = string,
>(): Context<TabSheetContextProps<TabName>> {
    return TabSheetContextInstance as unknown as Context<TabSheetContextProps<TabName>>
}

// Хук для получения контекста.
export function useTabSheetContext<
    TabName extends string = string,
>(): TabSheetContextProps<TabName> {
    return useContext<TabSheetContextProps<TabName>>(TabSheetContext<TabName>())
}
