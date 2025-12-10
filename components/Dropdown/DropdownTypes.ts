/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    FlipOptions,
    FloatingRootContext,
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
import type {
    HtmlComponentProps,
    MergedComponentProps,
    MorphingComponentProps,
    MorphingHtmlComponentProps,
} from '../../types'

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
    setToggleElement: Dispatch<SetStateAction<HTMLElement | null>>
    setMenuElement: Dispatch<SetStateAction<HTMLElement | null>>
    isNested: boolean
    itemForParent: {
        ref: RefCallback<HTMLElement>
        index: number
    } | null
    rootContext: FloatingRootContext
    elementsRef: RefObject<(HTMLElement | null)[]>
    labelsRef: RefObject<(string | null)[]>
}

// Свойства компонента Dropdown.
export interface DropdownProps {
    ref?: never
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
    // Нужно ли подсветить первый DropdownItem элемент при открытии меню?
    // Если 'keyboard', то подсветка будет работать только при открытии меню с клавиатуры.
    focusFirstItemOnShow?: boolean | 'auto'
    // По умолчанию: true.
    autoClose?: boolean | 'outside' | 'inside'
    // Закрывать меню при скролле родительского контейнера?
    closeOnScrollOutside?: boolean
    // Заблокировать взаимодействие с меню.
    disabled?: boolean
    /**
     * Функция вызывается при изменении видимости выпадающего меню.
     *
     * @controllable show
     */
    onToggle?: DropdownContextProps['setIsOpen']
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
export interface DropdownToggleProps extends MorphingComponentProps {
    className?: string
    // Нужно ли добавить CSS класс 'dropdown-toggle-split'?
    split?: boolean
    /**
     * Отрисовка содержимого DropdownToggle вместо children.
     * Получает частичное состояние и функцию setIsOpen из контекста DropdownContextProps.
     */
    renderContent?: (metadata: DropdownToggleRenderFnMetadata) => ReactNode | ReactNode[]
    // Не используется, если указано свойство renderContent().
    children?: ReactNode | ReactNode[]
    onFocus?: (event: FocusEvent<HTMLElement>) => void
}

// Свойства компонента DropdownToggle и свойства компонента, передаваемого через tag по умолчанию (div).
// Для использования в других компонентах со свойством типа dropdownToggleProps.
export type DefaultDropdownToggleProps = MergedComponentProps<DropdownToggleProps, HtmlComponentProps>

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
    offset?: number
    // Вариант стилизации меню.
    variant?: DropdownMenuVariant
    // Максимальная высота меню.
    maxHeight?: number | null
    // Меню должно заполнять контейнер, в котором находится.
    fillContainer?: boolean
    // Добавить white-space: nowrap ко всем .dropdown-item?
    textNowrapOnItems?: boolean
}

// Свойства компонента DropdownItem.
export interface DropdownItemProps extends MorphingComponentProps {
    label?: string
    LinkComponent?: ComponentProps<any>
    target?: HTMLAttributeAnchorTarget
    href?: string
    // Внешняя ссылка (Будет использован <a> вместо <Link>).
    external?: boolean
    // Активный элемент (управление подсветкой извне)?
    active?: boolean
    disabled?: boolean
}

// Свойства компонента DropdownText.
export type DropdownTextProps = MorphingHtmlComponentProps

// Свойства компонента DropdownDivider.
export type DropdownDividerProps = MorphingHtmlComponentProps

// Свойства компонента DropdownHeader.
export type DropdownHeaderProps = MorphingHtmlComponentProps

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
