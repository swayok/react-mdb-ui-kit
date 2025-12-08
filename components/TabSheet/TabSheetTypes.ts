import type {
    ComponentType,
    MouseEvent,
    ReactNode,
} from 'react'
import type {
    ButtonColors,
    HtmlComponentProps,
    MorphingHtmlComponentPropsWithoutRef,
} from '../../types'
import type {RippleProps} from '../Ripple/RippleTypes'

// Свойства контекста.
export interface TabSheetContextProps<TabName extends string = string> {
    defaultTab: TabName
    currentTab: TabName
    setCurrentTab: (tab: TabName) => void
}

// Свойства обертки для TabSheet компонентов.
export interface TabSheetProps<
    TabName extends string = string,
> extends MorphingHtmlComponentPropsWithoutRef {
    // Либо вкладка по-умолчанию, либо внешний контроль за текущей вкладкой.
    defaultTab: TabName
    savesStateToUrlQuery?: boolean
    urlQueryArgName?: string
    onTabChange?: (tag: TabName) => void
}

// Свойства обработчика, контролирующего сохранение и восстановление
// текущей вкладки из URL Query.
export interface TabSheetStateToUrlQueryHandlerProps {
    // Имя параметра в URL Query.
    name: string
}

// Свойства контейнера кнопок переключения вкладок.
export interface TabSheetHeaderProps extends MorphingHtmlComponentPropsWithoutRef {
    ulProps?: HtmlComponentProps<HTMLUListElement>
}

// Свойства кнопки переключения на вкладку.
export interface TabSheetTabButtonProps<
    TabName extends string = string,
> extends Omit<HtmlComponentProps<HTMLLIElement>, 'onClick'> {
    name: TabName
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    buttonProps?: Omit<HtmlComponentProps<HTMLButtonElement>, 'role' | 'aria-selected' | 'type' | 'onClick'>
    ripple?: ButtonColors | RippleProps
    noRipple?: boolean
}

// Свойства контейнера с блоками содержимого вкладок.
export type TabSheetBodyProps = MorphingHtmlComponentPropsWithoutRef

// Свойства обертки содержимого вкладки.
export interface TabSheetTabContentProps<
    TabName extends string = string,
> extends Omit<HtmlComponentProps<HTMLDivElement>, 'role'> {
    name: TabName
    lazy?: boolean
    ErrorBoundary?: ComponentType<{children: ReactNode | ReactNode[];}>
}

