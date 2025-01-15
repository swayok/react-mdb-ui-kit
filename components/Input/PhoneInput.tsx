import React, {useEffect, useRef, useState} from 'react'
import Input, {InputProps} from './Input'
import withStable from '../../helpers/withStable'

export interface PhoneInputProps extends Omit<InputProps, 'onChange'> {
    // Шаблон номера телефона.
    // Например, "+7 (___) ___-__-__".
    // Подчеркивание - это цифра, которую может ввести пользователь,
    // всё остальное - это неизменные символы (включая пробелы).
    template: string,
    // Функция для очистки номера телефона для onChange().
    // По умолчанию: value => value.replace(/[^+0-9]+/g, '')
    // Пример: template = '0___ ___ ___'.
    // Введено: value = '0999 888 777'.
    // Чистое значение: '0999888777'.
    // Пример: template = '+7 (___) ___-__-__'.
    // Введено: value = '+7 (999) 888-77-66'.
    // Чистое значение: '+79998887766'.
    // Если нужно другое поведение, то можно задать свою функцию очистки значения.
    valueCleaner?: (value: string) => string,
    // Минимальная позиция курсора в поле ввода, если ввод номера телефона начинается
    // не с нулевой позиции.
    // Пример: для template = "+7 (___) ___-__-__"
    // minCursorPosition = 3 (индекс первого подчеркивания).
    minCursorPosition: number,
    onChange: (
        event: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
        // Результат выполнения функции из свойства valueCleaner.
        // Примеры:
        // event.currentTarget.value = '+7 (000) 111-22-33', cleanValue = '+70001112233'.
        // event.currentTarget.value = '(111) 222-33-44', cleanValue = '1112223344'.
        cleanValue: string
    ) => void
}

const isHardcodedCharacterRegexp = /[ ()-]/
const rtrimRegexp = /[)_ -]+$/

// Поле ввода для номера телефона с настраиваемым шаблоном.
function PhoneInput(props: PhoneInputProps) {
    const {
        template,
        valueCleaner = value => value.replace(/[^+0-9]+/g, ''),
        placeholder = template,
        minCursorPosition,
        onChange,
        onFocus,
        onBlur,
        onClick,
        onKeyDown,
        inputRef,
        value,
        ...otherProps
    } = props

    const maxCursorPosition: number = template.length
    const fallbackInputRef = useRef<HTMLInputElement>(null)
    const [
        focused,
        setFocused,
    ] = useState<boolean>(false)
    const cursorPositionRef = useRef<number | null>(null)

    const inputReference = inputRef || fallbackInputRef

    useEffect(() => {
        if (inputReference.current && focused) {
            if (cursorPositionRef.current !== null) {
                inputReference.current.setSelectionRange(
                    cursorPositionRef.current,
                    cursorPositionRef.current
                )
                cursorPositionRef.current = null
            } else {
                if (inputReference.current.value === '') {
                    inputReference.current.value = template
                }
                updateCursorPositionOnFocus(
                    inputReference.current,
                    template,
                    minCursorPosition,
                    true
                )
            }
        }
    }, [inputReference.current, value, focused, template, minCursorPosition])

    return (
        <Input
            inputRef={inputReference}
            placeholder={placeholder}
            {...otherProps}
            value={value ? formatPhoneNumber(value, template, focused) : ''}
            allowedChars={/\d/}
            maxLength={25}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                    const input = e.currentTarget
                    switch (e.key) {
                        case 'Delete':
                            if (input.selectionStart === input.selectionEnd) {
                                const cursorPosition: number = input.selectionStart || 0
                                cursorPositionRef.current = cursorPosition
                                if (isHardcodedCharacter(input.value[cursorPosition])) {
                                    let endPosition: number = cursorPosition + 1
                                    while (isHardcodedCharacter(input.value[endPosition]) && endPosition < maxCursorPosition) {
                                        endPosition++
                                    }
                                    const newValue: string = input.value.substring(
                                        0,
                                        cursorPosition
                                    ) + input.value.substring(endPosition)
                                    input.value = newValue
                                    input.setSelectionRange(cursorPosition, cursorPosition)
                                    onChange(e, valueCleaner(newValue))
                                    e.preventDefault()
                                }
                                // Если символ не жестко задан в шаблоне, то используем
                                // стандартное поведение, запоминая позицию курсора.
                            }
                            break
                        case 'Backspace':
                            if (input.selectionStart === input.selectionEnd) {
                                const endPosition: number = (input.selectionStart || 0) - 1
                                let cursorPosition: number = endPosition
                                if (cursorPosition < minCursorPosition) {
                                    e.preventDefault()
                                } else if (isHardcodedCharacter(input.value[cursorPosition])) {
                                    if (cursorPosition > minCursorPosition) {
                                        cursorPosition--
                                        while (isHardcodedCharacter(input.value[cursorPosition]) && cursorPosition > minCursorPosition) {
                                            cursorPosition--
                                        }
                                    }
                                    const newValue: string = input.value.substring(0, cursorPosition)
                                        + input.value.substring(endPosition)
                                    // console.log('Backspace a', {
                                    //     value: input.value,
                                    //     cursorPosition,
                                    //     char: input.value[cursorPosition],
                                    //     newValue: newValue
                                    // });
                                    cursorPositionRef.current = cursorPosition
                                    input.value = newValue
                                    input.setSelectionRange(cursorPosition, cursorPosition)
                                    onChange(e, valueCleaner(newValue))
                                    e.preventDefault()
                                } else {
                                    // not a hardcoded character - use default behavior
                                    cursorPositionRef.current = cursorPosition
                                }
                            }
                            break
                        case 'ArrowLeft':
                        case 'ArrowRight':
                            handleKeyboardArrow(input, template, minCursorPosition, e.key)
                            e.preventDefault()
                            return
                        case 'Home':
                        case 'ArrowDown':
                            input.setSelectionRange(minCursorPosition, minCursorPosition)
                            e.preventDefault()
                            return
                        case 'End':
                        case 'ArrowUp':
                            input.setSelectionRange(maxCursorPosition, maxCursorPosition)
                            e.preventDefault()
                            return
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            if (
                                e.currentTarget.selectionStart === e.currentTarget.selectionEnd
                                && !isValidValue(e.currentTarget.value + '0', template)
                            ) {
                                // Вводится лишний символ - запрещаем
                                e.preventDefault()
                            }
                    }
                }
                onKeyDown?.(e)
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!isValidValue(e.currentTarget.value, template)) {
                    e.preventDefault()
                    return
                }
                const value = formatPhoneNumber(
                    e.currentTarget.value,
                    template,
                    focused
                )
                let nextCursorPosition = findCursorPosition(
                    value,
                    template,
                    e.currentTarget.selectionStart || minCursorPosition,
                    minCursorPosition
                )
                if (
                    e.currentTarget.selectionStart === 1
                    && nextCursorPosition === minCursorPosition
                ) {
                    nextCursorPosition += e.currentTarget.value.length
                }
                cursorPositionRef.current = nextCursorPosition
                e.currentTarget.setSelectionRange(nextCursorPosition, nextCursorPosition)
                onChange(e, valueCleaner(value))
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                setFocused(true)
                onFocus?.(e)
            }}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                if (focused) {
                    updateCursorPositionOnFocus(e.currentTarget, template, minCursorPosition)
                }
                onClick?.(e)
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                setFocused(false)
                if (e.currentTarget.value === template) {
                    e.currentTarget.value = ''
                    onChange(e, '')
                }
                onBlur?.(e)
            }}
            onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                e.preventDefault()
                const value = formatPhoneNumber(
                    e.clipboardData.getData('text/plain'),
                    template,
                    focused
                )
                e.currentTarget.value = value
                onChange(
                    e as unknown as React.ChangeEvent<HTMLInputElement>,
                    valueCleaner(value)
                )
            }}
        />
    )
}

// Валидация введенного значения по шаблону.
function isValidValue(value: string, template: string): boolean {
    const expectedMaxDigitsCount: number = template.replace(/[^_]/g, '').length
    // Если новое значение имеет больше цифр чем ожидается, то считаем его неправильным.
    return removeTemplateCharacters(value, template).length <= expectedMaxDigitsCount
}

// Нормализация значения по шаблону и очистка результата от лишних символов.
export function normalizeAndCleanPhoneNumber(
    value: string | null | undefined,
    template: string,
    valueCleaner: (value: string) => string = value => value.replace(/[^+0-9]+/g, '')
): string {
    if (typeof value !== 'string' || value.trim() === '') {
        return ''
    }
    return valueCleaner(formatPhoneNumber(value, template, false))
}

// Форматирование введенного значения по шаблону.
export function formatPhoneNumber(value: string, template: string, focused: boolean): string {
    if (value.length === 0) {
        return focused ? template : ''
    }
    value = removeTemplateCharacters(value, template)
    let formattedValue: string = ''
    let digitIndex: number = 0
    for (let i = 0; i < template.length; i++) {
        if (template[i] === '_' && digitIndex < value.length) {
            formattedValue += value[digitIndex]
            digitIndex++
        } else {
            formattedValue += template[i]
        }
    }
    // console.log('formattedValue', {value, normalizedValue})
    return formattedValue
}

// Удаление фиксированной части из начала значения и не цифровых символов.
function removeTemplateCharacters(value: string, template: string): string {
    const fixedTemplatePart: string = template.replace(/^([^_ ]+).*$/, '$1').replace(/([+*.])/g, '.')
    return value.replace(new RegExp(`^${fixedTemplatePart}`), '').replace(/[^0-9]+/g, '')
}

// Поиск позиции курсора в поле ввода.
function findCursorPosition(
    value: string,
    template: string,
    currentCursorPosition: number,
    minCursorPosition: number
): number {
    value = trimValue(value)
    if (currentCursorPosition >= value.length) {
        let newCursorPosition: number = value.length
        while (newCursorPosition < template.length && template[newCursorPosition] !== '_') {
            newCursorPosition++
        }
        return newCursorPosition
    } else {
        // console.log('findCursorPosition b');
        return currentCursorPosition < minCursorPosition
            ? minCursorPosition
            : currentCursorPosition
    }
}

// Обновить позицию курсора в поле ввода при фокусировке или клике на поле ввода.
function updateCursorPositionOnFocus(
    input: HTMLInputElement | HTMLTextAreaElement,
    template: string,
    minCursorPosition: number,
    ignoreSelectionRange: boolean = false
): void {
    if (ignoreSelectionRange || input.selectionStart === input.selectionEnd) {
        const position: number = findCursorPosition(
            input.value,
            template,
            input.selectionStart || template.length - 1,
            minCursorPosition
        )
        input.setSelectionRange(position, position)
    }
}

// Очистить значение от спец-символов.
function trimValue(value: string): string {
    return value.replace(rtrimRegexp, '')
}

// Обработка нажатия кнопок "вправо" или "влево".
function handleKeyboardArrow(
    input: HTMLInputElement,
    template: string,
    minCursorPosition: number,
    action: 'ArrowLeft' | 'ArrowRight'
): void {
    const shift: number = action === 'ArrowLeft' ? -1 : 1
    let cursorPosition: number = ((action === 'ArrowLeft' ? input.selectionStart : input.selectionEnd) || 0) + shift
    while (cursorPosition < template.length && cursorPosition > 0 && isHardcodedCharacter(input.value[cursorPosition])) {
        cursorPosition += shift
    }
    if (action === 'ArrowLeft' && cursorPosition <= minCursorPosition) {
        cursorPosition = minCursorPosition
    } else if (action === 'ArrowRight' && cursorPosition >= template.length) {
        cursorPosition = template.length
    } else {
        cursorPosition = findCursorPosition(input.value, template, cursorPosition, minCursorPosition)
    }
    input.setSelectionRange(cursorPosition, cursorPosition)
}

// Определение, является ли char фиксированным символом.
function isHardcodedCharacter(char: string): boolean {
    return String(char || '').match(isHardcodedCharacterRegexp) !== null
}

export default withStable<PhoneInputProps>(
    ['onChange', 'onFocus', 'onBlur', 'valueCleaner'],
    PhoneInput
)
