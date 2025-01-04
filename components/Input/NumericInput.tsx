import React, {useCallback, useEffect, useRef, useState} from 'react'
import Input, {InputProps} from './Input'
import numeral from 'numeral'
import withStable from '../../helpers/withStable'

export interface NumericInputProps extends Omit<InputProps, 'onChange'> {
    /**
     * Формат, совместимый с numeral().format().
     * @see http://numeraljs.com/#format
     */
    numeralFormat?: string,
    // Разрешить отрицательные числа?
    allowNegative?: boolean;
    decimalSeparator?: '.' | ',',
    onChange: (
        e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
        formattedValue: string,
        cleanValue: number|null
    ) => void;
}

// Поле ввода числа.
function NumericInput(props: NumericInputProps) {

    const {
        onChange,
        onFocus,
        onBlur,
        onClick,
        inputRef,
        value,
        decimalSeparator = '.',
        numeralFormat = '0[.]0[0]',
        allowNegative = false,
        allowedChars = allowNegative ? /[0-9.,-]/ : /[0-9.,]/,
        // Кол-во цифр в целой части вводимого числа.
        maxLength,
        min,
        max,
        children,
        ...otherProps
    } = props

    const fallbackInputRef = useRef<HTMLInputElement>(null)
    const [focused, setFocused] = useState<boolean>(false)

    const cursorPosition = useRef<number|null>(null)

    const inputReference = inputRef || fallbackInputRef

    useEffect(() => {
        if (inputReference.current && focused) {
            if (cursorPosition !== null) {
                inputReference.current.setSelectionRange(cursorPosition.current, cursorPosition.current)
                cursorPosition.current = null
            }
        }
    }, [inputReference.current, value, focused])

    // Форматирование значения по шаблону.
    const formatValue = useCallback((value: string): string => {
        if (value.length === 0) {
            return ''
        }
        // Заменяем разделитель дробной части.
        value = value.replace(',', '.')
        // Ограничиваем значение по min-max, если эти свойства заданы.
        let normalizedValue: number | null = numeral(parseFloat(value) || value).value()
        if (normalizedValue !== null) {
            if (min !== undefined && normalizedValue < parseFloat(min as string)) {
                normalizedValue = parseFloat(min as string)
            }
            if (max !== undefined && normalizedValue > parseFloat(max as string)) {
                normalizedValue = parseFloat(max as string)
            }
        }
        let formatted: string = numeral(normalizedValue).format(numeralFormat)
        const lastChar: string = value[value.length - 1]
        if (
            (lastChar === '.' || lastChar === ',')
            && /\./.test(numeralFormat)
        ) {
            // Последний символ - точка или запятая (разделитель целой и дробной части)
            // и форматирование допускает дробную часть: добавляем правильный разделитель в конец.
            formatted += decimalSeparator
        }
        return formatted
    }, [numeralFormat, min, max])

    // Очистка значения.
    const cleanValue = useCallback((value: string): number|null => {
        if (value.length === 0) {
            return null
        }
        return numeral(value).value()
    }, [])

    // Поиск правильной позиции курсора.
    const findCursorPosition = useCallback(
        (value: string, currentCursorPosition: number): number => {
            if (currentCursorPosition >= value.length) {
                return value.length
            }
            if (currentCursorPosition <= 0) {
                return 0
            }
            return currentCursorPosition
        },
        []
    )

    // Проверка лимита целой части.
    const onBeforeInput = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const char: string = (event as React.CompositionEvent<HTMLInputElement>).data
        if (!/^[0-9]$/.test(char)) {
            // Не цифра.
            if (event.currentTarget.selectionStart === 0) {
                // Первый символ, введенный в поле ввода, не цифра.
                if (allowNegative && char === '-') {
                    // Введен минус, и негативные значения разрешены.
                    if (event.currentTarget.value.length > 0 && event.currentTarget.value[0] === '-') {
                        // Минус уже есть в значении: игнорируем ввод.
                        event.preventDefault()
                    }
                    // Минуса еще нет в значении: пропускаем без проверок.
                    return
                }
            }
            // В остальных случаях: игнорируем ввод.
            event.preventDefault()
            return
        }

        if (event.currentTarget.value.length === 0) {
            // Первая цифра: пропускаем без проверок.
            return
        }

        // Вычисление нового числа (строка).
        const prevValue: string = event.currentTarget.value
        const newValue = prevValue.substring(0, event.currentTarget.selectionStart as number)
            + char + prevValue.substring(event.currentTarget.selectionEnd as number, prevValue.length)

        // Конвертируем вычисленное число (string) в число (number).
        const normalizedNumber: number | null = numeral(newValue).value()
        if (!normalizedNumber) {
            // Не число? Не знаю, как это может случиться, но лучше подстраховаться.
            event.preventDefault()
            return
        }
        if (!maxLength) {
            // Нет лимита по длине целой части: пропускаем.
            return
        }
        if (Math.abs(Math.floor(normalizedNumber)).toString().length > maxLength) {
            // Перебор чисел в целой части: игнорируем ввод.
            event.preventDefault()
            return
        }
    }

    return (
        <Input
            inputRef={inputReference}
            {...otherProps}
            value={value ? formatValue(value) : ''}
            allowedChars={allowedChars}
            onBeforeInput={onBeforeInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = formatValue(event.currentTarget.value)
                const nextCursorPosition = findCursorPosition(
                    value,
                    event.currentTarget.selectionStart || 0
                )
                cursorPosition.current = nextCursorPosition
                event.currentTarget.setSelectionRange(nextCursorPosition, nextCursorPosition)
                onChange(event, value, cleanValue(event.currentTarget.value))
            }}
            onPaste={(event: React.ClipboardEvent<HTMLInputElement>) => {
                if (event.currentTarget.value === '') {
                    // Нет значения: разрешаем вставку.
                    return
                }
                if (
                    event.currentTarget.selectionStart === 0
                    && event.currentTarget.selectionEnd === event.currentTarget.value.length
                ) {
                    // Полная замена текущего значения: разрешаем вставку.
                    return
                }
                // В любом другом случае - запрещаем вставку.
                event.preventDefault()
            }}
            onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                setFocused(true)
                if (props.value === '') {
                    onChange(event, '', null)
                }
                onFocus?.(event)
            }}
            onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                if (focused) {
                    const input = event.currentTarget
                    if (input.selectionStart === input.selectionEnd) {
                        const position = findCursorPosition(
                            input.value,
                            input.selectionStart || 0
                        )
                        input.setSelectionRange(position, position)
                    }
                }
                onClick?.(event)
            }}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                setFocused(false)
                onBlur?.(event)
            }}
        >
            {children}
        </Input>
    )
}

export default withStable(
    ['onChange', 'onBlur', 'onFocus', 'onClick'],
    NumericInput
)
