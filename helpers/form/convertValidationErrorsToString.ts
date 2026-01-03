import {InputValidationErrorProps} from 'swayok-react-mdb-ui-kit/components/Input/InputTypes'

// Преобразование списка/объекта ошибок в одну строку.
export function convertValidationErrorsToString(
    errors?: InputValidationErrorProps['error']
): string | undefined {
    if (!errors) {
        return undefined
    }
    if (typeof errors === 'string') {
        return errors.trim() === '' ? undefined : errors
    }
    if (Array.isArray(errors)) {
        return errors.length === 0
            ? undefined
            : errors.map(
                message => message.replace(/[.,;]+$/, '')
            )
                .join('; ') + '.'
    }
    if (typeof errors === 'object') {
        return Object.values(errors)
            .flatMap(nestedErrors => convertValidationErrorsToString(nestedErrors))
            .filter(message => !!message && message.trim() !== '')
            .map(
                message => message?.replace(/[.,;]+$/, '')
            )
            .filter(message => !!message && message.trim() !== '')
            .join('; ') + '.'
    }
    return String(errors)
}
