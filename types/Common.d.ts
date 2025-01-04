import React, {AllHTMLAttributes, HTMLProps} from 'react'
import {DropdownItemProps} from '../components/Dropdown/DropdownItem'
import {NumeralJSLocale} from 'numeral'

// Объект, который может содержать любые ключи.
// Также можно указать набор ключей (Keys), которые, возможно, могут быть в объекте.
// Это удобно для абстрактных объектов получаемых извне и для подсказок в IDE.
export interface AnyObject<ValuesType = unknown, Keys = string> extends Record<Keys extends string ? Keys : keyof Keys, ValuesType> {
    [key: string]: ValuesType;
}

// Объект, в котором все ключи должны быть числами.
// По сути - это массив, в котором индексы не упорядочены.
export interface NumericKeysObject<ValuesType = unknown> {
    [key: number]: ValuesType;
}

// Информация о типе устройства и ширине страницы.
export type UILayout = {
    deviceType: 'desktop' | 'tablet' | 'mobile',
    isWide: boolean,
    bootstrapSize: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
}

// Все возможные цвета различных компонентов (зависит от стилей).
export type TextColors = 'default' | 'white' | 'muted' | 'secondary'
    | 'theme' | 'dark' | 'gray' | 'primary' | 'blue' | 'red' | 'green' | 'orange' | string
export type ButtonColors = 'none' | 'gray' | 'green' | 'red' | 'orange' | 'blue' | 'primary'
    | 'secondary' | 'link' | 'icon' | 'light' | 'dark' | string
export type BackgroundColors = 'transparent' | 'white' | 'gray' | 'green' | 'red' | 'orange'
    | 'blue' | 'primary' | 'light' | 'super-light' | 'dark' | 'body' | string
export type BorderColors = 'gray' | 'green' | 'red' | 'orange' | 'blue' | 'primary'
    | 'light' | 'dark' | 'secondary' | 'white' | string
export type NoteColors = 'primary' | 'secondary' | 'light'
    | 'success' | 'danger' | 'warning' | 'info' | string

// Минимальное и максимальное значение.
export type MinMax = {
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
    options: Array<FormSelectOption<Value, Extras>>;
    groupHeaderAttributes?: DropdownItemProps;
    optionsContainerAttributes?: HTMLProps<HTMLDivElement>;
    extra?: Extras;
}

// Список, содержащий только опции для SelectInput.
export type FormSelectOptionsList<Value = string, Extras = AnyObject> = FormSelectOption<Value, Extras>[]

// Опция или группа опция для SelectInput.
export type FormSelectOptionOrGroup<Value = string, Extras = AnyObject> = FormSelectOption<Value, Extras> | FormSelectOptionGroup<Value, Extras>

// Список содержащий и опции и группы опций для SelectInput.
export type FormSelectOptionsAndGroupsList<Value = string, Extras = AnyObject> = FormSelectOptionOrGroup<Value, Extras>[]

// Свойство этого типа может быть React компонентом или реальным HTML тегом (строкой).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactComponentOrTagName = React.ComponentProps<any>

// Компонент имеет свойство tag, которое может быть React компонентом или реальным HTML тегом (строкой).
export interface ComponentPropsWithModifiableTag<T extends HTMLElement = HTMLElement> extends AllHTMLAttributes<T> {
    tag?: ReactComponentOrTagName;
}

// Информация о не оптимизированной SVG иконке.
// Иконка может быть нестандартного размера и иметь сложную структуру.
// При этом иконку можно будет использовать так же как MDIIcon через компонент.
export type SvgIconInfo = {
    width: number,
    height: number,
    content: string,
    // 'various' - различные способы окраски для разных элементов.
    // В этом случае иконка будет перекрашивать только stroke="#000" и fill="#000".
    // Все остальные случаи остаются "как есть".
    coloredBy: 'stroke' | 'fill' | 'various',
}

// Переводы ошибок
export type HttpErrorsTranslations = {
    go_back: string,
    code401: {
        toast: string,
    },
    code403: {
        title: string,
        message: string,
        toast: string,
    },
    code404: {
        title: string,
        message: string,
        toast: string,
    },
    code408: {
        toast: string,
    },
    code419: {
        toast: string,
    },
    code422: {
        toast: string,
    },
    code426: {
        toast: string,
    },
    code429: {
        toast: string,
    },
    code4xx: {
        toast: string,
    },
    code500: {
        title: string,
        message: string,
        toast: string,
    },
    unknown: {
        toast: string,
    },
    js_error: {
        title: string,
        message: string,
        toast: string,
    },
    code503: {
        title: string,
        message: string,
        toast: string,
    },
    code501: {
        toast: string,
    },
    code502: {
        toast: string,
    },
    code504: {
        toast: string,
    },
    code5xx: {
        toast: string,
    },
    axios: {
        toast: string,
    },
    response_parsing: {
        toast: string,
    },
}

/**
 * Базовый набор настроек локали для LocaleManager.
 * @see LocalesManager
 */
export interface BasicLocaleConfig {
    // Код языка локали: vi, ru, ...
    language: string;
    // Код региона локали: vn, ru, ...
    region: string,
    // Код локали: vi-VN, ru-RU, ...
    full: string;
    // Название локали для выпадающего меню смены локали.
    label: string;
    // Название языка для выпадающего меню смены локали.
    languageLabel: string,
    // Вариации локали в нижнем регистре.
    variations: string[];
    // Загрузчик словаря для приложения и всех сторонних пакетов (datetime и т.п.).
    // Должен вернуть словарь для приложения.
    loader: () => Promise<AnyObject>;
    // Настройки форматирования чисел.
    numeral: {
        localeConfig: NumeralJSLocale,
        defaultFormat: string,
    };
    dateTime: {
        /**
         * Формат даты для DateTimeService.
         * По умолчанию: L.
         *
         * @see https://day.js.org/docs/en/display/format
         * @see https://day.js.org/docs/en/plugin/localized-format
         */
        dateFormat?: 'L' | string,
    }
}

// Часть методов и свойств CKEditor.
export type CKEditorInstance = {
    getData: (rawValue?: string) => string,
    setData: (rawValue?: string) => string,
    setReadOnly: (value: boolean) => void,
    element: {
        $: HTMLTextAreaElement,
    },
    container: {
        $: HTMLDivElement,
    },
}