import {DropdownItemProps as BaseDropdownItemProps} from '@restart/ui/DropdownItem'
import {UseDropdownToggleMetadata} from '@restart/ui/DropdownToggle'
import {Offset, UsePopperOptions} from '@restart/ui/usePopper'
import React, {HTMLAttributeAnchorTarget, ReactNode, SyntheticEvent} from 'react'
import {AnyRefObject, ComponentPropsWithModifiableTag, ReactComponentOrTagName} from '../../types/Common'

export interface DropdownContextProps {
    align?: DropdownAlign
    drop?: DropdownDropDirection
    isRTL?: boolean
    offset?: DropdownMenuOffset
    // Индикатор того, что все DropdownItem внутри этого Dropdown должны быть disabled.
    disableAllItems: boolean,
    setDisableAllItems: (disabled: boolean) => void
}

export interface DropdownProps extends Omit<
    ComponentPropsWithModifiableTag,
    'onSelect' | 'onToggle' | 'open'
> {
    // Начальное состояние выпадающего меню.
    defaultShow?: boolean
    /**
     * Состояние выпадающего меню.
     * Если задано, то компонент будет работать в режиме внешнего управления видимостью.
     * Если не задано, то компонент будет работать в режиме самоуправления видимостью.
     *
     * @controllable onToggle
     */
    show?: boolean
    // Позиция выпадающего меню (вертикальная).
    drop?: DropdownDropDirection
    // Позиция выпадающего меню (горизонтальная).
    align?: DropdownAlign
    // Нужно ли подсветить первый DropdownItem элемент при открытии меню?
    // Если 'keyboard', то подсветка будет работать только при открытии меню с клавиатуры.
    focusFirstItemOnShow?: boolean | 'keyboard'
    // По умолчанию: true.
    autoClose?: boolean | 'outside' | 'inside'
    // Ссылка на обертку и API выпадающего меню.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: AnyRefObject<any, DropdownApi>
    // Режим Right-To-Left.
    isRTL?: boolean
    // Смещение выпадающего меню относительно DropdownToggle.
    offset?: DropdownMenuOffset | number
    /**
     * Функция вызывается при изменении видимости выпадающего меню.
     * nextShow - новое состояние выпадающего меню.
     * meta - информация о событии, которое вызвало изменение состояния выпадающего меню.
     *
     * @controllable show
     */
    onToggle?: (nextShow: boolean, meta: DropdownToggleEventMetadata) => void
    /**
     * A callback fired when a DropdownItem has been selected.
     */
    onSelect?: SelectCallback
}

// API выпадающего меню.
interface DropdownApi {
    toggle: (nextShow: boolean, meta?: DropdownToggleEventMetadata) => void
}

// Метаданные события изменения видимости выпадающего меню.
export interface DropdownToggleEventMetadata {
    source?: 'click' | 'mousedown' | 'keydown' | 'rootClose'
        | 'select' | 'outside' | 'navigation' | string
    originalEvent?: SyntheticEvent | KeyboardEvent | MouseEvent
}

export interface DropdownToggleProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
    split?: boolean
    /**
     * A render prop that returns a Toggle element. The `props`
     * argument should spread through to **a component that can accept a ref**. Use
     * the `onToggle` argument to toggle the menu open or closed
     */
    render?: (meta: DropdownToggleMetadata) => ReactNode
}

export type DropdownToggleMetadata = UseDropdownToggleMetadata

export interface DropdownMenuProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
    show?: boolean
    renderOnMount?: boolean
    flip?: boolean
    align?: DropdownAlign
    rootCloseEvent?: 'click' | 'mousedown'
    popperConfig?: Omit<UsePopperOptions, 'enabled' | 'placement' | 'offset'>
    offset?: DropdownMenuOffset | number
    variant?: DropdownMenuVariant
    isNavbar?: boolean
    closeOnScrollOutside?: boolean
    maxHeight?: number
    fillContainer?: boolean
    // Добавить white-space: nowrap ко всем .dropdown-item?
    textNowrapOnItems?: boolean
}

export interface DropdownItemProps extends Omit<BaseDropdownItemProps, 'as'> {
    tag?: ReactComponentOrTagName
    LinkComponent?: React.ComponentProps
    target?: HTMLAttributeAnchorTarget
    // Внешняя ссылка (запрет использования компонента <Link> вместо <a>).
    external?: boolean
    ref?: AnyRefObject
}

export interface DropdownItemTextProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
}

export interface DropdownDividerProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
}

export interface DropdownHeaderProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
}

export type DropdownMenuOffset = Offset

export type DropdownDropDirection =
    | 'up'
    | 'up-centered'
    | 'start'
    | 'end'
    | 'down'
    | 'down-centered';

export type DropdownAlignDirection = 'start' | 'end'

export type DropdownResponsiveAlign =
    | { sm: DropdownAlignDirection }
    | { md: DropdownAlignDirection }
    | { lg: DropdownAlignDirection }
    | { xl: DropdownAlignDirection }
    | { xxl: DropdownAlignDirection }
    | Record<string, DropdownAlignDirection>

export type DropdownAlign = DropdownAlignDirection | DropdownResponsiveAlign

export type DropdownMenuVariant = 'dark' | string

export interface DropdownPlacement {
    drop: DropdownDropDirection,
    align: DropdownAlign,
}
