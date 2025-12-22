import {CKEditorConfig} from 'ckeditor4-react'
import {CKEditorEventPayload} from 'ckeditor4-react/dist/types'
import clsx from 'clsx'
import {
    ChangeEvent,
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import {getDefaultWysiwygConfig} from '../../helpers/vendor/getDefaultWysiwygConfig'
import {
    CKEditorInstance,
    HtmlComponentProps,
    ReactComponentOrTagName,
} from '../../types'
import {
    InputValidationErrorProps,
    WysiwygInputProps,
} from './InputTypes'
import {InputValidationError} from './InputValidationError'

const CKEditorReact = lazy(async () => ({
    default: (await import('ckeditor4-react')).CKEditor,
}))

const activeInputLabelSizeMultipliers = {
    normal: 0.9,
    small: 0.9,
    large: 0.9,
}

// Редактор HTML.
export function WysiwygInput(props: WysiwygInputProps) {
    const {
        config = getDefaultWysiwygConfig(),
        className,
        small,
        large,
        contrast,
        value,
        id,
        labelId,
        labelClassName,
        wrapperTag = 'div',
        wrapperClassName = 'mb-4',
        wrapperStyle,
        wrapperProps,
        label,
        onChange,
        children,
        labelRef,
        labelStyle,
        editorRef,
        textareaRef,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        invalid,
        grouped,
        active,
        activeInputLabelSizeMultiplier,
        disabled,
        ...otherProps
    } = props

    const labelEl = useRef<HTMLLabelElement>(null)
    const editorEl = useRef<HTMLDivElement>(null)
    const textareaEl = useRef<HTMLTextAreaElement>(null)

    const labelReference = labelRef ?? labelEl
    const editorReference = editorRef ?? editorEl
    const textareaReference = textareaRef ?? textareaEl

    const [
        labelNotchWidth,
        setLabelNotchWidth,
    ] = useState<number | string>(0)

    const [
        ckeditorInstance,
        setCkEditorInstance,
    ] = useState<CKEditorInstance | null>(null)

    const wrapperIsValidationMessageContainer = (
        !withoutValidationMessage
        && (invalid !== undefined || validationMessage)
    )

    const wrapperClasses = clsx(
        'form-outline',
        contrast ? 'form-white' : null,
        !wrapperIsValidationMessageContainer && grouped ? 'flex-1' : null,
        wrapperIsValidationMessageContainer ? null : wrapperClassName
    )
    let size: 'normal' | 'small' | 'large' = 'normal'
    if (small && !large) {
        size = 'small'
    } else if (large && !small) {
        size = 'large'
    }
    const inputClasses = clsx(
        'form-control',
        'active',
        size === 'small' ? 'form-control-sm' : null,
        size === 'large' ? 'form-control-lg' : null,
        invalid ? 'is-invalid' : null,
        className
    )
    const labelClasses = clsx('form-label', labelClassName)

    const updateLabelWidth = useCallback(
        () => {
            if (label?.length) {
                if (labelReference.current && labelReference.current.clientWidth !== 0) {
                    let multiplier: number = activeInputLabelSizeMultipliers[size]
                    if (activeInputLabelSizeMultiplier && typeof activeInputLabelSizeMultiplier === 'object' && activeInputLabelSizeMultiplier[size]) {
                        multiplier = activeInputLabelSizeMultiplier[size]!
                    }
                    setLabelNotchWidth((labelReference.current.clientWidth * multiplier) + 8)
                } else if (labelNotchWidth === 0) {
                    setLabelNotchWidth('80%')
                    setTimeout(updateLabelWidth, 500)
                }
            }
        },
        [
            label,
            labelReference.current,
            labelReference.current?.clientWidth,
            activeInputLabelSizeMultiplier,
        ]
    )

    useEffect(
        updateLabelWidth,
        [updateLabelWidth]
    )

    // value updater for ckeditor instance
    useEffect(() => {
        if (ckeditorInstance && value !== ckeditorInstance.getData(value)) {
            ckeditorInstance.setData(value)
        }
    }, [value, ckeditorInstance])

    useEffect(() => {
        ckeditorInstance?.setReadOnly(!!disabled)
    }, [disabled, ckeditorInstance])

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e)
        },
        [onChange]
    )

    const additionalWrapperProps: HtmlComponentProps<HTMLDivElement> & Partial<InputValidationErrorProps> = {}
    let WrapperTag: ReactComponentOrTagName = wrapperTag
    if (wrapperIsValidationMessageContainer) {
        if (WrapperTag !== 'div') {
            console.warn(
                'Input component with validationMessage prop or defined invalid prop uses InputValidationError wrapper and ignores wrapperTag prop',
                {props}
            )
        }
        WrapperTag = InputValidationError
        additionalWrapperProps.invalid = invalid ?? false
        additionalWrapperProps.error = validationMessage
        if (validationMessageClassName) {
            additionalWrapperProps.errorClassName = validationMessageClassName
        }
        additionalWrapperProps.inputContainerClassName = wrapperClasses
        additionalWrapperProps.className = clsx(grouped ? 'flex-1' : wrapperClassName)
    } else {
        additionalWrapperProps.className = wrapperClasses
    }

    additionalWrapperProps.className = clsx(
        additionalWrapperProps.className,
        'ckeditor-container',
        disabled ? 'disabled' : null,
        invalid ? 'is-invalid' : null
    )

    const input = (
        <div
            ref={editorReference}
            className="input-ckeditor-wrapper"
        >
            <Suspense>
                <CKEditorReact
                    className={inputClasses}
                    onFocus={updateLabelWidth}
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
                        textareaReference.current = editor.element.$
                    }}
                    onChange={(e: CKEditorEventPayload<'change'>) => {
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
                        handleChange(fakeEvent)
                    }}
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
        <WrapperTag
            style={{...wrapperStyle}}
            {...additionalWrapperProps}
            {...wrapperProps}
        >
            {input}
            {label && (
                <label
                    className={labelClasses}
                    style={labelStyle}
                    id={labelId}
                    htmlFor={id}
                    ref={labelReference}
                >
                    {label}
                </label>
            )}
            {children}
        </WrapperTag>
    )
}
