import {AnyObject} from '../../types'
import {InputValidationErrorProps} from 'swayok-react-mdb-ui-kit/components/Input/InputTypes'

type SetValueFn<T> = (value: Readonly<T>) => T | Readonly<T>

// Добавить/удалить сообщение об ошибке для одного поля ввода.
export function setInputError<
    FormErrors extends AnyObject = AnyObject<InputValidationErrorProps['error']>,
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
        callback?.(key, undefined)
    } else {
        errors[key] = typeof message === 'function'
            // @ts-ignore
            ? message(errors[key])
            : message
        callback?.(key, errors[key])
    }
    return errors
}
