import {CKEditorConfig} from 'ckeditor4-react'
import {CKEditorEventPayload} from 'ckeditor4-react/dist/types'
import clsx from 'clsx'
import {
    ChangeEvent,
    lazy,
    Suspense,
    useEffect,
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {getDefaultWysiwygConfig} from '../../helpers/vendor/getDefaultWysiwygConfig'
import {CKEditorInstance} from '../../types'
import {getInputClassName} from './helpers/getInputClassName'
import {getInputSize} from './helpers/getInputSize'
import {separateInputPropsAndLayoutProps} from './helpers/separateInputPropsAndLayoutProps'
import {InputLayout} from './InputLayout'
import {
    InputSize,
    WysiwygInputProps,
} from './InputTypes'

const CKEditorReact = lazy(async () => ({
    default: (await import('ckeditor4-react')).CKEditor,
}))

// Редактор HTML.
export function WysiwygInput(props: WysiwygInputProps) {
    const {
        layoutProps,
        inputProps,
    } = separateInputPropsAndLayoutProps<WysiwygInputProps>(props)

    const {
        config = getDefaultWysiwygConfig(),
        className,
        small,
        large,
        value,
        id,
        onChange,
        children,
        editorRef: propsEditorRef,
        inputRef: propsInputRef,
        disabled,
        ...otherProps
    } = inputProps

    const {
        UiComponent = null,
        ...otherLayoutProps
    } = layoutProps

    const editorRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const mergedEditorRef = useMergedRefs(
        editorRef,
        propsEditorRef
    )
    const mergedInputRef = useMergedRefs(
        propsInputRef,
        inputRef
    )

    const [
        ckeditorInstance,
        setCkEditorInstance,
    ] = useState<CKEditorInstance | null>(null)

    // value updater for ckeditor instance
    useEffect(() => {
        if (ckeditorInstance && value !== ckeditorInstance.getData(value)) {
            ckeditorInstance.setData(value)
        }
    }, [value, ckeditorInstance])

    useEffect(() => {
        ckeditorInstance?.setReadOnly(!!disabled)
    }, [disabled, ckeditorInstance])

    const handleChange = useEventCallback((
        e: CKEditorEventPayload<'change'>
    ) => {
        const editor: CKEditorInstance = e.editor as CKEditorInstance
        editor.element.$.value = editor.getData()
        const fakeEvent: ChangeEvent<HTMLTextAreaElement> = {
            bubbles: false,
            cancelable: false,
            currentTarget: editor.element.$,
            defaultPrevented: false,
            eventPhase: 0,
            isTrusted: false,
            nativeEvent: {} as Event,
            target: editor.element.$,
            timeStamp: Date.now(),
            isDefaultPrevented(): boolean {
                return false
            },
            isPropagationStopped(): boolean {
                return false
            },
            persist(): void {
            },
            preventDefault(): void {
            },
            stopPropagation(): void {
            },
            type: 'change',
        }
        onChange?.(fakeEvent)
    })

    let hasNotEmptyValue: boolean
    if (value === undefined) {
        // Не managed поле ввода.
        hasNotEmptyValue = (inputRef?.current?.value.length ?? 0) > 0
    } else {
        // Managed поле ввода.
        hasNotEmptyValue = (String(value ?? '').length ?? 0) > 0
    }
    const size: InputSize = getInputSize(small, large)

    const input = (
        <div
            ref={mergedEditorRef}
            className="input-ckeditor-wrapper"
        >
            <Suspense>
                <CKEditorReact
                    className={getInputClassName({
                        size,
                        active: true,
                        hasNotEmptyValue,
                        invalid: layoutProps.invalid,
                        textarea: true,
                        className,
                    })}
                    onBeforeLoad={(config: CKEditorConfig) => {
                        // Меняем timestamp, чтобы CSS/JS файлы, загружаемые для редактора, были актуальными.
                        // @ts-ignore
                        if (window.wysiwyg?.assetsVersion) {
                            // @ts-ignore
                            config.timestamp = window.wysiwyg.assetsVersion
                        }
                    }}
                    onInstanceReady={(e: CKEditorEventPayload<'instanceReady'>) => {
                        const editor: CKEditorInstance = e.editor as CKEditorInstance
                        setCkEditorInstance(editor)
                        // @ts-ignore - на самом деле так можно делать.
                        // noinspection JSConstantReassignment
                        mergedInputRef(editor.element.$)
                    }}
                    onChange={handleChange}
                    id={id}
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    {...otherProps as any}
                    config={config || {}}
                    readOnly={disabled}
                    disabled={disabled}
                    type="classic"
                    editorUrl="/vendor/ckeditor4/ckeditor.js"
                />
            </Suspense>
        </div>
    )

    return (
        <InputLayout
            {...otherLayoutProps}
            UiComponent={UiComponent}
            wrapperClassName={clsx(
                'ckeditor-container mb-4',
                disabled ? 'disabled' : null,
                layoutProps.invalid ? 'is-invalid' : null,
                layoutProps.wrapperClassName
            )}
            size={size}
            inputId={id}
            // Чтобы <label> был перед Полем ввода.
            addon={
                <>
                    {input}
                    {children}
                </>
            }
        />
    )
}
