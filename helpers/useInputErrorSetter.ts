import {
    Dispatch,
    SetStateAction,
    useCallback,
    useRef,
} from 'react'
import {AnyObject} from '../types'

// Хук для создания функции, изменяющей ошибку в поле ввода.
export function useInputErrorSetter<
    FormErrors extends AnyObject<string | null> = AnyObject<string | null>,
>(
    setErrors: Dispatch<SetStateAction<FormErrors>>,
    callback?: (key: keyof FormErrors, message?: string | null) => void
): (key: keyof FormErrors, message?: string | null) => void {
    const callbackRef = useRef(callback)
    return useCallback((key: keyof FormErrors, message?: string | null) => {
        setErrors(errors => setInputError<FormErrors>(
            errors,
            key,
            message
        ))
        callbackRef.current?.(key, message)
    }, [])
}

/** @deprecated */
export default useInputErrorSetter

// Добавить/удалить сообщение об ошибке для одного поля ввода.
export function setInputError<
    FormErrors extends AnyObject<string | null> = AnyObject<string | null>,
>(
    errors: FormErrors,
    key: keyof FormErrors,
    message?: string | null
): FormErrors {
    errors = Object.assign({}, errors)
    if (!message) {
        delete errors[key]
    } else {
        // @ts-ignore
        errors[key] = message
    }
    return errors
}
