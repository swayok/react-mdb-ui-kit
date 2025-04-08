import {AnyObject, ApiResponseData} from './Common'
import {DataGridFooterProps, DataGridHeaderProps, DataGridOrderingDirection, DataGridTranslations} from './DataGrid'
import React, {CSSProperties, TableHTMLAttributes} from 'react'

// Контекст таблицы с данными, получаемыми с сервера.
export interface AsyncDataGridContextProps<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
> {
    translations: DataGridTranslations

    initialized: boolean
    drawsCount: number
    loading: boolean
    setIsLoading: (loading: boolean) => void
    loadingError: boolean
    validationErrors: AnyObject<string> | null
    preloaderProps?: Omit<
        AsyncDataGridLoadingProps,
        'loading' | 'error' | 'onReload' | 'showContent'
    >
    /**
     * Если true или string: использовать URL Query для хранения и восстановления состояния таблицы:
     * смещение (offset), лимит строк (limit), сортировка и фильтры.
     * Имя URL Query параметра по умолчанию: 'state'.
     * Имя URL Query параметра можно изменить, передав строку в storeStateInUrlQuery.
     *
     * @see AsyncDataGridUrlQueryManager
     * @see encodeAsyncDataGridState
     */
    storeStateInUrlQuery?: boolean | string

    apiUrl: string

    // Текущие фильтры.
    filters: FiltersDataType
    // Фильтры по умолчанию. Так же используются при сбросе фильтрации.
    defaultFilters: FiltersDataType
    // Постоянные фильтры. Неизменны, добавляются к текущим фильтрам.
    forcedFilters: AnyObject
    // Применение нового набора фильтров.
    applyFilters: (filters: FiltersDataType, resetOffset: boolean = false) => void
    // Сбросить фильтры к значениям "по умолчанию" (defaultFilters).
    resetFilters: (resetOffset: boolean = false) => void
    // Состояние видимости панели фильтрации.
    isFiltersPanelOpened: boolean
    // Открыть/закрыть панель фильтрации.
    setIsFiltersPanelOpened: (isOpened: boolean) => void

    rows: RowDataType[]
    totalCount: number | null
    setRows: (rows: RowDataType[], totalCount?: number) => void
    updateRows: (callback: (rows: RowDataType[]) => RowDataType[]) => void
    updateRow: (
        // Измененные данные.
        updates: Partial<RowDataType>,
        // Функция для поиска данных обновляемой строки или имя ключа в RowDataType,
        // по которому сопоставляются данные.
        matcher: string | ((row: RowDataType, updates: Partial<RowDataType>) => boolean) = 'id',
        // Если true, то updates полностью заменят row (newRow = updates).
        // Если false или не задано, то updates будут объединены с row
        // (newRow = {...row, ...updates}).
        replace: boolean = false
    ) => void
    setTotalCount: (totalCount: number) => void
    // Разрешения для доступа к функционалу.
    permissions: AnyObject<boolean>
    setPermissions: (permissions: AnyObject<boolean>) => void
    // Идентификаторы выбранных строк.
    selectedRows: (number | string)[]
    setSelectedRows: (ids: (number | string)[]) => void
    selectRow: (rowId: number | string, selected: boolean) => void

    // Открыть контекстное меню для строки.
    openContextMenu?: (
        event: React.MouseEvent<HTMLTableRowElement>,
        rowData: RowDataType,
        rowIndex: number,
        // Установка индикатора выполнения действия над строкой.
        setIsProcessing: (isProcessing: boolean) => void,
    ) => void
    // Закрыть контекстное меню для строки.
    closeContextMenu?: () => void

    // Перезагрузить данные таблицы.
    reload: (silent?: boolean) => void

    offset: number
    setOffset: (offset: number) => void

    limits: number[]
    defaultLimit: number
    limit: number
    setLimit: (limit: number) => void

    defaultOrderBy: null | string
    defaultOrderDirection: DataGridOrderingDirection
    orderBy: null | string
    orderDirection: DataGridOrderingDirection
    setOrder: (
        column: string,
        direction: DataGridOrderingDirection,
        resetOffset: boolean = false
    ) => void
}

// Свойства обертки таблицы с данными, получаемыми с сервера (настройка контекста).
export interface AsyncDataGridProps<
    FiltersDataType extends object,
    RowDataType extends object = AnyObject
> {
    apiUrl: AsyncDataGridContextProps<RowDataType, FiltersDataType>['apiUrl']
    // HTTP метод отправки запроса.
    // По умолчанию: GET.
    apiMethod?: 'GET' | 'POST'
    children: React.ReactNode | React.ReactNode[]

    translations?: DataGridTranslations

    preloaderProps?: AsyncDataGridContextProps<RowDataType, FiltersDataType>['preloaderProps']

    limits?: AsyncDataGridContextProps<RowDataType, FiltersDataType>['limits']

    defaultLimit?: AsyncDataGridContextProps<RowDataType, FiltersDataType>['limit']
    startingOffset?: AsyncDataGridContextProps<RowDataType, FiltersDataType>['offset']

    showFiltersPanelByDefault?: boolean
    startingFilters?: Partial<FiltersDataType>
    defaultFilters?: FiltersDataType
    forcedFilters?: AnyObject<unknown, keyof FiltersDataType | string>

    defaultOrderBy?: AsyncDataGridContextProps<RowDataType, FiltersDataType>['orderBy']
    defaultOrderDirection?: AsyncDataGridContextProps<RowDataType, FiltersDataType>['orderDirection']

    /**
     * Если true или string: использовать URL Query для хранения и восстановления
     * состояния таблицы: смещение (offset), лимит строк (limit), сортировка и фильтры.
     * Имя URL Query параметра по умолчанию: 'state'.
     * Имя URL Query параметра можно изменить, передав строку в storeStateInUrlQuery.
     *
     * @see AsyncDataGridUrlQueryManager
     * @see encodeAsyncDataGridState
     */
    storeStateInUrlQuery?: boolean | string

    // Компонент, отображающий контекстное меню для строки таблицы.
    ContextMenu?: React.FunctionComponent<AsyncDataGridContextMenuProps<RowDataType>>
}

// Свойства для стандартной разметки таблицы с данными, получаемыми с сервера.
export interface AsyncDataGridDefaultLayoutProps<
    RowDataType extends object = AnyObject
>{
    // Панель фильтрации.
    filtersPanel?: React.ReactNode | (() => React.ReactNode)
    // Отрисовка блока с заголовками колонок (<thead>, <DataGridHeaders>).
    renderHeaders: AsyncDataGridTableProps<RowDataType>['renderHeaders']
    // Отрисовка строки таблицы.
    renderRow: AsyncDataGridTableProps<RowDataType>['renderRow']
    // Дополнительные элементы, выводимые перед таблицей и панелью фильтрации.
    // Свойство нужно для того, чтобы не сломать прокрутку таблицы в режиме
    // заполнения таблицей свободного места (fill, inline).
    prepend?: React.ReactNode | (() => React.ReactNode)
    // Дополнительные элементы, выводимые после таблицы и подвала таблицы (пагинации).
    // Свойство нужно по той же причине, что и prepend.
    append?: React.ReactNode | (() => React.ReactNode)

    // Если true: отображать таблицу как есть.
    // Если false: отображать таблицу в режиме заполнения свободного пространства.
    // В этом режиме можно сделать интерфейс, когда элементы вокруг таблицы всегда
    // видны (включая названия колонок), а прокручиваются только строки таблицы.
    inline?: boolean
    // Настройка таблицы.
    tableWrapperClassName?: string
    tableProps?: Partial<Omit<
        AsyncDataGridTableProps<RowDataType>,
        'renderHeaders' | 'renderRow' | 'fillHeight'
    >>
    striped?: AsyncDataGridTableProps['striped']
    hover?: AsyncDataGridTableProps['hover']
    bordered?: AsyncDataGridTableProps['bordered']
    small?: AsyncDataGridTableProps['small']
    // Возможность спрятать подвал (пагинатор, количество строк).
    hideFooter?: boolean
    // Настройка подвала таблицы (<AsyncDataGridFooter>).
    footerProps?: Partial<AsyncDataGridFooterProps>

    // Обработчики событий.
    events?: AsyncDataGridEventsProps<RowDataType, AnyObject>

    className?: string
    id?: string
}

// Свойства подвала таблицы с данными, получаемыми с сервера.
export interface AsyncDataGridFooterProps extends DataGridFooterProps {
    reloader?: boolean
}

// Свойства таблицы с данными, получаемыми с сервера (<table>).
export interface AsyncDataGridTableProps<
    RowDataType extends object = AnyObject
> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
    striped?: boolean
    hover?: boolean
    small?: boolean
    bordered?: boolean
    // true: заполнить контейнер по высоте, прокрутка в этом случае будет
    // работать только на строки таблицы, не трогая элементы вне таблицы.
    fillHeight?: boolean
    wrapperClass?: string
    wrapperId?: string
    verticalAlign?: 'top' | 'middle' | 'bottom'

    renderHeaders: React.ReactNode | (() => React.ReactNode)
    renderRow: (
        rowData: RowDataType,
        index: number,
        context: AsyncDataGridContextProps<RowDataType>
    ) => React.ReactNode | React.ReactNode[]
    noItemsMessage?: string | React.ReactNode
}

// Свойства индикатора загрузки данных для таблицы с сервера.
export interface AsyncDataGridLoadingProps {
    loading: boolean
    // Если null, то компонент, отображающий ошибку, не отрисовывается в DOM.
    // Это полезно для 1й отрисовки.
    // После первого отображения ошибки можно использовать false или 0,
    // чтобы анимированно скрыть ошибку (в случе null анимации не будет).
    error: boolean | null | number
    errorMessage?: string | null
    onReload: () => void
    retryButtonTitle?: string
    showContent?: boolean
    errorClassName?: string
    errorStyle?: CSSProperties
    // true: заполнить контейнер.
    fill?: boolean
    showDelay: number | null
}

// Данные для таблицы, получаемые с сервера.
export interface AsyncDataGridRows<
    RowDataType extends object = AnyObject
> extends ApiResponseData {
    records: RowDataType[]
    count: number
    permissions?: AnyObject<boolean>
}

// Свойства заголовка колонки таблицы с данными, получаемыми с сервера (<th>).
export type AsyncDataGridHeaderProps<OrderByOptions> = Omit<
    DataGridHeaderProps<OrderByOptions>,
    'sortingDataType'
>

// Функции, выполняемые, когда происходят определенные события с таблицей.
export interface AsyncDataGridEventsProps<
    RowDataType extends object = AnyObject,
    FiltersDataType extends object = AnyObject
> {
    // Получено новый набор строк.
    onSetRows?: (context: AsyncDataGridContextProps<RowDataType, FiltersDataType>) => void
    // Запущен запрос выборки нового набора строк.
    onDraw?: (context: AsyncDataGridContextProps<RowDataType, FiltersDataType>) => void
    // Демонтаж таблицы.
    onUnmount?: () => void
}

// Содержимое состояния таблицы для URL query.
export interface AsyncDataGridStateForUrlQuery<FiltersDataType extends object = object> {
    // Limit.
    l?: number
    // Offset.
    o?: number
    // Order by.
    sb?: string
    // Order direction.
    sd?: string
    // Filters.
    f?: FiltersDataType
}

// Свойства компонента, отвечающего за работу с состоянием в URL query.
export interface AsyncDataGridUrlQueryManagerProps {
    // Название параметра, в котором хранится состояние таблицы в URL query.
    // Если false, то не нужно добавлять состояние в URL.
    // Если true, то в URL query используется имя параметра 'state' для хранения состояния.
    // Если string, то в URL query используется указанное имя параметра.
    urlQueryParamName: string | true
    // Вызывается, когда первоначальный импорт параметров из URL query завершен.
    onReady?: () => void
}

// Свойства компонента, отображающего контекстное меню для строки таблицы.
export interface AsyncDataGridContextMenuProps<
    RowDataType extends object = AnyObject
> {
    show: boolean
    mouseEvent?: React.MouseEvent<HTMLElement>
    rowIndex?: number
    rowData?: RowDataType
    permissions: AsyncDataGridContextProps['permissions']
    disabled?: boolean
    setIsProcessing: AsyncDataGridContextProps['setIsLoading']
    onClose: () => void
}
