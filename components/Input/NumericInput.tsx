import numeral from 'numeral'
import {
    ChangeEvent,
    ClipboardEvent,
    CompositionEvent,
    FocusEvent,
    FormEvent,
    MouseEvent,
    useMemo,
    useRef,
} from 'react'
import {Input} from './Input'
import {
    InputProps,
    NumericInputProps,
} from './InputTypes'

// Поле ввода числа.
export function NumericInput(props: NumericInputProps) {

    // Переименование переменных требуется, чтобы в eventHandlers точно не использовались
    // никакие значения из props напрямую.
    const {
        onChange: propsOnChange,
        value: propsValue,
        decimalSeparator: propsDecimalSeparator = numeral.localeData().delimiters.decimal,
        numeralFormat: propsNumeralFormat = '0[.]0[00000]',
        allowNegative: propsAllowNegative = false,
        allowedChars: propsAllowedChars = propsAllowNegative ? /[0-9.,-]/ : /[0-9.,]/,
        children,
        ...otherProps
    } = props

    // Данные для вспомогательных функций.
    const utilityFnSettingsRef = useRef<UtilityFnSettings>(null)
    utilityFnSettingsRef.current = {
        numeralFormat: propsNumeralFormat,
        decimalSeparator: propsDecimalSeparator,
        min: props.min,
        max: props.max,
        allowNegative: propsAllowNegative,
        maxLength: props.maxLength,
    }

    // Обработчики событий, переданные через props.
    const propEventHandlersRef = useRef<
        Pick<NumericInputProps, 'onChange' | 'onFocus' | 'onClick'>
    >(undefined)
    propEventHandlersRef.current = {
        onChange: propsOnChange,
        onFocus: props.onFocus,
        onClick: props.onClick,
    }

    // Обработчики событий поля ввода.
    const eventHandlers: Pick<
        InputProps,
        'onChange' | 'onPaste' | 'onFocus' | 'onClick' | 'onBeforeInput'
    > = useMemo(() => ({
        onChange(event: ChangeEvent<HTMLInputElement>) {
            const newValue = formatValue(event.currentTarget.value, utilityFnSettingsRef.current!)
            const nextCursorPosition = findCursorPosition(
                newValue,
                event.currentTarget.value,
                event.currentTarget.selectionStart ?? 0
            )
            event.currentTarget.value = newValue
            event.currentTarget.setSelectionRange(nextCursorPosition, nextCursorPosition)
            propEventHandlersRef.current!.onChange(
                event,
                newValue,
                cleanValue(event.currentTarget.value)
            )
        },
        onPaste(event: ClipboardEvent<HTMLInputElement>) {
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
        },
        onFocus(event: FocusEvent<HTMLInputElement>) {
            if (event.currentTarget.value === '') {
                propEventHandlersRef.current!.onChange(event, '', null)
            }
            propEventHandlersRef.current!.onFocus?.(event)
        },
        onClick(event: MouseEvent<HTMLInputElement>) {
            // Смещение курсора, если клик был на decimal separator.
            const input = event.currentTarget
            if (input.selectionStart === input.selectionEnd) {
                const position = findCursorPosition(
                    input.value,
                    input.value,
                    input.selectionStart ?? 0
                )
                input.setSelectionRange(position, position)
            }
            propEventHandlersRef.current!.onClick?.(event)
        },
        // Проверка лимита целой части.
        onBeforeInput(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
            const char: string = (event as CompositionEvent<HTMLInputElement>).data
            switch (isValidCharacter(char, event.currentTarget, utilityFnSettingsRef.current!)) {
                case 'valid':
                    // Валидация всего значения поля ввода не требуется.
                    return
                case 'invalid':
                    // Введено что-то неправильное: игнорируем ввод.
                    event.preventDefault()
                    break
                case 'continue':
                    // Требуется валидация всего значения поля ввода.
                    break
            }

            if (event.currentTarget.value.length === 0) {
                // Первая цифра: пропускаем без проверок.
                return
            }

            // Вычисление нового числа (строка).
            const prevValue: string = event.currentTarget.value
            const newValue: string = prevValue.substring(0, event.currentTarget.selectionStart!)
                + char + prevValue.substring(event.currentTarget.selectionEnd!, prevValue.length)

            if (newValue === '.' || newValue === ',') {
                // Замена всего значения поля ввода на '.' или ','.
                return
            }

            // Конвертируем вычисленное число (string) в число (number).
            const normalizedNumber: number | null = numeral(newValue).value()
            if (normalizedNumber === null) {
                // Не число? Не знаю, как это может случиться, но лучше подстраховаться.
                event.preventDefault()
                return
            }
            const maxLength = utilityFnSettingsRef.current!.maxLength
            if (!maxLength) {
                // Нет лимита по длине целой части: пропускаем.
                return
            }
            if (Math.abs(Math.floor(normalizedNumber)).toString().length > maxLength) {
                // Перебор чисел в целой части: игнорируем ввод.
                event.preventDefault()
                return
            }
        },
    }), [])

    return (
        <Input
            {...otherProps}
            value={propsValue ? formatValue(propsValue, utilityFnSettingsRef.current) : ''}
            allowedChars={propsAllowedChars}
            {...eventHandlers}
        >
            {children}
        </Input>
    )
}

interface UtilityFnSettings {
    numeralFormat: string
    decimalSeparator: string
    min?: number | string
    max?: number | string
    allowNegative?: boolean
    maxLength?: number
}

// Форматирование значения по шаблону.
function formatValue(value: string, settings: UtilityFnSettings): string {
    if (value.length === 0) {
        return ''
    }
    const {
        numeralFormat,
        decimalSeparator,
        min,
        max,
    } = settings
    // Ограничиваем значение по min-max, если эти свойства заданы.
    let normalizedValue: number | null = numeral(
        parseFloat(value.replace(',', '.')) || value
    ).value()
    if (normalizedValue !== null) {
        if (min !== undefined && normalizedValue < parseFloat(min as string)) {
            normalizedValue = parseFloat(min as string)
        }
        if (max !== undefined && normalizedValue > parseFloat(max as string)) {
            normalizedValue = parseFloat(max as string)
        }
    }
    let formatted: string = numeral(normalizedValue).format(numeralFormat, Math.floor)
    // Обработка дробных чисел, если разрешены.
    if (numeralFormat.includes('.')) {
        // Проверяем последний введенный символ, возможно, это разделитель.
        // Выполняя numeral('12.').format(numeralFormat) мы получим '12', теряя
        // разделитель целой и дробной части, поэтому нужно вернуть разделитель в значение.
        const lastChar: string = value[value.length - 1]
        if (lastChar === '.' || lastChar === ',') {
            formatted += decimalSeparator
        } else if (decimalSeparator !== numeral.localeData().delimiters.decimal) {
            // Разделитель numeral().format() отличается от заданного decimalSeparator.
            // Нужно заменить разделитель на decimalSeparator.
            formatted = formatted.replace(
                numeral.localeData().delimiters.decimal,
                decimalSeparator
            )
        }
    }
    return formatted
}

// Очистка значения.
function cleanValue(value: string): number | null {
    if (value.length === 0) {
        return null
    }
    return numeral(value).value()
}

// Поиск правильной позиции курсора.
function findCursorPosition(
    value: string,
    inputValue: string,
    currentCursorPosition: number
): number {
    if (currentCursorPosition >= value.length) {
        return value.length
    }
    if (currentCursorPosition <= 0) {
        return 0
    }
    if (
        (inputValue === '.' || inputValue === ',')
        && value.length === 2
        && (value.endsWith('.') || value.endsWith(','))
    ) {
        // Введена '.' или ',', но отформатированное значение заменено на '0.' или '0,'.
        // Нужно сместить курсор в конец строки.
        return value.length
    }
    return currentCursorPosition
}

// Проверка валидности введенного символа.
function isValidCharacter(
    char: string,
    inputEl: HTMLInputElement | HTMLTextAreaElement,
    settings: UtilityFnSettings
): 'continue' | 'valid' | 'invalid' {
    const {
        numeralFormat,
        decimalSeparator,
        allowNegative,
    } = settings
    if (!/^[0-9]$/.test(char)) {
        // Проверяем на разделитель целой и дробной части.
        if (
            (char === '.' || char === ',')
            // Если в numeralFormat есть точка, то дробная часть разрешена.
            && numeralFormat.includes('.')
            // Еще нет разделителя в значении?
            && !inputEl.value.includes(decimalSeparator)
        ) {
            // Разделителя еще нет в значении: пропускаем без проверок.
            return 'continue'
        }
        // Не цифра.
        if (inputEl.selectionStart === 0) {
            // Первый символ, введенный в поле ввода, не цифра.
            if (allowNegative && char === '-') {
                // Введен минус, и негативные значения разрешены.
                if (inputEl.value.length > 0 && inputEl.value.startsWith('-')) {
                    // Минус уже есть в значении: игнорируем ввод.
                    return 'invalid'
                }
                // Минуса еще нет в значении: пропускаем без проверок.
                return 'valid'
            }
        }
        // В остальных случаях: игнорируем ввод.
        return 'invalid'
    }
    return 'continue'
}
