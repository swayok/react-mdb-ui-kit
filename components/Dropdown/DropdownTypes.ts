/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    FlipOptions,
    FloatingRootContext,
    OffsetOptions,
    OpenChangeReason,
    ShiftOptions,
    UseInteractionsReturn,
} from '@floating-ui/react'
import type {
    ComponentProps,
    Dispatch,
    FocusEvent,
    HTMLAttributeAnchorTarget,
    ReactNode,
    RefCallback,
    RefObject,
    SetStateAction,
    SyntheticEvent,
} from 'react'
import type {LinkProps} from 'react-router-dom'
import type {
    HtmlComponentPropsWithRef,
    MergedComponentProps,
    MorphingComponentProps,
    MorphingHtmlComponentProps,
} from '../../types'
import type {ButtonProps} from '../Button'

// Свойства контекста для Dropdown.
export interface DropdownContextProps extends UseInteractionsReturn {
    // Индикатор того, что все DropdownItem внутри этого Dropdown должны быть disabled.
    disableAllItems: boolean
    setDisableAllItems: (disabled: boolean) => void
    activeIndex: number | null
    setActiveIndex: Dispatch<SetStateAction<number | null>>
    hasFocusInside: boolean
    setHasFocusInside: Dispatch<SetStateAction<boolean>>
    isOpen: boolean
    setIsOpen: (open: boolean, event?: Event, reason?: OpenChangeReason) => void
    parentContext: DropdownContextProps | null
    toggleElement: HTMLElement | null
    setToggleElement: Dispatch<SetStateAction<HTMLElement | null>>
    menuElement: HTMLElement | null
    setMenuElement: Dispatch<SetStateAction<HTMLElement | null>>
    isNested: boolean
    itemForParent: {
        ref: RefCallback<HTMLElement>
        index: number
    } | null
    rootContext: FloatingRootContext
    // useListNavigation(rootContext, {listRef: elementsRef})
    elementsRef: RefObject<(HTMLElement | null)[]>
}

// Свойства компонента Dropdown.
export interface DropdownProps {
    ref?: never
    // Начальное состояние выпадающего меню.
    defaultOpen?: boolean
    /**
     * Состояние выпадающего меню.
     * Если задано, то компонент будет работать в режиме внешнего управления видимостью.
     * Если не задано, то компонент будет работать в режиме самоуправления видимостью.
     *
     * @controllable onOpenChange
     */
    open?: boolean
    /**
     * Функция вызывается при изменении видимости выпадающего меню.
     *
     * @controllable open
     */
    onOpenChange?: DropdownContextProps['setIsOpen']
    // Нужно ли подсветить первый DropdownItem элемент при открытии меню?
    // Если 'keyboard', то подсветка будет работать только при открытии меню с клавиатуры.
    focusFirstItemOnOpen?: boolean | 'auto'
    // По умолчанию: true.
    autoClose?: boolean | 'outside' | 'inside'
    // Закрывать меню при скролле родительского контейнера?
    closeOnScrollOutside?: boolean
    // Заблокировать взаимодействие с меню.
    disabled?: boolean
    children?: ReactNode | ReactNode[]
}

// Свойства компонента DropdownEventHandlers.
export interface DropdownEventHandlersProps {
    closeOnItemClick: boolean
    isOpen: boolean
    nodeId?: string
    parentId: string | null
    setIsOpen: DropdownContextProps['setIsOpen']
}

// API выпадающего меню.
export interface DropdownApi {
    setIsOpen: DropdownContextProps['setIsOpen']
}

// Метаданные события изменения видимости выпадающего меню.
export interface DropdownToggleEventMetadata {
    source?: 'click' | 'mousedown' | 'keydown' | 'rootClose'
        | 'select' | 'outside' | 'navigation' | string
    originalEvent?: SyntheticEvent | KeyboardEvent | MouseEvent
}

// Метаданные для функции renderContent в DropdownToggleProps.
export type DropdownToggleRenderFnMetadata = Pick<
    DropdownContextProps,
    'isOpen' | 'isNested' | 'hasFocusInside' | 'setIsOpen'
>

// Свойства компонента, открывающего выпадающее меню по нажатию.
export interface DropdownToggleProps<
    RefType = any,
    InjectedComponentPropsType = any,
> extends MorphingComponentProps<RefType> {
    className?: string
    // Нужно ли добавить CSS класс 'dropdown-toggle-split'?
    split?: boolean
    /**
     * Отрисовка содержимого DropdownToggle вместо children.
     * Получает частичное состояние и функцию setIsOpen из контекста DropdownContextProps.
     */
    renderContent?: (metadata: DropdownToggleRenderFnMetadata) => ReactNode | ReactNode[]
    /**
     * Модификация свойств компонента в зависимости от состояния из metadata
     * @param metadata
     */
    modifyProps?: (
        metadata: Omit<DropdownToggleRenderFnMetadata, 'setIsOpen'>
    ) => Partial<InjectedComponentPropsType>
    // Не используется, если указано свойство renderContent().
    children?: ReactNode | ReactNode[]
    onFocus?: (event: FocusEvent<RefType>) => void
}

// Свойства компонента, открывающего вложенное выпадающее меню по нажатию.
export interface SubmenuDropdownToggleProps<
    InjectedComponentPropsType = any,
> extends Omit<DropdownToggleProps<HTMLDivElement, InjectedComponentPropsType>, 'tag'> {
    // Добавить иконку "стрелка вправо"?
    // По умолчанию: true.
    // Также добавляет flexbox стили.
    chevron?: boolean
    // Размер иконки.
    chevronSize?: number
}

// Свойства компонента DropdownToggle и свойства компонента, передаваемого через tag по умолчанию (div).
// Для использования в других компонентах со свойством типа dropdownToggleProps.
export type DefaultDropdownToggleProps = MergedComponentProps<
    Omit<DropdownToggleProps, 'tag' | 'ref'>,
    ButtonProps
>

type ShadowValue = '0' | '1' | '2' | '3' | '4' | '5' | '6'

type ShadowStrength = 'strong' | 'soft'

// Ссылка на обертку и API выпадающего меню.
export interface DropdownMenuProps extends MorphingHtmlComponentProps<any, DropdownApi> {
    // Нужно ли рендерить меню при монтировании компонента?
    renderOnMount?: boolean
    /**
     * Может ли меню менять сторону отображения в зависимости от доступного места на экране?
     * @see https://floating-ui.com/docs/flip
     */
    flip?: boolean | FlipOptions
    /**
     * Может ли меню смещаться вместе с окном в зависимости от доступного места на экране?
     * @see https://floating-ui.com/docs/shift
     */
    shift?: boolean | ShiftOptions
    // Позиция выпадающего меню (вертикальная).
    drop?: DropdownDropDirection
    // Позиция выпадающего меню (горизонтальная).
    align?: DropdownAlign
    /**
     * Уровень отбрасываемой тени.
     * Добавляет CSS класс `shadow-${shadow}`.
     * Пример: 0, 1, '1-strong', '2-soft'
     */
    shadow?: ShadowValue | `${ShadowValue}-${ShadowStrength}` | string | null
    // Режим Right-To-Left.
    isRTL?: boolean
    // Смещение выпадающего меню относительно DropdownToggle.
    offset?: OffsetOptions
    // Вариант стилизации меню.
    variant?: DropdownMenuVariant
    // Максимальная высота меню.
    maxHeight?: number | null
    // Меню должно заполнять контейнер, в котором находится.
    fillContainer?: boolean
    // Добавить white-space: nowrap ко всем .dropdown-item?
    textNowrapOnItems?: boolean
    // Нужно ли размещать меню в том родительском элементе (true) или в FloatingPortal (false)?
    // По умолчанию: false.
    inline?: boolean
}

// Свойства компонента DropdownMenu по умолчанию.
// Для использования в других компонентах со свойством типа dropdownMenuProps.
export type DefaultDropdownMenuProps = MergedComponentProps<
    Omit<DropdownMenuProps, 'tag' | 'ref'>,
    HtmlComponentPropsWithRef<HTMLDivElement>
>

export interface DropdownMenuContentProps extends Pick<
    DropdownMenuProps,
    'className' | 'style' | 'shadow' | 'tag' | 'variant' | 'ref' | 'maxHeight'
    | 'textNowrapOnItems' | 'fillContainer' | 'children'
> {
    isOpen: boolean
}

// Свойства компонента DropdownItem.
export interface DropdownItemProps extends MorphingComponentProps {
    LinkComponent?: ComponentProps<any>
    target?: HTMLAttributeAnchorTarget
    href?: string
    // Внешняя ссылка (Будет использован <a> вместо <Link>).
    external?: boolean
    // Активный элемент (управление подсветкой извне)?
    active?: boolean
    disabled?: boolean
    /**
     * Элемент содержит подменю?
     * Пример:
     * <Dropdown>
     *     <DropdownToggle>Menu</DropdownToggle>
     *     <DropdownMenu>
     *          <DropdownItem>Root menu item</DropdownItem>
     *          ...
     *          <DropdownItem submenu>
     *              <Dropdown>
     *                  <SubmenuDropdownToggle>
     *                      Open Submenu
     *                  </SubmenuDropdownToggle>
     *                  <DropdownMenu>
     *                      <DropdownItem>Submenu item</DropdownItem>
     *                      ...
     *                  </DropdownMenu>
     *              </Dropdown>
     *          </DropdownItem>
     *          ...
     *      </DropdownMenu>
     * </Dropdown>
     * В этом случае <DropdownItem dropdownToggle> работает как <DropdownToggle>
     * для вложенного меню.
     */
    submenu?: boolean
}

// Свойства компонента DropdownItem по умолчанию.
// Для использования в других компонентах со свойством типа dropdownItemProps.
export type DefaultDropdownItemProps = MergedComponentProps<
    Omit<DropdownItemProps, 'tag' | 'ref'>,
    Omit<LinkProps, 'to'>
>

// Свойства компонента DropdownText.
export type DropdownTextProps = HtmlComponentPropsWithRef<HTMLDivElement>

// Свойства компонента DropdownDivider.
export type DropdownDividerProps = HtmlComponentPropsWithRef<HTMLHRElement>

// Свойства компонента DropdownHeader.
export type DropdownHeaderProps = HtmlComponentPropsWithRef<HTMLDivElement>

export type DropdownDropDirection
    = | 'up'
        | 'up-centered'
        | 'start'
        | 'end'
        | 'down'
        | 'down-centered'

export type DropdownAlignDirection = 'start' | 'end'

export type DropdownResponsiveAlign
    = | {sm: DropdownAlignDirection;}
        | {md: DropdownAlignDirection;}
        | {lg: DropdownAlignDirection;}
        | {xl: DropdownAlignDirection;}
        | {xxl: DropdownAlignDirection;}
        | Record<string, DropdownAlignDirection>

export type DropdownAlign = DropdownAlignDirection | DropdownResponsiveAlign

export type DropdownMenuVariant = 'dark' | string

export interface DropdownPlacement {
    drop: DropdownDropDirection
    align: DropdownAlign
}
