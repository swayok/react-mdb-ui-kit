import clsx from 'clsx'
import {
    useEffect,
    useState,
} from 'react'
import {Collapse} from '../Collapse'
import {Tooltip} from '../Tooltip/Tooltip'
import {TooltipProps} from '../Tooltip/TooltipTypes'
import {InputValidationErrorProps} from './InputTypes'

// Отображение ошибки валидации для поля ввода.
export function InputValidationError(props: InputValidationErrorProps) {

    const {
        className,
        invalid,
        error,
        errorClassName,
        inputContainerClassName,
        inputContainerStyle,
        children,
        // Tooltip:
        title,
        tooltipPlacement,
        tooltipMaxWidth,
        tooltipOffset,
        tooltipTextClassName,
        tooltipDisableClickHandler,
        tooltipDisableHover,
        ...otherProps
    } = props

    const normalizedErrorMessage = normalizeErrorMessage(error)
    const show: boolean = !!(invalid && normalizedErrorMessage)

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(normalizedErrorMessage)

    // Отслеживание изменения ошибки.
    useEffect(() => {
        if (show) {
            setErrorMessage(normalizedErrorMessage)
            return
        }
    }, [show, normalizedErrorMessage])

    // Свойства всплывающей подсказки.
    const tooltipProps: TooltipProps = {
        title,
        tooltipPlacement,
        tooltipMaxWidth,
        tooltipOffset,
        tooltipTextClassName,
        tooltipDisableClickHandler,
        tooltipDisableHover,
    }

    return (
        <div
            className={clsx(
                'form-validation-container',
                className,
                show ? 'is-invalid' : null
            )}
            {...otherProps}
        >
            <Tooltip
                className={clsx('form-validation-input', inputContainerClassName)}
                style={inputContainerStyle}
                {...tooltipProps}
            >
                {children}
            </Tooltip>
            {errorMessage !== null && (
                <Collapse
                    show={show}
                    className="form-validation-error-container"
                    onTransitionEnd={opened => {
                        if (!opened) {
                            setErrorMessage(null)
                        }
                    }}
                >
                    <div className={clsx('invalid-feedback', errorClassName)}>
                        {errorMessage}
                    </div>
                </Collapse>
            )}
        </div>
    )
}

function normalizeErrorMessage(error: InputValidationErrorProps['error']): string | null {
    if (!error) {
        return null
    }
    if (typeof error === 'string') {
        return error.trim() === '' ? null : error
    }
    if (Array.isArray(error)) {
        return error.length === 0 ? null : error.join('; ')
    }
    const errors = Object.values(error)
    return errors.length === 0 ? null : errors.join('; ')
}

/** @deprecated */
export default InputValidationError
