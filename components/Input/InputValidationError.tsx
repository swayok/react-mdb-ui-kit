import React, {AllHTMLAttributes, CSSProperties, useEffect, useState} from 'react'
import clsx from 'clsx'
import {AnyObject, NumericKeysObject} from '../../types/Common'
import Collapse from '../Collapse'

export interface InputValidationErrorProps extends AllHTMLAttributes<HTMLDivElement> {
    invalid: boolean,
    error?: string | Array<string> | AnyObject<string> | NumericKeysObject<string> | null,
    errorClassName?: string,
    inputContainerClassName?: string,
    inputContainerStyle?: CSSProperties,
}

// Отображение ошибки валидации для поля ввода.
function InputValidationError(props: InputValidationErrorProps) {

    const {
        className,
        invalid,
        error,
        errorClassName,
        inputContainerClassName,
        inputContainerStyle,
        children,
        ...otherProps
    } = props

    const [errorMessage, setErrorMessage] = useState<string | null>(normalizeErrorMessage(error))
    const [isInvalid, setIsInvalid] = useState<boolean>(!!(invalid && errorMessage))

    useEffect(() => {
        const normalizedError = normalizeErrorMessage(error)
        const isInvalid = !!(invalid && normalizedError)
        setIsInvalid(isInvalid)
        if (isInvalid) {
            setErrorMessage(normalizedError)
            return
        } else {
            const timer = setTimeout(() => {
                setErrorMessage(null)
            }, 300)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [invalid, error])

    return (
        <div
            className={clsx(
                'form-validation-container',
                className,
                isInvalid ? 'is-invalid' : null
            )}
            {...otherProps}
        >
            <div
                className={clsx('form-validation-input', inputContainerClassName)}
                style={inputContainerStyle}
            >
                {children}
            </div>
            <Collapse show={isInvalid} className={'form-validation-error-container'}>
                <div className={clsx('invalid-feedback', errorClassName)}>
                    {errorMessage}
                </div>
            </Collapse>
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

export default React.memo(InputValidationError)
