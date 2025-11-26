import React, {useCallback, useMemo, useState} from 'react'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import useInputErrorSetter from './useInputErrorSetter'

type SetValueFn<T> = (value: Readonly<T>) => T | Readonly<T>

// Возвращаемые хуком значения и методы.
export interface FormValuesHookReturn<
    FormData extends AnyObject,
    FormErrors extends AnyObject = Partial<Record<keyof FormData, string | null>>
> {
    // Начальные значения полей ввода.
    initialFormValues: Readonly<FormData>
    // Значения полей ввода.
    formValues: Readonly<FormData>
    // Задать все значения формы.
    setFormValues: (
        values: FormData | ((state: Readonly<FormData>) => FormData),
        // Сбросить флаг formHasChanges в false.
        resetHasChangesFlag?: boolean
    ) => void
    // Задать часть значений формы.
    setSomeFormValues: (values: Partial<FormData>) => void
    // Задать одно значение формы.
    setFormValue: <Key extends keyof FormData>(
        key: Key,
        value: FormData[Key] | SetValueFn<FormData[Key]>,
        resetError?: boolean | keyof FormErrors
    ) => void
    // Были ли изменения в данных формы относительно начальных значений.
    formHasChanges: boolean
    // Задать флаг наличия изменений в данных формы.
    setFormHasChanges: (value: boolean) => void
    // Сброс значений полей ввода в initialFormValues.
    reset: () => void
    // Ошибки полей ввода.
    formErrors: Readonly<FormErrors>
    setFormErrors: (
        values: Partial<FormErrors> | ((state: Readonly<FormErrors>) => FormErrors),
        // Объединить с существующими ошибками или заменить полностью?
        // Не работает, если values - функция.
        merge?: boolean
    ) => void
    setFormError: (key: keyof FormErrors, message: string | null) => void
    // Состояние отправки данных в API.
    isSubmitting: Readonly<boolean>
    setIsSubmitting: (value: boolean | ((prevState: boolean) => boolean)) => void
}

// Хук для стандартной работы с данными формы.
// Дает возможность управления данными формы и ошибками.
export default function useFormValues<
    FormData extends AnyObject,
    FormErrors extends AnyObject = Partial<Record<keyof FormData, string | null>>
>(
    initialValues: FormData | (() => FormData),
    deps?: React.DependencyList,
    errorCallback?: (key: keyof FormErrors, message?: string | null) => void
): FormValuesHookReturn<FormData, FormErrors> {

    // Кеширование начальных значений.
    const initialValuesMemo: FormData = useMemo(
        (): FormData => typeof initialValues === 'function' ? initialValues() : initialValues,
        deps ?? []
    )

    // Данные формы.
    const [
        formValues,
        setFormValuesState,
    ] = useState<FormData>({...initialValuesMemo})
    // Ошибки полей ввода формы.
    const [
        formErrors,
        setFormErrors,
    ] = useState<FormErrors>({} as FormErrors)

    const [
        formHasChanges,
        setFormHasChanges,
    ] = useState<boolean>(false)

    // Задать ошибку для ключа.
    const setFormError = useInputErrorSetter<FormErrors>(
        setFormErrors,
        errorCallback
    )

    // Задать значение для ключа.
    const setFormValue = useCallback(
        <Key extends keyof FormData>(
            key: Key,
            value: FormData[Key] | SetValueFn<FormData[Key]>,
            resetError: boolean | keyof FormErrors = true
        ): void => {
            setFormValues(state => ({
                ...state,
                [key]: (typeof value === 'function' ? (value as SetValueFn<FormData[Key]>)(state[key]) : value),
            }))
            if (resetError) {
                // noinspection SuspiciousTypeOfGuard
                setFormError(
                    typeof resetError === 'boolean'
                        ? key as unknown as keyof FormErrors
                        : resetError,
                    null
                )
            }
        },
        []
    )

    // Обертка над setFormValuesState для отслеживания наличия изменений в данных формы.
    const setFormValues: FormValuesHookReturn<FormData, FormErrors>['setFormValues'] = useCallback(
        (
            values: FormData | ((state: Readonly<FormData>) => FormData),
            resetChangesFlag?: boolean
        ): void => {
            setFormValuesState(values)
            setFormHasChanges(!resetChangesFlag)
        },
        []
    )

    // Состояние отправки данных в API.
    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState<boolean>(false)

    return {
        initialFormValues: initialValuesMemo,
        formValues,
        setFormValues,
        setSomeFormValues: useCallback(
            (
                values: Partial<FormData> | ((state: Readonly<FormData>) => FormData)
            ): void => {
                if (typeof values === 'function') {
                    setFormValues(values)
                } else {
                    setFormValues(state => ({
                        ...state,
                        ...values,
                    }))
                }
            },
            []
        ),
        setFormValue,

        formHasChanges,
        setFormHasChanges,

        reset: useCallback(() => {
            setFormValues(initialValuesMemo)
        }, [initialValuesMemo]),

        formErrors,
        setFormErrors: useCallback(
            (
                values: Partial<FormErrors> | ((state: Readonly<FormErrors>) => FormErrors),
                merge: boolean = false
            ): void => {
                if (typeof values === 'function') {
                    setFormErrors(values)
                } else if (merge) {
                    setFormErrors(state => ({
                        ...state,
                        ...values,
                    }))
                } else {
                    setFormErrors(values as FormErrors)
                }
            },
            []
        ),
        setFormError,

        isSubmitting,
        setIsSubmitting,
    }
}
