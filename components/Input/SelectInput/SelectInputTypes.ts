import type {ReactNode} from 'react'
import type {
    FormSelectOptionsList,
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionOrGroup,
    FormSelectOptionsAndGroupsList,
} from '../../../types'
import type {
    DropdownDropDirection,
    DropdownProps,
} from '../../Dropdown/DropdownTypes'
import type {InputProps} from '../InputTypes'

// Свойства компонента SelectInputBasic.
export interface SelectInputBasicProps extends Omit<InputProps, 'wrapperProps' | 'wrapperTag'> {
    children: ReactNode | ReactNode[]
    // Режим отображения.
    // Если inline: внешний вид: {текст} {chevron}, без оформления в виде поля ввода,
    // подходит для вставки в текст или в панель навигации.
    // Если input: внешний вид соответствует полю ввода c {chevron} в конце блока.
    mode?: 'inline' | 'input'
    // Настройки выпадающего меню.
    dropdownMenuClassName?: string
    dropdownToggleClassName?: string
    // Добавить white-space: nowrap ко всем опция выпадающего меню?
    textNowrapOnOptions?: boolean
    dropdownProps?: Omit<DropdownProps, 'drop' | 'className' | 'disabled' | 'children'>
    drop?: DropdownDropDirection
    // Максимальная высота выпадающего меню.
    maxHeight?: number | null
    // Минимальная ширина выпадающего меню.
    minWidth?: null | number | string
    // Если true: адаптировать ширину выпадающего меню под ширину поля ввода.
    // Если false: ширина выпадающего меню зависит от ширины опций.
    dropdownFluidWidth?: boolean
    // Нужно ли закрывать выпадающее меню при выборе опции.
    closeDropdownOnSelect?: boolean
    // Дополнительные элементы, которые нужно вставить после поля ввода.
    addon?: ReactNode | ReactNode[]
}

// Свойства компонента SelectInput.
export interface SelectInputProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> extends Omit<SelectInputBasicProps, 'value' | 'onChange' | 'children'> {
    // Набор опций.
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>
    // Обработчик выбора опции.
    onChange: (
        value: OptionValueType,
        label: string,
        index: number,
        groupIndex: number | null,
        extra?: OptionExtrasType
    ) => void
    // Текущее значение.
    value?: OptionValueType
    // Если value не найдено в options, то использовать первую активную опцию из options
    // и выполнить onChange(firstOption.value).
    // По умолчанию: true.
    selectFirstIfNotFound?: boolean
    // Конвертация опции для отображения в поле ввода (по умолчанию отображается FormSelectOption['label']).
    valueToString?: (option: FormSelectOption<OptionValueType, OptionExtrasType>) => string
    // Отрисовка подписи для опции или группы опций в выпадающем меню.
    renderOptionLabel?: (
        option: FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>,
        isGroup: boolean
    ) => string | ReactNode
    // Задать true, если FormSelectOption['label'] может содержать HTML, а не только обычный текст.
    labelsContainHtml?: boolean
    // Вкл/Выкл поиска по опциям.
    search?: boolean
    // Пояснение для поля ввода ключевых слов поиска по опциям.
    searchPlaceholder?: string
    // Спрятать опцию с пустым value.
    hideEmptyOptionInDropdown?: boolean
    // Добавить опцию с пустым значением в список опций.
    withEmptyOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    // Добавить в конец списка опцию, которая будет видна,
    // даже при фильтрации списка опций.
    withPermanentOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    // Отключить возможность выбрать указанные опции.
    disableOptions?: OptionValueType[]
    // Виртуализация списка опций для экономии памяти.
    // Проблема: если в опции суммарно занимают меньшую высоту, чем dropdownHeight,
    // то выпадающее меню всё-равно будет иметь высоту dropdownHeight, т.е. не уменьшится.
    virtualizationConfig?: {
        // Можно опционально включать виртуализацию в зависимости от кол-ва опций.
        // Если задано 'auto', то виртуализация будет включена, когда опций больше 50.
        enabled: boolean | 'auto'
        // Обязательное, если не указан SelectInputProps.maxHeight,
        // т.к. автоматически высота выпадающего меню не вычисляется.
        // По умолчанию: 500.
        // Если также указано значение SelectInputProps.maxHeight,
        // то будет выбрано меньшее из значений:
        // Math.min(props.maxHeight, props.virtualizeOptionsList.dropdownHeight).
        dropdownHeight?: number
    }
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
}

// Свойства компонента MultiSelectInput.
export interface MultiSelectInputProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> extends Omit<SelectInputBasicProps, 'value' | 'onChange' | 'children'> {
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>
    onChange: (values: OptionValueType[], options: FormSelectOptionsList<OptionValueType, OptionExtrasType>) => void
    values?: OptionValueType[]
    // Требуется ли выбрать хотя бы одно значение?
    required?: boolean
    // Конвертация выбранных опций для отображения в поле ввода.
    // По умолчанию отображается список из FormSelectOption['label'].
    selectedOptionsToString?: (selectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType>) => string
    // Текст для отображения в случае, если ни одной опции не выбрано.
    nothingSelectedPlaceholder?: string
    // Отключить возможность выбрать указанные опции.
    disableOptions?: OptionValueType[]
    // Нужно ли перемещать выбранные опции в начало списка опций?
    stickSelectedOptionsToTop?: boolean
    // Отрисовка подписи для опции или группы опций в выпадающем меню.
    renderOptionLabel?: (
        option: FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>,
        isGroup: boolean
    ) => string | ReactNode
    // Todo: Вкл/Выкл поиска по опциям.
    search?: boolean
    // Пояснение для поля ввода ключевых слов поиска по опциям.
    searchPlaceholder?: string
    // Todo: Виртуализация списка опций для экономии памяти.
    // Проблема: если в опции суммарно занимают меньшую высоту, чем dropdownHeight,
    // то выпадающее меню всё-равно будет иметь высоту dropdownHeight, т.е. не уменьшится.
    virtualizationConfig?: {
        // Можно опционально включать виртуализацию в зависимости от кол-ва опций.
        // Если задано 'auto', то виртуализация будет включена, когда опций больше 50.
        enabled: boolean | 'auto'
        // Обязательное, если не указан maxHeight
        // т.к. автоматически высота выпадающего меню не вычисляется.
        // По умолчанию: 500.
        // Если также указано значение SelectInputProps.maxHeight,
        // то будет выбрано меньшее из значений:
        // Math.min(props.maxHeight, props.virtualizeOptionsList.dropdownHeight).
        dropdownHeight?: number
    }
}

// Данные в option.extra для списка опций компонента MultiSelectInput.
export interface MultiSelectInputOptionExtras extends AnyObject {
    radios?: boolean
}

// Свойства компонента SelectInputOption.
export interface SelectInputOptionProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> {
    visible?: boolean
    option: FormSelectOption<OptionValueType, OptionExtrasType>
    index: number
    groupIndex?: number | null
    isActive?: boolean
    disabled?: boolean
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel']
    labelContainsHtml?: boolean
    onSelect: (
        option: FormSelectOption<OptionValueType, OptionExtrasType>,
        index: number,
        groupIndex: number | null
    ) => void
}

// Свойства компонента SelectInputOptionLabel.
export interface SelectInputOptionLabelProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> {
    option: FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel']
    labelContainsHtml?: boolean
}

// Свойства компонента SelectInputOptions.
export interface SelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> extends Pick<
        SelectInputProps<OptionValueType, OptionExtrasType>,
        'options' | 'withEmptyOption' | 'withPermanentOption' | 'hideEmptyOptionInDropdown'
        | 'maxHeight' | 'search' | 'renderOptionLabel' | 'labelsContainHtml'
        | 'disableOptions' | 'onChange' | 'trackBehaviorAs'
    > {
    selectedOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    keywordsRegexp: RegExp | null
}

// Свойства компонента SelectInputOptionsGroupHeader.
export interface SelectInputOptionsGroupHeaderProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> {
    visible?: boolean
    group: FormSelectOptionGroup<OptionValueType, OptionExtrasType>
    index: number
    isActive?: boolean
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel']
    labelContainsHtml?: boolean
}

// Свойства компонента VirtualizedSelectInputOptions.
export interface VirtualizedSelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> extends Pick<
        SelectInputProps<OptionValueType, OptionExtrasType>,
        'options' | 'withEmptyOption' | 'withPermanentOption' | 'hideEmptyOptionInDropdown' | 'search'
        | 'renderOptionLabel' | 'labelsContainHtml' | 'disableOptions'
        | 'onChange' | 'trackBehaviorAs'
    > {
    selectedOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    keywordsRegexp: RegExp | null
    height: number
}

// Результат преобразования дерева опций в одномерный список.
export interface FlattenedOption<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> {
    isGroup: false
    data: FormSelectOption<OptionValueType, OptionExtrasType>
    groupIndex: number | null
}

// Результат преобразования дерева опций в одномерный список.
export interface FlattenedOptionsGroup<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> {
    isGroup: true
    data: Omit<FormSelectOptionGroup<OptionValueType, OptionExtrasType>, 'options'>
}

// Результат преобразования дерева опций в одномерный список.
export type FlattenedOptionOrGroup<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
> = FlattenedOption<OptionValueType, OptionExtrasType>
    | FlattenedOptionsGroup<OptionValueType, OptionExtrasType>
