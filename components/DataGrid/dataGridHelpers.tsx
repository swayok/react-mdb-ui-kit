import {mdiRayStartArrow, mdiSwapVertical} from '@mdi/js'
import Icon from '../Icon'
import React from 'react'
import {DataGridContextProps, DataGridOrderByValuesType, DataGridOrderingDirection} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'

// Стандартные отступы для полей ввода панели фильтрации,
export const dataGridFiltersPanelInputMargins: string = ''

// Нормализация смещения отображаемых строк на странице.
export function normalizeOffset(limit: number, offset: number): number {
    if (offset === 0 || offset % limit === 0) {
        return offset
    }
    const page = Math.floor(offset / limit)
    return page * limit
}

// Иконка сортировки.
export function renderSortingIcon(
    state?: null | DataGridOrderingDirection,
    disabled: boolean = false
) {
    let icon
    let rotate: number = 0
    switch (state) {
        case 'asc':
            icon = mdiRayStartArrow
            rotate = 90
            break
        case 'desc':
            icon = mdiRayStartArrow
            rotate = 270
            break
        default:
            icon = mdiSwapVertical
    }
    return (
        <Icon
            key={rotate == 0 ? 'no-sort' : 'sort'}
            path={icon}
            color={state && !disabled ? 'primary' : 'muted'}
            className="data-grid-sort-icon"
            size={18}
            rotate={rotate}
        />
    )
}

// Сортировка строк в таблице по заданным параметрам.
export function reorderDataGridRows<RowDataType extends object = AnyObject>(
    rows: readonly RowDataType[],
    orderBy: DataGridContextProps['orderBy'],
    direction: DataGridContextProps['orderDirection'],
    type?: DataGridOrderByValuesType
): RowDataType[] {
    // eslint-disable-next-line no-prototype-builtins
    if (rows.length <= 1 || orderBy === null || !rows[0].hasOwnProperty(orderBy)) {
        return rows.slice()
    }
    const dataType: string = (type as string) || typeof ((rows[0] as AnyObject)[orderBy])
    let comparator: (value1: never, value2: never, direction: DataGridOrderingDirection) => number

    if (!['number', 'boolean', 'bigint', 'string'].includes(dataType)) {
        return rows.slice()
    }

    switch (dataType) {
        case 'number':
        case 'bigint':
            comparator = compareNumbers
            break
        case 'boolean':
            comparator = compareBooleans
            break
        default:
            comparator = compareStrings
            break
    }

    return rows.slice().sort(
        (row1: RowDataType, row2: RowDataType) => comparator(
            (row1 as AnyObject)[orderBy] as never,
            (row2 as AnyObject)[orderBy] as never,
            direction
        )
    )
}

// Сравнение чисел для сортировщика строк таблицы.
function compareNumbers(
    p1?: number | null,
    p2?: number | null,
    direction: DataGridOrderingDirection = 'asc'
): number {
    const ret = compareWhenSomeValueIsEmpty(p1, p2, direction)
    if (ret !== null) {
        return ret
    }
    if (direction === 'asc') {
        return p1! > p2! ? 1 : -1
    } else {
        return p1! > p2! ? -1 : 1
    }
}

// Сравнение логических значений для сортировщика строк таблицы.
function compareBooleans(
    p1?: boolean | null,
    p2?: boolean | null,
    direction: DataGridOrderingDirection = 'asc'
): number {
    if (typeof p1 !== 'boolean') {
        p1 = null
    }
    if (typeof p2 !== 'boolean') {
        p2 = null
    }
    if (p1 === p2) {
        return 0
    }
    if (p1 === true) {
        // p2 is false
        return direction === 'asc' ? -1 : 1
    } else {
        return direction === 'asc' ? 1 : -1
    }
}

// Сравнение строк для сортировщика строк таблицы.
function compareStrings(
    p1?: string | null,
    p2?: string | null,
    direction: DataGridOrderingDirection = 'asc'
): number {
    const ret = compareWhenSomeValueIsEmpty(p1, p2, direction)
    if (ret !== null) {
        return ret
    }
    return direction === 'asc'
        ? (p1 as string).localeCompare(p2 as string)
        : (p2 as string).localeCompare(p1 as string)
}

// Сравнение двух значений на равенство учитывающее ситуацию
// когда одно или оба значения могут быть пустыми (null | undefined).
export function compareWhenSomeValueIsEmpty(
    p1?: unknown | null,
    p2?: unknown | null,
    direction: DataGridOrderingDirection = 'asc'
): number | null {
    if (p1 === undefined) {
        p1 = null
    }
    if (p2 === undefined) {
        p2 = null
    }
    if (p1 === p2) {
        return 0
    }
    if (!p1) {
        // place empty p1 after p2 (asc) or p1 before p2 (desc)
        return direction === 'asc' ? -1 : 1
    }
    if (!p2) {
        //place empty p2 after p1 (asc) or p2 before p1 (desc)
        return direction === 'asc' ? 1 : -1
    }
    return null
}

// Нормализация ширины.
// Решает проблему когда число без единицы измерения передается в виде строки.
export function normalizeDimensionForReactStyles(width: string | number | undefined): string | number | undefined {
    if (typeof width === 'string' && /^[\d.]+$/.test(width)) {
        // Числовая строка без единицы измерения: конвертируем в число.
        return parseFloat(width)
    }
    return width
}
