import clsx from 'clsx'
import React, {AllHTMLAttributes, Suspense, useCallback, useEffect, useRef, useState} from 'react'
import {CKEditorConfig} from 'ckeditor4-react'
import {CKEditorEventPayload} from 'ckeditor4-react/dist/types'
import {AnyObject, CKEditorInstance, ReactComponentOrTagName} from '../../types/Common'
import InputValidationError, {InputValidationErrorProps} from './InputValidationError'
import withStable from '../../helpers/withStable'
import getDefaultWysiwygConfig from '../../helpers/getDefaultWysiwygConfig'

const CKEditorReact = React.lazy(async () => ({
    default: (await import('ckeditor4-react')).CKEditor,
}))

const activeInputLabelSizeMultipliers = {
    normal: 0.9,
    small: 0.9,
    large: 0.9,
}

export interface WysiwygInputProps extends AllHTMLAttributes<HTMLTextAreaElement> {
    // Контейнер CKEditor'а.
    editorRef?: React.RefObject<HTMLDivElement>,
    // Поле ввода внутри CKEditor'а.
    textareaRef?: React.RefObject<HTMLTextAreaElement>,
    config?: CKEditorConfig
    label?: string,
    labelId?: string,
    labelClass?: string,
    labelStyle?: React.CSSProperties,
    labelRef?: React.RefObject<HTMLLabelElement>,
    // Мультипликаторы размера label в активном состоянии.
    activeInputLabelSizeMultiplier?: number | {
        normal?: number,
        small?: number,
        large?: number
    },
    wrapperTag?: ReactComponentOrTagName,
    wrapperProps?: AnyObject,
    wrapperClass?: string,
    wrapperStyle?: React.CSSProperties,
    value?: string
    disabled?: boolean,
    small?: boolean,
    large?: boolean,
    contrast?: boolean,
    // Настройки валидности введенных данных.
    invalid?: boolean,
    validationMessage?: string | null,
    validationMessageClassName?: string,
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean,
    // Указать true, если label должен быть как будто поле ввода в активном состоянии.
    active?: boolean,
    // Указать true, если поле ввода внутри <InputGroup> и должно занимать всё свободное пространство.
    grouped?: boolean | 'first' | 'center' | 'last',
}

// Редактор HTML.
function WysiwygInput(props: WysiwygInputProps) {
    const {
        config = getDefaultWysiwygConfig(),
        className,
        small,
        large,
        contrast,
        value,
        id,
        labelId,
        labelClass,
        wrapperTag,
        wrapperClass = 'mb-4',
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
        ...otherProps
    } = props

    const labelEl = useRef<HTMLLabelElement>(null)
    const editorEl = useRef<HTMLDivElement>(null)
    const textareaEl = useRef<HTMLTextAreaElement>(null)

    const labelReference = labelRef ? labelRef : labelEl
    const editorReference = editorRef ? editorRef : editorEl
    const textareaReference = textareaRef ? textareaRef : textareaEl

    const [labelNotchWidth, setLabelNotchWidth] = useState<number | string>(0)

    const [ckeditorInstance, setCkEditorInstance] = useState<CKEditorInstance | null>(null)

    const wrapperIsValidationMessageContainer = !withoutValidationMessage && (invalid !== undefined || validationMessage)

    const wrapperClasses = clsx(
        'form-outline',
        contrast ? 'form-white' : null,
        !wrapperIsValidationMessageContainer && grouped ? 'flex-1' : null,
        wrapperIsValidationMessageContainer ? null : wrapperClass
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
    const labelClasses = clsx('form-label', labelClass)

    const updateLabelWidth = useCallback(
        () => {
            if (label && label.length) {
                if (labelReference.current && labelReference.current.clientWidth !== 0) {
                    let multiplier: number = activeInputLabelSizeMultipliers[size]
                    if (activeInputLabelSizeMultiplier && typeof activeInputLabelSizeMultiplier === 'object' && activeInputLabelSizeMultiplier[size]) {
                        multiplier = activeInputLabelSizeMultiplier[size] as number
                    }
                    setLabelNotchWidth(labelReference.current.clientWidth * multiplier + 8)
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
        ckeditorInstance?.setReadOnly(!!props.disabled)
    }, [props.disabled, ckeditorInstance])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e)
        },
        [onChange]
    )

    const additionalWrapperProps: AllHTMLAttributes<HTMLDivElement> = {}
    let WrapperTag: ReactComponentOrTagName = wrapperTag || 'div'
    if (wrapperIsValidationMessageContainer) {
        if (WrapperTag !== 'div') {
            console.warn(
                'Input component with validationMessage prop or defined invalid prop uses InputValidationError wrapper and ignores wrapperTag prop',
                {props}
            )
        }
        WrapperTag = InputValidationError;
        (additionalWrapperProps as InputValidationErrorProps).invalid = invalid === undefined ? false : invalid;
        (additionalWrapperProps as InputValidationErrorProps).error = validationMessage
        if (validationMessageClassName) {
            (additionalWrapperProps as InputValidationErrorProps).errorClassName = validationMessageClassName
        }
        (additionalWrapperProps as InputValidationErrorProps).inputContainerClassName = wrapperClasses
        additionalWrapperProps.className = clsx(grouped ? 'flex-1' : wrapperClass)
    } else {
        additionalWrapperProps.className = wrapperClasses
    }

    additionalWrapperProps.className = clsx(
        additionalWrapperProps.className,
        'ckeditor-container',
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
                        const fakeEvent: React.ChangeEvent<HTMLTextAreaElement> = {
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
                    readOnly={props.disabled}
                    disabled={props.disabled}
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

export default withStable<WysiwygInputProps>(
    ['onChange', 'onFocus', 'onBlur', 'onKeyDown', 'onBeforeInput', 'onPaste', 'onClick'],
    WysiwygInput
)
