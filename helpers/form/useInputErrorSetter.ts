import {
    Dispatch,
    SetStateAction,
    useCallback,
    useRef,
} from 'react'
import {AnyObject} from '../../types'
import {setInputError} from './setInputError'

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
