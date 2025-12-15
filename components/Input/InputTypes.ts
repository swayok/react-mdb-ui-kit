import type {CKEditorConfig} from 'ckeditor4-react'
import type {
    ChangeEvent,
    ClipboardEvent,
    ComponentType,
    CSSProperties,
    FocusEvent,
    FormEvent,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    Ref,
    RefObject,
} from 'react'
import type {CalendarProps} from 'react-calendar'
import type {
    AnyObject,
    AnyRef,
    ApiRef,
    ButtonColors,
    CheckboxColors,
    FormSelectOption,
    FormSelectOptionsAndGroupsList,
    FormSelectOptionsList,
    HtmlComponentProps,
    HtmlComponentPropsWithRef,
    MorphingHtmlComponentProps,
    MorphingHtmlComponentPropsWithoutRef,
    NumericKeysObject,
    ReactComponentOrTagName,
} from '../../types'
import type {ButtonProps} from '../Button'
import type {
    DropdownMenuProps,
    DropdownProps,
} from '../Dropdown/DropdownTypes'
import type {AppIconProps} from '../Icon'
import type {IconProps} from '../MDIIcon'
import type {
    TooltipProps,
} from '../Tooltip/TooltipTypes'

export type * from './SelectInput/SelectInputTypes'

// Свойства компонента ButtonsSwitchInput.
export interface ButtonsSwitchInputProps<
    ValueType = string,
> extends Omit<HtmlComponentProps<HTMLDivElement>, 'value' | 'label' | 'onChange'> {
    label?: string | ReactNode
    labelClass?: string
    labelStyle?: CSSProperties
    value?: ValueType | ValueType[]
    disabled?: boolean
    options: FormSelectOption<ValueType>[]
    buttonsProps?: Omit<ButtonProps, 'color' | 'onChange' | 'small' | 'large' | 'disabled'>
    small?: boolean
    large?: boolean
    inactiveColor?: ButtonColors
    activeColor?: ButtonColors
    onChange: (value: ValueType) => void
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean
}

// Свойства компонента Checkbox.
export interface CheckboxProps extends Omit<HtmlComponentProps<HTMLInputElement>, 'type'> {
    type?: 'checkbox' | 'radio' | 'switch'
    // Обертка.
    wrapperTag?: ReactComponentOrTagName
    wrapperClassName?: string
    wrapperProps?: HtmlComponentProps
    wrapperStyle?: CSSProperties
    // Не оборачивать в props.wrapperTag.
    disableWrapper?: boolean
    // Добавить стиль .form-check-inline.
    inline?: boolean
    // Подпись.
    label?: string
    labelId?: string
    labelClassName?: string
    labelStyle?: CSSProperties
    labelBeforeInput?: boolean
    labelIsHtml?: boolean
    // Отмечен по умолчанию.
    defaultChecked?: boolean
    // Размер иконки чекбокса: уменьшенный.
    small?: boolean
    // Цвет переключателя.
    color?: CheckboxColors
    // Если solid = false, то в состоянии "checked"
    // галочка цветная на белом фоне внутри цветного квадрата.
    // Если solid = true, то в состоянии "checked"
    // галочка белая на цветном фоне внутри цветного квадрата.
    // Применимо только к type = 'checkbox'.
    // По умолчанию: false.
    solid?: boolean
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
    ref?: Ref<HTMLInputElement>
}

// Свойства компонента CheckboxesGroup.
export interface CheckboxesGroupProps<Value = unknown, Extras = AnyObject> {
    // Основная подпись.
    label?: string | null
    // Выбранные значения (опции).
    values: Value[]
    // Набор опций или групп опций.
    options: FormSelectOptionsAndGroupsList<Value, Extras>
    // Распределить поля ввода на несколько колонок.
    // По умолчанию: null (не разделять на колонки).
    // Для более тонкой настройки под разные размеры экрана используйте inputsContainerClassName.
    columns?: number | null
    // Размер иконки чекбокса: уменьшенный.
    small?: boolean
    // Если 'checkbox' - отображать в виде чекбокса (<Checkbox type="checkbox">).
    // Если 'switch' - отображать в виде переключателя (<Switch>).
    // По умолчанию: 'checkbox'.
    type?: 'checkbox' | 'switch'
    // Цвет переключателя.
    color?: CheckboxColors
    // CSS класс внешней обертки.
    wrapperClassName?: string
    wrapperStyle?: CSSProperties
    // CSS класс обертки подписи и полей ввода содержимого.
    className?: string
    style?: CSSProperties
    // CSS класс для основной подписи (CheckboxesProps.label).
    labelClassName?: string
    labelStyle?: CSSProperties
    // CSS класс контейнера одного чекбокса (<div className><input></div>).
    checkboxWrapperClassName?: string
    checkboxWrapperStyle?: CSSProperties
    // CSS класс для чекбокса (<input className>).
    checkboxClassName?: string
    checkboxStyle?: CSSProperties
    // Свойства одного чекбокса.
    checkboxProps?: Omit<
        HtmlComponentProps<HTMLInputElement>,
        'label' | 'value' | 'className' | 'style' | 'checked' | 'disabled' | 'readOnly' | 'type' | 'color'
    >
    // CSS класс для подписи чекбокса (<input><label className>).
    checkboxLabelClassName?: string
    checkboxLabelStyle?: CSSProperties
    // CSS класс для обертки группы опций (<GroupLabel><Items>).
    groupClassName?: string
    groupStyle?: CSSProperties
    // CSS класс для подписи к группе опций (<GroupLabel>).
    groupLabelClassName?: string
    groupLabelStyle?: CSSProperties
    // CSS класс для контейнера полей ввода (<Items>).
    // Пример inputsContainerClassName для 2х колонок:
    // 'd-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3'.
    groupItemsContainerClassName?: string
    groupItemsContainerStyle?: CSSProperties
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Обработчик изменения значения одного из чекбоксов.
    onChange?: (
        value: Value,
        checked: boolean,
        option: FormSelectOption<Value, Extras>
    ) => void
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
    // Запрет изменения значений.
    disabled?: boolean
    // Запрет изменения значений.
    readOnly?: boolean
}

// Свойства компонента ComboboxInput.
export interface ComboboxInputProps extends Omit<InputProps, 'onChange'> {
    options?: FormSelectOptionsList<string | number | null> | string[]
    onChange: (
        value: string,
        event: FormEvent<HTMLInputElement> | MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => void
}

// Свойства обертки для отображения всплывающей подсказки.
type InputTooltipProps = Pick<
    TooltipProps,
    'title' | 'tooltipMaxWidth' | 'tooltipOffset' | 'tooltipTextClassName'
    | 'tooltipDisableClickHandler' | 'tooltipDisableHover' | 'tooltipPlacement'
>

// Свойства компонента Input.
export interface InputProps extends Omit<HtmlComponentProps<HTMLInputElement | HTMLTextAreaElement>, 'title'>,
    InputTooltipProps {
    textarea?: boolean
    inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement | null>
    label?: string
    labelId?: string
    labelClassName?: string
    labelStyle?: CSSProperties
    labelRef?: Ref<HTMLLabelElement>
    // Мультипликаторы размера label в активном состоянии.
    activeInputLabelSizeMultiplier?: number | {
        normal?: number
        small?: number
        large?: number
    }
    wrapperProps?: Omit<InputWrapperProps, InputWrapperPropsFromInput | 'className' | 'style'>
    wrapperClassName?: string
    wrapperStyle?: CSSProperties
    value?: string
    disabled?: boolean
    small?: boolean
    large?: boolean
    contrast?: boolean
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean
    // Указать true, если label должен быть как будто поле ввода в активном состоянии.
    active?: boolean
    // Указать true, если поле ввода внутри <InputGroup> и должно занимать всё свободное пространство.
    grouped?: boolean | 'first' | 'center' | 'last'
    // Регулярное выражение для фильтрации вводимых символов.
    allowedChars?: RegExp
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
    /**
     * Компонент оформления поля ввода.
     * По умолчанию: InputUi
     * @see InputUi
     */
    UiComponent?: ComponentType<InputUiProps>
    /**
     * Компонент Отображения подписи для поля ввода.
     * По умолчанию: InputLabel
     * @see InputLabel
     */
    LabelComponent?: ComponentType<InputLabelProps>
    /**
     * Компонент обертки поля ввода и подписи с возможностью вывода ошибки.
     * По умолчанию: InputWrapper
     * @see InputWrapper
     */
    WrapperComponent?: ComponentType<InputWrapperProps>
}

// Размер поля ввода.
export type InputSize = 'small' | 'normal' | 'large'

// Свойства обертки, передаваемые из свойств поля ввода.
type InputWrapperPropsFromInput = 'invalid' | 'validationMessage'
    | 'validationMessageClassName' | 'withoutValidationMessage'
    | 'contrast' | 'grouped'

// Свойства компонента InputWrapper.
export interface InputWrapperProps extends Omit<HtmlComponentProps<HTMLDivElement>, 'title'>,
    Pick<InputProps, InputWrapperPropsFromInput>,
    InputTooltipProps {
    children: ReactNode | ReactNode[]
}

// API компонента InputUi.
export interface InputUiApi {
    updateWidth: () => void
}

// Свойства компонента InputUi.
export interface InputUiProps {
    ref?: AnyRef<HTMLDivElement>
    apiRef?: ApiRef<InputUiApi>
    labelRef: RefObject<HTMLLabelElement | null>
    size: InputSize
    className?: string
    activeInputLabelSizeMultiplier?: InputProps['activeInputLabelSizeMultiplier']
    invalid: InputProps['invalid']
}

// Свойства компонента InputLabel.
export interface InputLabelProps extends Omit<
    HtmlComponentPropsWithRef<HTMLLabelElement>,
    'label' | 'htmlFor'
> {
    label: InputProps['label']
    inputId?: string
    invalid: InputProps['invalid']
}

// Одна дата.
export type DateInputSingleDateValue = Date | null

// Диапазон дат.
export type DateInputDateRangeValue = [Date | null, Date | null]

// Значение поля ввода DateInput.
export type DateInputValue = DateInputSingleDateValue | DateInputDateRangeValue

export type DateInputDropdownProps = Pick<
    DropdownProps,
    'closeOnScrollOutside' | 'onOpenChange'
>

export type DateInputDropdownMenuProps = Pick<
    DropdownMenuProps,
    'offset' | 'drop' | 'align' | 'flip' | 'shift' | 'shadow' | 'isRTL'
>

// Свойства компонента DateInput.
export interface DateInputProps extends Omit<InputProps, 'children' | 'onChange' | 'value'>,
    DateInputDropdownProps,
    DateInputDropdownMenuProps {
    value: DateInputValue
    // Конвертация даты или периода для отображения в поле ввода.
    valueToString?: (from: DateInputSingleDateValue, to: DateInputSingleDateValue) => string
    // Формат даты (DateTimeService) для стандартного valueToString.
    dateFormat?: string
    allowEmptyValue?: boolean
    // Настройки выпадающего меню.
    dropdownMenuClassName?: string
    dropdownToggleClassName?: string
    onChange: (from: DateInputSingleDateValue, to: DateInputSingleDateValue) => void
    calendarProps?: Omit<CalendarProps, 'onChange' | 'value'>
    // Показать иконку календаря? По умолчанию: true.
    showCalendarIcon?: boolean
    // Нужно ли закрывать выпадающее меню при выборе опции.
    closeDropdownOnSelect?: boolean
}

// Свойства компонента FileInputAsButton.
export interface FileInputAsButtonProps extends Omit<ButtonProps, 'onChange' | 'onClick' | 'labelFor' | 'id' | 'ref'>,
    Pick<HtmlComponentProps<HTMLInputElement>, 'accept' | 'onChange' | 'id' | 'children'> {
    ref?: Ref<HTMLInputElement>
    buttonRef?: RefObject<HTMLLabelElement>
    inputProps?: Omit<HtmlComponentProps<HTMLInputElement>, 'type' | 'className' | 'id' | 'ref'>
}

// Свойства компонента InputAddonIcon.
export interface InputAddonIconProps extends IconProps {
    iconClassName?: string
}

// Свойства компонента InputAddonText.
export interface InputAddonTextProps extends HtmlComponentProps<HTMLDivElement> {
    contentClassName?: string
}

// Свойства компонента InputGroup.
export interface InputGroupProps extends MorphingHtmlComponentProps {
    noWrap?: boolean
}

// Свойства компонента InputGroupText.
export interface InputGroupTextProps extends MorphingHtmlComponentProps {
    noBorder?: boolean
    small?: boolean
    large?: boolean
}

// Свойства компонента InputGroupText.
export interface InputGroupIconProps extends Omit<MorphingHtmlComponentProps, 'size' | 'onClick' | 'label'>,
    Pick<
        AppIconProps,
        'path' | 'color' | 'rotate' | 'vertical' | 'spin' | 'size' | 'label'
        | 'reuse' | 'reusableItemContainerClass' | 'onClick'
        | 'tooltip' | 'tooltipProps' | 'tooltipMaxWidth' | 'centerIconInTooltip'
    >
{
    noBorder?: boolean
    small?: boolean
    large?: boolean
    iconClassName?: string
}

// Свойства компонента InputInfo для HTML контента.
export interface InputInfoPropsForHtml extends Omit<MorphingHtmlComponentPropsWithoutRef, 'dangerouslySetInnerHTML'> {
    html: string
    children?: never
}

// Свойства компонента InputInfo для не HTML контента.
export interface InputInfoPropsForText extends Omit<MorphingHtmlComponentPropsWithoutRef, 'dangerouslySetInnerHTML'> {
    html?: never
}

// Свойства компонента InputInfo.
export type InputInfoProps = InputInfoPropsForHtml | InputInfoPropsForText

// Свойства компонента InputValidationError.
export interface InputValidationErrorProps extends Omit<HtmlComponentProps<HTMLDivElement>, 'title'>,
    InputTooltipProps {
    invalid: boolean
    error?: string | string[] | AnyObject<string> | NumericKeysObject<string> | null
    errorClassName?: string
    inputContainerClassName?: string
    inputContainerStyle?: CSSProperties
}

// Свойства компонента MaskedNumericInput.
export interface MaskedNumericInputProps extends Omit<InputProps, 'onChange' | 'maxLength'> {
    // Шаблон значения.
    // Например, "+7 (___) ___-__-__".
    // Подчеркивание - это цифра, которую может ввести пользователь,
    // всё остальное - это неизменные символы (включая пробелы).
    template: string
    // Функция для очистки значения для onChange().
    // По умолчанию: value => value.replace(/[^+0-9]+/g, '')
    // Пример: template = '0___ ___ ___'.
    // Введено: value = '0999 888 777'.
    // Чистое значение: '0999888777'.
    // Пример: template = '+7 (___) ___-__-__'.
    // Введено: value = '+7 (999) 888-77-66'.
    // Чистое значение: '+79998887766'.
    // Если нужно другое поведение, то можно задать свою функцию очистки значения.
    valueCleaner?: (value: string) => string
    // Минимальная позиция курсора в поле ввода,
    // если ввод значения начинается не с нулевой позиции.
    // Пример: для template = "+7 (___) ___-__-__"
    // minCursorPosition = 3 (индекс первого подчеркивания).
    minCursorPosition: number
    onChange: (
        event: ChangeEvent<HTMLInputElement>
            | FocusEvent<HTMLInputElement>
            | KeyboardEvent<HTMLInputElement>
            | ClipboardEvent<HTMLInputElement>,
        // Результат выполнения функции из свойства valueCleaner.
        // Примеры:
        // event.currentTarget.value = '+7 (000) 111-22-33', cleanValue = '+70001112233'.
        // event.currentTarget.value = '(111) 222-33-44', cleanValue = '1112223344'.
        cleanValue: string
    ) => void
}

// Свойства компонента NumericInput.
export interface NumericInputProps extends Omit<
    InputProps,
    'onChange' | 'onPaste' | 'onBeforeInput'
> {
    /**
     * Формат, совместимый с numeral().format().
     * Внимание: thousands separator в numeralFormat не поддерживается!
     *
     * @see http://numeraljs.com/#format
     */
    numeralFormat?: string
    // Разрешить отрицательные числа?
    allowNegative?: boolean
    // Разделитель целой и дробной части числа.
    decimalSeparator?: '.' | ','
    // Кол-во цифр в целой части вводимого числа.
    maxLength?: number
    onChange: (
        e: ChangeEvent<HTMLInputElement>
            | FocusEvent<HTMLInputElement>
            | KeyboardEvent<HTMLInputElement>,
        formattedValue: string,
        cleanValue: number | null
    ) => void
}

// Свойства компонента OptionsSliderInput.
export interface OptionsSliderInputProps<
    OptionValueType = number,
    OptionExtrasType = AnyObject,
> extends Omit<HtmlComponentProps<HTMLInputElement>, 'value' | 'label' | 'onChange' | 'type'> {
    label?: string | ReactNode
    options: FormSelectOptionsList<OptionValueType, OptionExtrasType>
    value?: OptionValueType
    wrapperClassName?: string
    labelClassName?: string
    thumbClassName?: string
    thumbValueClassName?: string
    optionLabelClassName?: string
    showValueInLabel?: boolean
    minMaxLabelPlacement?: 'inline' | 'below'
    onChange: (
        value: OptionValueType,
        option: FormSelectOption<OptionValueType, OptionExtrasType>
    ) => void
}

// Свойства компонента PasswordInput.
export interface PasswordInputProps extends Omit<InputProps, 'type'> {
    withUnmaskToggler?: boolean
}

// Свойства компонента RadiosGroup.
export interface RadiosGroupProps<Value = unknown, Extras = AnyObject> {
    // Основная подпись.
    // Если false - не отображать <SectionDivider>.
    label?: string | null | false
    // Имя группы (<input type="radio" name>).
    name?: string
    // Выбранные значения (опции).
    value: Value
    // Набор опций или групп опций.
    options: FormSelectOptionsList<Value, Extras>
    // Распределить поля ввода на несколько колонок.
    // По умолчанию: null (не разделять на колонки).
    // Для более тонкой настройки под разные размеры экрана используйте inputsContainerClassName.
    columns?: number | null
    // Размер иконки чекбокса: уменьшенный.
    small?: boolean
    // Цвет переключателя.
    color?: CheckboxColors
    // CSS класс внешней обертки.
    wrapperClassName?: string
    wrapperStyle?: CSSProperties
    // CSS класс обертки подписи и полей ввода содержимого.
    className?: string
    style?: CSSProperties
    // CSS класс для основной подписи (radiosProps.label).
    labelClassName?: string
    labelStyle?: CSSProperties
    // CSS класс контейнера одного чекбокса (<div className><input></div>).
    radioWrapperClassName?: string
    radioWrapperStyle?: CSSProperties
    // CSS класс для чекбокса (<input className>).
    radioClassName?: string
    radioStyle?: CSSProperties
    // Свойства одного чекбокса.
    radioProps?: Omit<
        HtmlComponentProps<HTMLInputElement>,
        'label' | 'value' | 'className' | 'style' | 'checked' | 'disabled' | 'readOnly' | 'type'
    >
    // CSS класс для подписи чекбокса (<input><label className>).
    radioLabelClassName?: string
    radioLabelStyle?: CSSProperties
    // CSS класс для контейнера полей ввода (<Items>).
    // Пример inputsContainerClassName для 2х колонок:
    // 'd-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3'.
    radiosContainerClassName?: string
    radiosContainerStyle?: CSSProperties
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Обработчик изменения значения одного из чекбоксов.
    onChange?: (
        value: Value,
        option: FormSelectOption<Value, Extras>
    ) => void
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
    // Запрет изменения значений.
    disabled?: boolean
    // Запрет изменения значений.
    readOnly?: boolean
}

// Свойства компонента WysiwygInput.
export interface WysiwygInputProps extends HtmlComponentProps<HTMLTextAreaElement> {
    // Контейнер CKEditor'а.
    editorRef?: RefObject<HTMLDivElement>
    // Поле ввода внутри CKEditor'а.
    textareaRef?: RefObject<HTMLTextAreaElement>
    config?: CKEditorConfig
    label?: string
    labelId?: string
    labelClassName?: string
    labelStyle?: CSSProperties
    labelRef?: RefObject<HTMLLabelElement>
    // Мультипликаторы размера label в активном состоянии.
    activeInputLabelSizeMultiplier?: number | {
        normal?: number
        small?: number
        large?: number
    }
    wrapperTag?: ReactComponentOrTagName
    wrapperProps?: AnyObject
    wrapperClassName?: string
    wrapperStyle?: CSSProperties
    value?: string
    disabled?: boolean
    small?: boolean
    large?: boolean
    contrast?: boolean
    // Настройки валидности введенных данных.
    invalid?: boolean
    validationMessage?: string | null
    validationMessageClassName?: string
    // Указать true, если не нужно оборачивать поле ввода в <InputValidationError>.
    withoutValidationMessage?: boolean
    // Указать true, если label должен быть как будто поле ввода в активном состоянии.
    active?: boolean
    // Указать true, если поле ввода внутри <InputGroup> и должно занимать всё свободное пространство.
    grouped?: boolean | 'first' | 'center' | 'last'
}
