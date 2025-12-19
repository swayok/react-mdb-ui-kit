import type {OpenChangeReason} from '@floating-ui/react'
import type {
    FormEvent,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    Ref,
} from 'react'
import type {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionOrGroup,
    FormSelectOptionsAndGroupsList,
    FormSelectOptionsList,
} from '../../../types'
import type {
    DropdownMenuContentProps,
    DropdownMenuProps,
    DropdownProps,
} from '../../Dropdown/DropdownTypes'
import type {InputProps} from '../InputTypes'

export type SelectInputDropdownProps = Pick<
    DropdownProps,
    'focusFirstItemOnOpen' | 'closeOnScrollOutside' | 'onOpenChange'
>

export type SelectInputDropdownMenuProps = Pick<
    DropdownMenuProps,
    'offset' | 'drop' | 'align' | 'flip' | 'shift' | 'shadow' | 'isRTL' | 'maxHeight'
>

// Api компонента SelectInputBasic.
export interface SelectInputBasicApi {
    // Изменение видимости выпадающего меню.
    setIsOpen: (
        open: boolean | ((prevState: boolean) => boolean),
        event?: Event,
        reason?: OpenChangeReason
    ) => void
    // Обработчик события нажатия кнопки на клавиатуре для поля фильтрации опций.
    // При нажатии Enter или Tab на клавиатуре, вызывается SelectInputBasicProps.onOptionSelect().
    // Функция нельзя использовать вот так:
    // onKeyDown={apiRef.current?.onSearchInputKeyDown}.
    // Правильно:
    // onKeyDown={e => apiRef.current?.onSearchInputKeyDown(e)}.
    onSearchInputKeyDown: (
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
}

// Свойства компонента SelectInputBasic.
export interface SelectInputBasicProps extends Omit<InputProps, 'wrapperProps' | 'wrapperTag'>,
    SelectInputDropdownProps,
    SelectInputDropdownMenuProps {
    apiRef?: Ref<SelectInputBasicApi>
    // Содержимое выпадающего меню (опции / DropdownItem).
    children: ReactNode | ReactNode[]
    // Режим отображения.
    // Если inline: внешний вид: {текст} {chevron}, без оформления в виде поля ввода,
    // подходит для вставки в текст или в панель навигации.
    // Если input: внешний вид соответствует полю ввода c {chevron} в конце блока.
    mode?: 'inline' | 'input'
    // Настройки выпадающего меню.
    dropdownMenuClassName?: string
    // Тень выпадающего меню.
    dropdownShadow?: DropdownMenuContentProps['shadow']
    // Внешний контроль состояния открытости выпадающего меню (DropdownProps.show).
    open?: boolean
    // Добавить white-space: nowrap ко всем опция выпадающего меню?
    textNowrapOnOptions?: boolean
    // Минимальная ширина выпадающего меню.
    minWidth?: null | number | string
    /**
     * Способ определения ширины выпадающего меню:
     * - fit-input - размер меню = размеру поля ввода.
     * - fill-container - размер меню = размеру контейнера поля ввода (width = 100%).
     * - fit-items - размер меню определяется размерами элементов в нем (авто-ширина по сути).
     * По умолчанию: 'fit-input'
     */
    dropdownWidth?: 'fit-input' | 'fill-container' | 'fit-items'
    // Дополнительный отступ для выпадающего меню, если оно открывается над полем ввода.
    // Требуется для того, чтобы не загораживать подпись в активном режиме отображения.
    dropUpOffset?: number
    // Вызвать onOptionSelect при нажатии Tab на клавиатуре?
    // По умолчанию: true.
    selectOptionOnTabKey?: boolean
    // Вызвать onOptionSelect при нажатии Space на клавиатуре?
    // По умолчанию: false.
    selectOptionOnSpaceKey?: boolean
    // Выбор опции по нажатию Enter, Tab или Space на клавиатуре.
    onOptionSelect?: (
        optionIndex: number,
        optionElement: HTMLElement | null,
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
}

// Свойства компонента SelectInput.
export interface SelectInputProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
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
        option: Omit<FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>, 'options'>,
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
    // Можно опционально включать виртуализацию в зависимости от кол-ва опций.
    // Если задано 'auto', то виртуализация будет включена, когда опций больше 50.
    // Проблема: если в опции суммарно занимают меньшую высоту, чем maxHeight,
    // то выпадающее меню всё-равно будет иметь высоту maxHeight, т.е. не уменьшится.
    enableVirtualization?: boolean | 'auto'
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
    // Нужно ли закрывать выпадающее меню при выборе опции.
    closeDropdownOnSelect?: boolean
}

// Свойства компонента ComboboxInput.
export interface ComboboxInputProps extends Omit<InputProps, 'onChange'> {
    options?: FormSelectOptionsList<string | number | null> | string[]
    maxHeight?: SelectInputBasicProps['maxHeight']
    // Дополнительный отступ для выпадающего меню, если оно открывается над полем ввода.
    // Требуется для того, чтобы не загораживать подпись в активном режиме отображения.
    dropUpOffset?: number
    onChange: (
        value: string,
        event: FormEvent<HTMLInputElement> | MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => void
}

// Свойства компонента MultiSelectInput.
export interface MultiSelectInputProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> extends Omit<SelectInputBasicProps, 'value' | 'onChange' | 'children'> {
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>
    onChange: (values: OptionValueType[], options: FormSelectOptionsList<OptionValueType, OptionExtrasType>) => void
    values?: OptionValueType[]
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
        option: Omit<FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>, 'options'>,
        isGroup: boolean
    ) => string | ReactNode
    // Задать true, если FormSelectOption['label'] может содержать HTML, а не только обычный текст.
    labelsContainHtml?: boolean
    // Todo: Вкл/Выкл поиска по опциям.
    search?: boolean
    // Пояснение для поля ввода ключевых слов поиска по опциям.
    searchPlaceholder?: string
    // Todo: Виртуализация списка опций для экономии памяти.
    // Можно опционально включать виртуализацию в зависимости от кол-ва опций.
    // Если задано 'auto', то виртуализация будет включена, когда опций больше 50.
    // Проблема: если в опции суммарно занимают меньшую высоту, чем maxHeight,
    // то выпадающее меню всё-равно будет иметь высоту maxHeight, т.е. не уменьшится.
    enableVirtualization?: SelectInputProps['enableVirtualization']
}

// Данные в option.extra для списка опций компонента MultiSelectInput.
export interface MultiSelectInputOptionExtras extends AnyObject {
    radios?: boolean
}

// Свойства компонента SelectInputOption.
export interface SelectInputOptionProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> {
    visible?: boolean
    option: FormSelectOption<OptionValueType, OptionExtrasType>
    // Индекс в одномерном списке опций из flattenOptions().
    flatIndex: number
    // Индекс в группе опций.
    index: number
    // Индекс группы опций.
    groupIndex?: number | null
    // Глубина вложенности опции.
    depth: number
    isActive?: boolean
    disabled?: boolean
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel']
    labelContainsHtml?: boolean
    className?: string
    beforeLabel?: ReactNode
    afterLabel?: ReactNode
    onSelect: (
        option: FormSelectOption<OptionValueType, OptionExtrasType>,
        index: number,
        groupIndex: number | null
    ) => void
}

// Свойства компонента SelectInputOptionLabel.
export interface SelectInputOptionLabelProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> {
    option: Omit<FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>, 'options'>
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel']
    labelContainsHtml?: boolean
}

// Свойства компонента SelectInputOptions.
export interface SelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> extends Pick<
        SelectInputProps<OptionValueType, OptionExtrasType>,
        'hideEmptyOptionInDropdown'
        | 'search' | 'renderOptionLabel' | 'labelsContainHtml'
        | 'disableOptions' | 'onChange' | 'trackBehaviorAs'
    > {
    options: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[]
    selectedOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    keywordsRegexp: RegExp | null
}

// Свойства компонента SelectInputOptions.
export interface MultiSelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = MultiSelectInputOptionExtras,
    GroupInfoType extends MultiSelectInputOptionsGroupInfo<
        OptionValueType
    > = MultiSelectInputOptionsGroupInfo<OptionValueType>,
> extends Pick<
        MultiSelectInputProps<OptionValueType, OptionExtrasType>,
        | 'search' | 'renderOptionLabel' | 'labelsContainHtml'
        | 'disableOptions' | 'trackBehaviorAs'
    > {
    options: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType, GroupInfoType>[]
    selectedValues: OptionValueType[]
    keywordsRegexp: RegExp | null
    onSelect: (
        option: FormSelectOption<OptionValueType, OptionExtrasType>,
        index: number,
        groupIndex: number | null,
        isRadios: boolean,
        groupValues: OptionValueType[] | null
    ) => void
}

// Свойства компонента SelectInputOptionsGroupHeader.
export interface SelectInputOptionsGroupHeaderProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> {
    visible?: boolean
    group: Omit<FormSelectOptionGroup<OptionValueType, OptionExtrasType>, 'options'>
    index: number
    // Глубина вложенности опции.
    depth: number
    isActive?: boolean
    renderOptionLabel?: SelectInputProps<OptionValueType, OptionExtrasType>['renderOptionLabel']
    labelContainsHtml?: boolean
}

// Свойства компонента VirtualizedSelectInputOptions.
export interface VirtualizedSelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> extends Pick<
        SelectInputProps<OptionValueType, OptionExtrasType>,
        'hideEmptyOptionInDropdown' | 'search'
        | 'renderOptionLabel' | 'labelsContainHtml' | 'disableOptions'
        | 'onChange' | 'trackBehaviorAs'
    > {
    options: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[]
    selectedOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    keywordsRegexp: RegExp | null
    height: number
}

// Результат преобразования дерева опций в одномерный список.
export interface FlattenedOption<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
    GroupInfoType extends AnyObject = AnyObject,
> {
    isGroup: false
    data: FormSelectOption<OptionValueType, OptionExtrasType>
    index: number
    depth: number
    groupIndex: number | null
    groupInfo?: GroupInfoType | null
}

// Результат преобразования дерева опций в одномерный список.
export interface FlattenedOptionsGroup<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
> {
    isGroup: true
    data: Omit<FormSelectOptionGroup<OptionValueType, OptionExtrasType>, 'options'>
    index: number
    depth: number
}

// Результат преобразования дерева опций в одномерный список.
export type FlattenedOptionOrGroup<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = AnyObject,
    GroupInfoType extends AnyObject = AnyObject,
> = FlattenedOption<OptionValueType, OptionExtrasType, GroupInfoType>
    | FlattenedOptionsGroup<OptionValueType, OptionExtrasType>

// Информация о группе опций для компонента MultiSelectInputOptions.
export interface MultiSelectInputOptionsGroupInfo<
    OptionValueType = string,
> {
    isRadios: boolean
    optionValues: OptionValueType[]
}
