import type {AllHTMLAttributes, ComponentProps, ForwardedRef, HTMLProps, MutableRefObject, RefObject} from 'react'
import type {DropdownItemProps} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'

// Объект, который может содержать любые ключи.
// Также можно указать набор ключей (Keys), которые, возможно, могут быть в объекте.
// Это удобно для абстрактных объектов получаемых извне и для подсказок в IDE.
// @ts-ignore TS ругается на невозможность расширения интерфейса таким образом, но IDE отлично с этим работает.
export interface AnyObject<ValuesType = any, Keys extends string | number | object = string> extends Record<
    Keys extends string ? Keys | string : Keys extends number ? Keys : keyof Keys | string,
    ValuesType
> {
    [key: string]: ValuesType
}

// Объект, который может содержать любые ключи в виде интерфейса.
export interface AnyObjectInterface<ValuesType = any> extends Partial<Record<string, ValuesType>> {}

// Объект с опциональным наличием значения для всех ключей.
export type PartialRecord<Keys extends number | string | symbol = string, ValuesType = any> = Partial<Record<Keys, ValuesType>>

// Объект, в котором все ключи должны быть числами.
// По сути - это массив, в котором индексы не упорядочены.
export type NumericKeysObject<ValuesType = any> = Record<number, ValuesType>;

// Ref любого вида.
export type AnyRefObject<RefType = any, ApiType = any> = RefObject<RefType & ApiType>
    | MutableRefObject<RefType & ApiType>
    | ForwardedRef<RefType & ApiType>

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
    min: number,
    max: number
}

// Возможные данные ответа от сервера.
export interface ApiResponseData extends AnyObject {
    _message?: string;
    _message_type?: 'info' | 'success' | 'error' | 'notice';
    _redirect?: string;
    _redirect_back?: string;
}

// Опция для SelectInput.
export interface FormSelectOption<Value = string, Extras = AnyObject> extends AnyObject {
    label: string;
    value: Value;
    attributes?: DropdownItemProps | AllHTMLAttributes<unknown>;
    disabled?: boolean;
    extra?: Extras;
}

// Группа опций для SelectInput.
export interface FormSelectOptionGroup<Value = string, Extras = AnyObject> extends AnyObject {
    label: string;
    options: FormSelectOption<Value, Extras>[];
    groupHeaderAttributes?: DropdownItemProps;
    optionsContainerAttributes?: HTMLProps<HTMLDivElement>;
    extra?: Extras;
}

// Список, содержащий только опции для SelectInput.
export type FormSelectOptionsList<Value = string, Extras = AnyObject> = FormSelectOption<Value, Extras>[]

// Опция или группа опция для SelectInput.
export type FormSelectOptionOrGroup<Value = string, Extras = AnyObject> =
    FormSelectOption<Value, Extras>
    | FormSelectOptionGroup<Value, Extras>

// Список содержащий и опции и группы опций для SelectInput.
export type FormSelectOptionsAndGroupsList<Value = string, Extras = AnyObject> =
    FormSelectOptionOrGroup<Value, Extras>[]
    | FormSelectOptionGroup<Value, Extras>[]

// Свойство этого типа может быть React компонентом или реальным HTML тегом (строкой).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactComponentOrTagName = ComponentProps<any>

// Компонент имеет свойство tag, которое может быть React компонентом или реальным HTML тегом (строкой).
export interface ComponentPropsWithModifiableTag extends AllHTMLAttributes<HTMLElement> {
    tag?: ReactComponentOrTagName
}

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
    xs?: number,
    sm?: number,
    md?: number,
    lg?: number,
    xl?: number,
    xxl?: number,
}
