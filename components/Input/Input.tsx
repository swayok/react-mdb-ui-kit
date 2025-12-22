import {
    ChangeEvent,
    ClipboardEvent,
    FocusEvent,
    InputEvent,
    KeyboardEvent,
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {UserBehaviorService} from '../../services/UserBehaviorService'
import {getInputClassName} from './helpers/getInputClassName'
import {getInputSize} from './helpers/getInputSize'
import {separateInputPropsAndLayoutProps} from './helpers/separateInputPropsAndLayoutProps'
import {InputLayout} from './InputLayout'
import {
    InputProps,
    InputSize,
} from './InputTypes'

// Поле ввода значения.
export function Input(props: InputProps) {

    const {
        layoutProps,
        inputProps,
    } = separateInputPropsAndLayoutProps<InputProps>(props)

    const {
        className,
        small,
        large,
        value,
        id,
        onChange,
        children,
        inputRef: propsInputRef,
        textarea,
        onBlur,
        onFocus,
        active,
        activeOnFocus = !props.readOnly && !props.disabled,
        onBeforeInput,
        onKeyDown,
        onPaste,
        allowedChars,
        trackBehaviorAs,
        ...otherProps
    } = inputProps

    const inputRef = useRef<HTMLInputElement>(null)

    const mergedInputRef = useMergedRefs(
        propsInputRef,
        inputRef
    )

    const [
        isFocused,
        setFocused,
    ] = useState<boolean>(false)

    const handleChange = useEventCallback((
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange?.(e)
    })

    const handlePaste = useEventCallback((
        e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onPaste()
        }
        onPaste?.(e)
        if (allowedChars && !e.isDefaultPrevented()) {
            e.preventDefault()
            const input = e.currentTarget
            const pastedText = e.clipboardData.getData('text')
            if (!pastedText || pastedText === '') {
                return
            }
            let cleanPastedText: string = ''
            for (const char of pastedText) {
                if (allowedChars.test(char)) {
                    cleanPastedText += char
                }
            }
            e.clipboardData.setData('text', cleanPastedText)
            input.value = input.value.substring(0, input.selectionStart ?? 0)
                + cleanPastedText
                + input.value.substring(input.selectionEnd ?? 0)
            // @ts-ignore
            handleChange(e)
        }
    })

    const handleBlur = useEventCallback((
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onBlur()
        }
        setFocused(false)
        onBlur?.(e)
    })

    const handleFocus = useEventCallback((
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onFocus(e.currentTarget, trackBehaviorAs)
        }
        setFocused(true)
        onFocus?.(e)
    })

    const handleOnBeforeInput = useEventCallback((
        e: InputEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (allowedChars) {
            const char: string = e.data
            // Отменяем введенный символ, если он не разрешен
            if (!allowedChars.test(char)) {
                e.preventDefault()
                return
            }
        }
        onBeforeInput?.(e)
    })

    const handleOnKeyDown = useEventCallback((
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onKeyDown(e)
        }
        onKeyDown?.(e)
    })

    if (layoutProps.hidden) {
        return null
    }

    let hasNotEmptyValue: boolean
    if (value === undefined) {
        // Не managed поле ввода.
        hasNotEmptyValue = (inputRef?.current?.value.length ?? 0) > 0
    } else {
        // Managed поле ввода.
        hasNotEmptyValue = (String(value ?? '').length ?? 0) > 0
    }
    const size: InputSize = getInputSize(small, large)

    const InputTag = textarea ? 'textarea' : 'input'

    return (
        <InputLayout
            {...layoutProps}
            size={size}
            inputId={id}
            addon={children}
        >
            <InputTag
                className={getInputClassName({
                    size,
                    active,
                    isFocused,
                    hasNotEmptyValue,
                    activeOnFocus,
                    invalid: layoutProps.invalid,
                    textarea,
                    className,
                })}
                onBlur={handleBlur}
                onChange={handleChange}
                onPaste={handlePaste}
                onFocus={handleFocus}
                onBeforeInput={handleOnBeforeInput}
                onKeyDown={handleOnKeyDown}
                value={value}
                id={id}
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                ref={mergedInputRef as any}
                {...otherProps}
            />
        </InputLayout>
    )
}
