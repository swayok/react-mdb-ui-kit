import React, {AllHTMLAttributes} from 'react'
import {ButtonColors, ComponentPropsWithModifiableTag} from './Common'
import {RippleProps} from '../components/Ripple/Ripple'

// Свойства контекста.
export interface TabSheetContextProps<TabName extends string = string> {
    defaultTab: TabName,
    currentTab: TabName,
    setCurrentTab: (tab: TabName) => void,
}

// Свойства обертки для TabSheet компонентов.
export interface TabSheetProps<
    TabName extends string = string
> extends ComponentPropsWithModifiableTag {
    // Либо вкладка по-умолчанию, либо внешний контроль за текущей вкладкой.
    defaultTab: TabName;
    savesStateToUrlQuery?: boolean;
    urlQueryArgName?: string;
}

// Свойства обработчика, контролирующего сохранение и восстановление
// текущей вкладки из URL Query.
export interface TabSheetStateToUrlQueryHandlerProps {
    // Имя параметра в URL Query.
    name: string
}

// Свойства контейнера кнопок переключения вкладок.
export interface TabSheetHeaderProps extends ComponentPropsWithModifiableTag {
    ulProps?: AllHTMLAttributes<HTMLUListElement>;
}

// Свойства кнопки переключения на вкладку.
export interface TabSheetTabButtonProps<
    TabName extends string = string
> extends AllHTMLAttributes<HTMLLIElement> {
    name: TabName;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    buttonProps?: Omit<AllHTMLAttributes<HTMLButtonElement>, 'role' | 'aria-selected' | 'type' | 'onClick'>;
    ripple?: ButtonColors | RippleProps;
    noRipple?: boolean;
}

// Свойства контейнера с блоками содержимого вкладок.
export type TabSheetBodyProps = ComponentPropsWithModifiableTag

// Свойства обертки содержимого вкладки.
export interface TabSheetTabContentProps<
    TabName extends string = string
> extends Omit<AllHTMLAttributes<HTMLDivElement>, 'role'> {
    name: TabName;
    lazy?: boolean;
}

