import clsx from 'clsx'
import {Tooltip} from '../Tooltip/Tooltip'
import {InputWrapperProps} from './InputTypes'
import {InputValidationError} from './InputValidationError'

// Обертка для поля ввода и подписи к нему.
export function InputWrapper(props: InputWrapperProps) {

    const {
        withoutValidationMessage,
        invalid,
        validationMessage,
        validationMessageClassName,
        contrast,
        grouped,
        className,
        ...otherProps
    } = props

    const wrapperIsValidationMessageContainer: boolean = (
        !withoutValidationMessage
        && (invalid !== undefined || !!validationMessage)
    )

    const inputContainerClassName: string = clsx(
        'form-outline',
        contrast ? 'form-white' : null
    )

    const wrapperClassName: string = clsx(
        grouped ? 'flex-1' : null,
        typeof grouped === 'string' ? 'input-group-item ' + grouped : null,
        className
    )

    if (wrapperIsValidationMessageContainer) {
        return (
            <InputValidationError
                invalid={invalid ?? false}
                error={validationMessage}
                errorClassName={validationMessageClassName}
                inputContainerClassName={inputContainerClassName}
                className={wrapperClassName}
                {...otherProps}
            />
        )
    }

    return (
        <Tooltip
            {...otherProps}
            className={clsx(
                inputContainerClassName,
                wrapperClassName
            )}
        />
    )
}
