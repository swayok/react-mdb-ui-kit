import {AnyObject} from '../../types'

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
