// Настройки Wysiwyg редактора для window.wysiwyg.
import {AnyObject} from './Common'

export interface WysiwygGlobalConfigType {
    // Версия CSS/JS файлов, загружаемых в Wysiwyg редактор.
    assetsVersion?: string
    // Путь к CSS файлу для iframe внутри Wysiwyg редактора.
    cssUrl?: string
}

// Часть методов и свойств CKEditor.
export interface CKEditorInstance {
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

// Настройки CKEditor, передаваемые через window.CKEDITOR.
export interface CKEditorGlobalConfigType {
    timestamp: string
    stylesSet: {
        add: (name: string, styles: CKEditorStyleDropdownItemConfigType[]) => void
    }
}

// Настройки элемента в выпадающем меню со списком стилей в CKEditor.
export interface CKEditorStyleDropdownItemConfigType {
    name: string
    element?: string
    styles?: AnyObject<string>
    attributes?: AnyObject<string, keyof HTMLElement>
    type?: 'widget' | string
    widget?: string
    group?: string
}
