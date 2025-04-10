import {DropdownProps as BaseDropdownProps} from '@restart/ui/Dropdown'
import {DropdownItemProps as BaseDropdownItemProps} from '@restart/ui/DropdownItem'
import {Offset, UsePopperOptions} from '@restart/ui/usePopper'
import {HTMLAttributeAnchorTarget} from 'react'
import {
    AnyRefObject,
    ComponentPropsWithModifiableTag,
    ReactComponentOrTagName,
} from 'swayok-react-mdb-ui-kit/types/Common'
import {DropdownDropDirection} from './DropdownContext'

export interface DropdownProps
    extends Omit<
        ComponentPropsWithModifiableTag,
        'onSelect' | 'children' | 'onToggle'
    >, Omit<
        BaseDropdownProps,
        'itemSelector' | 'placement'
    > {
    drop?: DropdownDropDirection
    align?: DropdownAlign
    focusFirstItemOnShow?: boolean | 'keyboard'
    // По умолчанию: true.
    autoClose?: boolean | 'outside' | 'inside'
    ref?: AnyRefObject
    isRTL?: boolean
}

export interface DropdownToggleProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
    tag?: ReactComponentOrTagName
    split?: boolean
}

export interface DropdownMenuProps extends ComponentPropsWithModifiableTag {
    ref?: AnyRefObject
    show?: boolean
    renderOnMount?: boolean
    flip?: boolean
    align?: DropdownAlign
    rootCloseEvent?: 'click' | 'mousedown'
    popperConfig?: Omit<UsePopperOptions, 'enabled' | 'placement' | 'offset'>
    offset?: Offset | number
    variant?: DropdownMenuVariant
    isNavbar?: boolean
}

export interface DropdownItemProps extends Omit<BaseDropdownItemProps, 'as'> {
    tag?: ReactComponentOrTagName
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
