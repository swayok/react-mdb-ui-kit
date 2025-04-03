import {AnyObject, FormSelectOption} from './Common'
import React, {CSSProperties, HTMLAttributes, TableHTMLAttributes} from 'react'

// Строки локализации.
export interface DataGridTranslations {
    filters: {
        header: string
        apply: string
        reset: string
    }
    ordering: {
        header: string
        ascending: string
        descending: string
    }
    items_count: {
        items_total: (totalCount: number) => string
        items_filtered: (totalCount: number, filteredCount: number) => string
        items_shown: (min: number, max: number) => string
        items_per_page: (value: number) => string
    }
    no_items: string
    loading: string
    loading_error: string
    retry_loading: string
    actions: {
        add: string
        edit: string
        delete: string
        clone: string
    }
}

// Направления сортировки.
export type DataGridOrderingDirection = 'asc' | 'desc'

// Типы значений для сортировки.
export type DataGridOrderByValuesType = 'number' | 'boolean' | 'string'

// Контекст таблицы с данными.
export interface DataGridContextProps<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
> {
    translations: DataGridTranslations
    loading: boolean
    setIsLoading: (value: boolean) => void

    filters: FiltersDataType
    defaultFilters: FiltersDataType
    applyFilters: (filters: FiltersDataType, resetOffset: boolean = false) => void

    unfilteredRowsCount: number

    rows: readonly RowDataType[]
    setRows: (rows: RowDataType[]) => void
    updateVisibleRows: (callback: (visibleRows: RowDataType[]) => RowDataType[]) => void

    visibleRows: readonly RowDataType[]
    setVisibleRows: (rows: RowDataType[]) => void

    offset: number
    setOffset: (offset: number) => void

    limits: number[]
    limit: number
    setLimit: (limit: number) => void

    orderBy: null | string
    orderDirection: DataGridOrderingDirection
    defaultOrderBy: null | string
    defaultOrderDirection: DataGridOrderingDirection
    setOrder: (
        column: string,
        direction: DataGridOrderingDirection,
        resetOffset: boolean = false,
        valuesType?: DataGridOrderByValuesType,
    ) => void
}

// Свойства таблицы с данными (<DataGrid>)
export interface DataGridProps<
    RowDataType extends object,
    FiltersDataType extends object
> {
    children: React.ReactNode | React.ReactNode[]

    translations?: DataGridTranslations

    rows: RowDataType[]

    limits?: DataGridContextProps['limits']
    defaultLimit?: DataGridContextProps['limit']

    startingOffset?: DataGridContextProps['offset']

    startingFilters?: Partial<FiltersDataType>
    defaultFilters?: FiltersDataType
    onFilter?: (
        rows: readonly RowDataType[],
        filters: FiltersDataType
    ) => RowDataType[]

    defaultOrderBy?: DataGridContextProps['orderBy']
    defaultOrderByValuesType?: DataGridOrderByValuesType
    defaultOrderDirection?: DataGridContextProps['orderDirection']
    onOrder?: (
        rows: readonly RowDataType[],
        orderBy: DataGridContextProps['orderBy'],
        direction: DataGridContextProps['orderDirection']
    ) => RowDataType[]
}

// Настройки для сортировки строк.
export interface DataGridOrdering {
    column: DataGridContextProps['orderBy']
    direction: DataGridContextProps['orderDirection']
    valuesType?: DataGridOrderByValuesType
}

// Свойства для стандартной разметки таблицы с данными.
export interface DataGridDefaultLayoutProps<RowDataType extends object = AnyObject> {
    // Панель фильтрации.
    filtersPanel?: React.ReactElement | (() => React.ReactElement)
    // Дополнительные элементы, выводимые перед таблицей и панелью фильтрации.
    // Свойство нужно для того, чтобы не сломать прокрутку таблицы в режиме
    // заполнения таблицей свободного места (fill, inline).
    prepend?: React.ReactElement | (() => React.ReactElement)
    // Дополнительные элементы, выводимые после таблицы и подвала таблицы (пагинации).
    // Свойство нужно по той же причине, что и prepend.
    append?: React.ReactElement | (() => React.ReactElement)
    // Настройка таблицы.
    tableProps?: Partial<Omit<
        DataGridTableProps<RowDataType>,
        'renderHeaders' | 'renderRow' | 'flexFill'>
    >
    // Настройка подвала таблицы (<AsyncDataGridFooter>).
    footerProps?: Partial<DataGridFooterProps>
    // Отрисовка блока с заголовками колонок (<thead>, <DataGridHeaders>).
    renderHeaders: DataGridTableProps<RowDataType>['renderHeaders']
    // Отрисовка строки таблицы.
    renderRow: DataGridTableProps<RowDataType>['renderRow']
    // Отрисовка строки с итоговыми значениями (последняя строка в таблице).
    renderTotalsRow?: DataGridTableProps<RowDataType>['renderTotalsRow']

    className?: string
    id?: string
    style?: CSSProperties
    tableClassName?: string
    border?: boolean
}

// Свойства панели фильтрации данных таблицы.
export interface DataGridFiltersPanelProps extends HTMLAttributes<HTMLFormElement> {
    borderBottom?: boolean
    flex?: boolean
    paddings?: boolean
    disabled?: boolean
    onSubmit: () => void
    onReset?: () => void
    noLabel?: boolean
    noButtons?: boolean
    // Использовать иконки вместо кнопок применить и сбросить?
    iconsAsButtons?: boolean
    buttonsContainerClassName?: string
    autoSubmit?: boolean
}

// Свойства для кнопок применить и сбросить в панели фильтрации.
export interface DataGridFiltersPanelButtonsProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    disabled?: boolean
    // Показать кнопку "Применить"?
    submitButton?: boolean
    // Нажатие на кнопку "Применить".
    onSubmit?: () => void
    // Показать кнопку "Сбросить"?
    resetButton?: boolean
    // Нажатие на кнопку "Сбросить".
    onReset?: () => void
    // Использовать иконки вместо кнопок?
    icons?: boolean
}

// Свойства заголовка панели фильтрации.
export interface DataGridFiltersPanelLabelProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    label?: string
}

// Свойства панели сортировки данных в таблице.
export interface DataGridOrderingPanelProps<
    SortableColumn extends string = string
> extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    options: DataGridOrderingPanelOption<SortableColumn>[]
    resetOffset?: boolean
    paddings?: boolean
    noLabel?: boolean
    disabled?: boolean
}

// Типы данных для опции в панели сортировки.
export type DataGridOrderingPanelOptionType = 'numbers' | 'strings' | 'dates' | 'default'

// Данные опции для панели сортировки.
export interface DataGridOrderingPanelOption<
    ValueType extends string = string
> extends FormSelectOption<ValueType> {
    type?: DataGridOrderingPanelOptionType
}

// Свойства заголовка панели сортировки.
export interface DataGridOrderingPanelLabelProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    label?: string
}

// Свойства обертки подвала таблицы.
export interface DataGridFooterWrapperProps extends HTMLAttributes<HTMLDivElement> {
    shadow?: boolean
    border?: boolean
}

// Свойства подвала таблицы.
export interface DataGridFooterProps extends Omit<
    DataGridFooterWrapperProps,
    'children'
> {
    disabled?: boolean
    limitChanger?: boolean
    paginationProps?: Omit<
        DataGridPaginationProps,
        'offset' | 'limit' | 'disabled' | 'onOffsetChange' | 'totalCount'
    >
}

// Свойства обертки для одного заголовка колонки таблицы (<th>).
export interface DataGridHeaderWrapperProps<OrderByOptions extends string = string> {
    children?: React.ReactNode | React.ReactNode[]
    nowrap?: boolean
    sortable?: OrderByOptions | null | false
    resizable?: boolean
    className?: string
    style?: CSSProperties
    width?: string | number
    minWidth?: string | number
    maxWidth?: string | number
    numeric?: boolean
    onClick?: () => void
}

// Свойства одного заголовка колонки таблицы (<th>).
export interface DataGridHeaderProps<
    OrderByOptions extends string = string
> extends Omit<
    DataGridHeaderWrapperProps<OrderByOptions>,
    'onClick'
> {
    sortingDataType?: DataGridOrderByValuesType
    resetOffset?: boolean
}

// Свойства заголовков колонок таблицы (<thead> -> <tr> -> <DataGridHeader>+).
export interface DataGridHeadersProps {
    children: React.ReactNode | React.ReactNode[]
    hidden?: boolean
    sticky?: boolean
}

// Свойства компонента, отображающего информацию о количестве строк в таблице.
export interface DataGridItemsCountProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    totalCount: number
    filteredCount?: number
    offset: number
    limit: number
    limits?: number[]
    onLimitChange?: (newLimit: number) => void
    disabled?: boolean
}

// Свойства компонента, отображающего сообщение, что в таблице нет строк.
export interface DataGridNoItemsProps extends HTMLAttributes<HTMLDivElement> {
    flexFill?: boolean;
}

// Свойства пагинации таблицы.
export interface DataGridPaginationProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    totalCount: number
    offset: number
    limit: number
    disabled?: boolean
    firstLast?: boolean
    prevNext?: boolean
    numbers?: boolean
    maxVisiblePages?: number
    onOffsetChange: (offset: number) => void
}

// Свойства кнопки, открывающей выпадающее меню со списком номеров страниц
// в промежутке между явно отображаемыми номерами страниц в пагинаторе.
export interface DataGridPaginationHiddenPagesProps extends HTMLAttributes<HTMLDivElement> {
    totalCount: number
    offset: number
    limit: number
    disabled?: boolean
    onOffsetChange: (offset: number) => void
    maxVisiblePages?: number
}

// Свойства обертки строки таблицы (<tr>).
export interface DataGridRowProps extends HTMLAttributes<HTMLTableRowElement> {
    key: string | number
    index: number
    selected?: boolean
}

// Свойства таблицы (<table>).
export interface DataGridTableProps<
    RowDataType extends object = AnyObject
> extends Omit<
    TableHTMLAttributes<HTMLTableElement>,
    'children'
> {
    striped?: boolean
    hover?: boolean
    small?: boolean
    bordered?: boolean
    flexFill?: boolean
    wrapperClass?: string
    wrapperId?: string
    wrapperStyle?: CSSProperties
    verticalAlign?: 'top' | 'middle' | 'bottom'

    renderHeaders: React.ReactElement | (() => React.ReactElement)
    renderRow: (
        rowData: Readonly<RowDataType>,
        index: number,
        rows: readonly RowDataType[],
        context: DataGridContextProps<RowDataType>
    ) => React.ReactElement | React.ReactElement[]
    renderTotalsRow?: (
        rows: readonly RowDataType[],
        context: DataGridContextProps<RowDataType>
    ) => React.ReactElement | React.ReactElement[]
    noItemsMessage?: string | React.ReactElement
}
