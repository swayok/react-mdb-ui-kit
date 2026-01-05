import {InputValidationErrorMessageType} from '../../components/Input/InputTypes'
import {AnyObject} from '../../types'

type SetValueFn<T> = (value: Readonly<T>) => T | Readonly<T>

// Добавить/удалить сообщение об ошибке для одного поля ввода.
export function setInputError<
    FormErrors extends AnyObject = AnyObject<InputValidationErrorMessageType>,
>(
    errors: FormErrors,
    key: keyof FormErrors,
    message?: FormErrors[keyof FormErrors] | null | SetValueFn<FormErrors[keyof FormErrors] | null>,
    callback?: (
        key: keyof FormErrors,
        message?: FormErrors[keyof FormErrors] | null
    ) => void
): FormErrors {
    errors = Object.assign({}, errors)
    if (!message) {
        delete errors[key]
    } else if (typeof message === 'function') {
        const fn: SetValueFn<FormErrors[keyof FormErrors] | null> = message
        errors[key] = fn(errors[key]) as FormErrors[keyof FormErrors]
    } else {
        errors[key] = message
    }
    callback?.(key, errors[key] ?? undefined)
    return errors
}
