// Проверка, что искомое значение совпадает со значением опции.
export function isSameOptionValue(
    expectedValue: unknown,
    optionValue: unknown
): boolean {
    if (expectedValue === optionValue) {
        return true
    }
    // Проверка на пустое значение в обоих значениях, но с разными типами.
    if (
        (expectedValue === null && optionValue === '')
        || (expectedValue === '' && optionValue === null)
    ) {
        return true
    }
    // Проверяем на различающиеся типы значений, когда значения могут быть одинаковы,
    // если конвертировать их в строки.
    const expectedValueType = typeof expectedValue
    const optionValueType = typeof optionValue
    if (
        (
            expectedValueType === 'number'
            && optionValueType === 'string'
        )
        || (
            expectedValueType === 'string'
            && optionValueType === 'number'
        )
    ) {
        // Одно из значений - число, а другое - строка.
        // Нужно конвертировать оба значения в строку и сравнить.
        return String(expectedValue) === String(optionValue)
    }
    return false
}
