import {CKEditorConfig} from 'ckeditor4-react'
import {CKEditorEventPayload} from 'ckeditor4-react/dist/types'
import {CKEditorInstance} from '../types/Common'

// Получить стандартные настройки для CKEditor.
export default function getDefaultWysiwygConfig(
    language: string = 'en',
    onInstanceReady?: (event: CKEditorEventPayload<'instanceReady'>) => void
): CKEditorConfig {
    return {
        language,
        on: {
            instanceReady(event: CKEditorEventPayload<'instanceReady'>) {
                const editor: CKEditorInstance = event.editor as CKEditorInstance
                editor.setReadOnly(false)
                onInstanceReady?.(event)
            },
        },
        extraPlugins: 'base64image,justify',
        removeButtons: '',
        toolbar: [
            {
                name: 'clipboard',
                items: ['Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', 'PasteText'],
            },
            {
                name: 'editing',
                items: ['Scayt'],
            },
            {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'],
            },
            {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter'],
            },
            {
                name: 'links',
                items: ['Link', 'Unlink'],
            },
            {
                name: 'insert',
                items: ['base64image', /*'Image',*/ /*'Table',*/ 'HorizontalRule', 'SpecialChar'],
            },
        ],
        versionCheck: false,
    }
}

// Расширить стандартные настройки для CKEditor.
export function extendDefaultWysiwygConfig(
    extender: (config: CKEditorConfig) => void,
    language: string = 'en',
    onInstanceReady?: (event: CKEditorEventPayload<'instanceReady'>) => void
): CKEditorConfig {
    const config: CKEditorConfig = getDefaultWysiwygConfig(language, onInstanceReady)
    extender(config)
    return config
}
