/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    AllHTMLAttributes,
    ComponentProps,
    ForwardedRef,
    RefAttributes,
    RefCallback,
    RefObject,
} from 'react'
import type {
    DropdownHeaderProps,
    DropdownItemProps,
} from '../components/Dropdown/DropdownTypes'

// Выбрать только ключи, которые начинаются с 'Dropdown'
export type PickByPrefix<T, P extends string> = {
    [K in keyof T as K extends `${P}${string}` ? K : never]: T[K];
}

// Объект, который может содержать любые ключи.
// Также можно указать набор ключей (Keys), которые, возможно, могут быть в объекте.
// Это удобно для абстрактных объектов получаемых извне и для подсказок в IDE.
export interface AnyObject<
    ValuesType = any,
    Keys extends string | number | object = string,
// @ts-ignore TS ругается на невозможность расширения интерфейса таким образом, но IDE отлично с этим работает.
> extends Record<
        Keys extends string
            ? Keys | string
            : (Keys extends number ? Keys : keyof Keys | string),
        ValuesType
    > {
    [key: string]: ValuesType
}

// Объект с опциональным наличием значения для всех ключей.
export type PartialRecord<
    Keys extends number | string | symbol = string,
    ValuesType = any,
> = Partial<Record<Keys, ValuesType>>

// Объект, в котором все ключи должны быть числами.
// По сути - это массив, в котором индексы не упорядочены.
export type NumericKeysObject<
    ValuesType = any,
> = Record<number, ValuesType>

// RefObject любого вида.
export type AnyRefObject<
    RefType = any,
> = RefObject<RefType>
    | ForwardedRef<RefType>

// Ref любого вида.
export type AnyRef<
    RefType = any,
> = RefCallback<RefType> | AnyRefObject<RefType>

// Ref любого вида для API компонента.
// Пример для свойства apiRef: useImperativeHandle(apiRef, (): ApiType => {...}).
export type ApiRef<ApiType> = RefObject<ApiType>
    | ForwardedRef<ApiType>
    | RefCallback<ApiType>

/**
 * Базовый тип URL параметров для хука useParams<UrlParams>().
 */
export type AnyUrlParams = Record<string, string | undefined>

/**
 * Базовый тип URL параметров для хука useParams<UrlParams>().
 */
export type AnyRouteParams = AnyUrlParams

// Информация о типе устройства и ширине страницы.
export interface UILayout {
    /**
     * Тип устройства.
     */
    deviceType: 'desktop' | 'tablet' | 'mobile'
    /**
     * У каждого типа имеется 2 версии - обычная и широкая.
     * Сопоставление примерно такое:
     * mobile = xxs|xs, mobile wide = sm;
     * tablet = md, tablet wide = lg;
     * desktop = xl, desktop wide = xxl;
     */
    isWide: boolean
    /**
     * Размер устройства по брейкпоинтам Bootstrap CSS.
     */
    bootstrapSize: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

// Все возможные цвета различных компонентов (зависит от стилей).
export type TextColors = 'body' | 'white' | 'muted'
    | 'dark' | 'gray' | 'light-gray' | 'blue' | 'red' | 'green' | 'orange'
    | 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | string

export type ButtonColors = 'none' | 'gray' | 'green' | 'red' | 'orange' | 'blue' | 'primary'
    | 'secondary' | 'link' | 'light' | 'dark' | string

export type BackgroundColors = 'transparent' | 'white' | 'gray' | 'green' | 'red' | 'orange'
    | 'blue' | 'primary' | 'light' | 'super-light' | 'dark' | 'body' | string

export type BorderColors = 'gray' | 'green' | 'red' | 'orange' | 'blue' | 'primary'
    | 'light' | 'dark' | 'secondary' | 'white' | string

export type NoteColors = 'primary' | 'secondary' | 'light'
    | 'success' | 'danger' | 'warning' | 'info' | string

export type CheckboxColors = 'green' | 'blue' | 'red' | 'orange' | string

export type TableHighlightColors = 'green' | 'blue' | 'red' | 'orange' | 'gray' | string

// Минимальное и максимальное значение.
export interface MinMax {
    min: number
    max: number
}

// Возможные данные ответа от сервера.
export interface ApiResponseData extends AnyObject {
    _message?: string
    _message_type?: 'info' | 'success' | 'error' | 'notice'
    _redirect?: string
    _redirect_back?: string
}

// Опция для SelectInput.
export interface FormSelectOption<
    Value = string,
    Extras extends AnyObject = AnyObject,
> extends AnyObject {
    label: string
    value: Value
    attributes?: DropdownItemProps & HtmlComponentProps<HTMLElement>
    disabled?: boolean
    extra?: Extras
}

// Группа опций для SelectInput.
export interface FormSelectOptionGroup<
    Value = string,
    Extras extends AnyObject = AnyObject,
> extends AnyObject {
    label: string
    options: FormSelectOption<Value, Extras>[]
    groupHeaderAttributes?: DropdownHeaderProps
    // optionsContainerAttributes?: HTMLProps<HTMLDivElement>
    extra?: Extras
}

// Список, содержащий только опции для SelectInput.
export type FormSelectOptionsList<
    Value = string,
    Extras extends AnyObject = AnyObject,
> = FormSelectOption<Value, Extras>[]

// Опция или группа опция для SelectInput.
export type FormSelectOptionOrGroup<
    Value = string,
    Extras extends AnyObject = AnyObject,
> = FormSelectOption<Value, Extras>
    | FormSelectOptionGroup<Value, Extras>

// Список содержащий и опции и группы опций для SelectInput.
export type FormSelectOptionsAndGroupsList<
    Value = string,
    Extras extends AnyObject = AnyObject,
> = FormSelectOptionOrGroup<Value, Extras>[]
    | FormSelectOptionGroup<Value, Extras>[]

// Свойство этого типа может быть React компонентом или реальным HTML тегом (строкой).
export type ReactComponentOrTagName = ComponentProps<any>

/**
 * Компонент, который принимает свойства любого HTML элемента.
 */
export type HtmlComponentProps<
    T extends HTMLElement | SVGElement = HTMLElement,
> = AllHTMLAttributes<T>

/**
 * Компонент, который принимает свойства любого HTML элемента.
 */
export type HtmlComponentPropsWithRef<
    T extends HTMLElement | SVGElement = HTMLElement,
> = AllHTMLAttributes<T> & RefAttributes<T>

/**
 * Компонент имеет свойство tag, которое может быть React компонентом
 * или реальным HTML тегом (строкой).
 * Также компонент имеет свойство ref.
 *
 * Лучше использовать в паре с:
 * @see MergedComponentProps
 */
export interface MorphingComponentProps<
    RefType extends HTMLElement | SVGElement = any,
> {
    tag?: ReactComponentOrTagName
    ref?: AnyRef<RefType>
}

/**
 * Компонент имеет свойство tag, которое может быть React компонентом
 * или реальным HTML тегом (строкой).
 *
 * Лучше использовать в паре с:
 * @see MergedComponentProps
 */
export interface MorphingHtmlComponentPropsWithoutRef<
    T extends HTMLElement | SVGElement = any,
> extends HtmlComponentProps<T>,
    Omit<MorphingComponentProps, 'ref'> {
}

/**
 * Компонент имеет свойство tag, которое может быть React компонентом
 * или реальным HTML тегом (строкой).
 * Также компонент имеет свойство ref.
 *
 * Лучше использовать в паре с:
 * @see MergedComponentProps
 */
export interface MorphingHtmlComponentProps<
    RefType extends HTMLElement | SVGElement = any,
> extends HtmlComponentProps<RefType>, MorphingComponentProps<RefType> {
}

/**
 * Объединение свойств 2-х компонентов для ситуации, когда один компонент может
 * использовать другой компонент внутри себя как основной.
 * При этом нужно иметь возможность передать часть свойств во внедряемый компонент.
 *
 * Подходит только для 1 варианта использования:
 * MorphingComponentProps<BaseComponentProps, InjectedComponentProps>.
 * В этом случае из InjectedComponentProps будут удалены свойства,
 * описанные в BaseComponentProps.
 * Это не всегда подходит, если BaseComponentProps, например
 * расширяет AllHTMLAttributes<HTMLElement> или HtmlComponentProps.
 *
 * Для решения этой проблемы можно использовать, например:
 * Omit<InjectedComponentProps, 'onClick' | 'children' | 'tag'> & BaseComponentProps
 *
 * Пример свойств базового компонента, где свойство tag может быть компонентом
 * со свойствами InjectedComponentProps:
 * @see MorphingHtmlComponentPropsWithoutRef
 */
export type MergedComponentProps<
    BaseComponentProps extends object,
    InjectedComponentProps extends object,
> = BaseComponentProps & Omit<InjectedComponentProps, keyof BaseComponentProps>

// Информация о не оптимизированной SVG иконке.
// Иконка может быть нестандартного размера и иметь сложную структуру.
// При этом иконку можно будет использовать так же как MDIIcon через компонент.
export interface SvgIconInfo {
    width: number
    height: number
    content: string
    // 'various' - различные способы окраски для разных элементов.
    // В этом случае иконка будет перекрашивать только stroke="#000" и fill="#000".
    // Все остальные случаи остаются "как есть".
    coloredBy: 'stroke' | 'fill' | 'various'
}

// Настройка количества колонок CSS Grid.
export interface CssGridColumnsConfig {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
}
