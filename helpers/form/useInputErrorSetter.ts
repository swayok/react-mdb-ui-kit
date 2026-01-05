import {
    Dispatch,
    SetStateAction,
    useCallback,
    useRef,
} from 'react'
import {InputValidationErrorMessageType} from '../../components/Input/InputTypes'
import {AnyObject} from '../../types'
import {setInputError} from './setInputError'

type SetValueFn<T> = (value: Readonly<T>) => T | Readonly<T>

type HookReturnFn<FormErrors> = (
    key: keyof FormErrors,
    message?: FormErrors[keyof FormErrors]
        | null
        | SetValueFn<FormErrors[keyof FormErrors] | null>
) => void

// Хук для создания функции, изменяющей ошибку в поле ввода.
export function useInputErrorSetter<
    FormErrors extends AnyObject = AnyObject<InputValidationErrorMessageType>,
>(
    setErrors: Dispatch<SetStateAction<FormErrors>>,
    callback?: (
        key: keyof FormErrors,
        message?: FormErrors[keyof FormErrors] | null
    ) => void
): HookReturnFn<FormErrors> {
    const callbackRef = useRef(callback)
    callbackRef.current = callback
    return useCallback((
        key: keyof FormErrors,
        message?: FormErrors[keyof FormErrors]
            | null
            | SetValueFn<FormErrors[keyof FormErrors] | null>
    ) => {
        setErrors(errors => setInputError<FormErrors>(
            errors,
            key,
            message,
            callbackRef.current
        ))
    }, [])
}
