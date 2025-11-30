// Если значение имеется в массиве - удаляет его из массива, если нет - добавляет.
export function toggleValueInArray<T = unknown>(
    array: T[],
    value: T,
    selected?: boolean,
    strictComparison: boolean = true
): T[] {
    const updatedArray: T[] = array.slice()
    let index: number = updatedArray.indexOf(value)
    if (
        // Значение не найдено в массиве.
        index < 0
        // Разрешена не строгая типизация при сравнении.
        && !strictComparison
        // Значение не null, не строка и не объект.
        && value !== null
        && typeof value !== 'string'
        && typeof value !== 'object'
    ) {
        // Конвертируем значение в строку и пробуем найти ее в массиве.
        index = updatedArray.indexOf(String(value) as T)
    }
    if (selected === undefined) {
        // Нужно удалить, если значение уже есть в массиве,
        // или добавить, если значение нет в массиве.
        if (index >= 0) {
            updatedArray.splice(index, 1)
        } else {
            updatedArray.push(value)
        }
    } else if (selected) {
        // Нужно добавить значение в массив (без дублирования).
        if (index < 0) {
            updatedArray.push(value)
        }
    } else if (index >= 0) {
        // Нужно убрать значение из массива.
        updatedArray.splice(index, 1)
    }
    return updatedArray
}

/** @deprecated */
export default toggleValueInArray
