import React, {AllHTMLAttributes, CSSProperties, useMemo} from 'react'
import {CheckboxColors} from 'swayok-react-mdb-ui-kit/types/Common'
import {withStable} from '../../helpers/withStable'
import Checkbox from './Checkbox'
import {AnyObject, FormSelectOption, FormSelectOptionGroup, FormSelectOptionsAndGroupsList} from 'swayok-react-mdb-ui-kit/types/Common'
import clsx from 'clsx'
import {SectionDivider} from '../SectionDivider'
import InputValidationError from './InputValidationError'

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
    type?: 'checkbox' |'switch'
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
        AllHTMLAttributes<HTMLInputElement>,
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

/**
 * Поле выбора нескольких значений из списка в виде списка <Checkbox> компонентов.
 * Опции можно группировать в FormSelectOptionGroup.
 */
function CheckboxesGroup<
    Value = unknown,
    OptionExtras = AnyObject
>(props: CheckboxesGroupProps<Value, OptionExtras>) {

    const {
        label,
        values,
        options,
        columns = 1,
        small,
        type = 'checkbox',

        color,
        wrapperClassName = 'mb-4',
        wrapperStyle,
        className,
        style,
        labelClassName = 'mb-3',
        labelStyle,
        checkboxWrapperClassName = 'mb-0',
        checkboxWrapperStyle,
        checkboxClassName,
        checkboxStyle,
        checkboxLabelClassName,
        checkboxLabelStyle,
        groupClassName,
        groupStyle,
        groupLabelClassName = 'my-3',
        groupLabelStyle,
        groupItemsContainerClassName,
        groupItemsContainerStyle,

        validationMessage,
        validationMessageClassName,
        invalid,

        disabled,
        readOnly,

        trackBehaviorAs,
        checkboxProps,
        onChange,
    } = props

    // Обработка и группировка опций.
    const optionGroups: FormSelectOptionGroup<Value, OptionExtras>[] = useMemo(
        () => {
            const groups: FormSelectOptionGroup<Value, OptionExtras>[] = []
            const optionsWithoutGroup: FormSelectOption<Value, OptionExtras>[] = []
            if (options && Array.isArray(options) && options.length > 0) {
                for (const item of options) {
                    if ('options' in item) {
                        groups.push(item as FormSelectOptionGroup<Value, OptionExtras>)
                    } else {
                        optionsWithoutGroup.push(item)
                    }
                }
            }
            if (optionsWithoutGroup.length > 0) {
                groups.unshift({
                    label: '',
                    options: optionsWithoutGroup,
                })
            }
            return groups
        },
        [options]
    )

    // Отрисовка чекбокса.
    const renderInputsGroup = (
        group: FormSelectOptionGroup<Value, OptionExtras>,
        index: number | string
    ) => {
        const options = []
        for (let i = 0; i < group.options.length; i++) {
            const option: FormSelectOption<Value, OptionExtras> = group.options[i]
            options.push(
                <Checkbox
                    {...checkboxProps}
                    type={type}
                    color={color}
                    key={'checkbox-' + index + '-' + i}
                    label={option.label}
                    checked={
                        values.includes(option.value)
                        || values.includes(String(option.value) as Value)
                    }
                    small={small}
                    wrapperClass={checkboxWrapperClassName}
                    wrapperStyle={checkboxWrapperStyle}
                    className={checkboxClassName}
                    style={checkboxStyle}
                    labelClass={checkboxLabelClassName}
                    labelStyle={checkboxLabelStyle}
                    withoutValidationMessage
                    trackBehaviorAs={trackBehaviorAs}
                    disabled={disabled ?? option.disabled}
                    readOnly={readOnly}
                    onChange={event => {
                        if (readOnly || disabled) {
                            return
                        }
                        onChange?.(
                            option.value,
                            !!event.currentTarget?.checked,
                            option
                        )
                    }}
                />
            )
        }

        return (
            <div
                key={'group-' + index}
                className={clsx(
                    'options-group',
                    groupClassName
                )}
                style={groupStyle}
            >
                <SectionDivider
                    label={group.label}
                    className={clsx(
                        'options-group-label',
                        groupLabelClassName
                    )}
                    style={groupLabelStyle}
                    margins="none"
                />
                <div
                    className={clsx(
                        'options-group-items',
                        `d-grid grid-columns-${columns} grid-columns-gap-3 grid-rows-gap-3`,
                        groupItemsContainerClassName
                    )}
                    style={groupItemsContainerStyle}
                >
                    {options}
                </div>
            </div>
        )
    }

    return (
        <InputValidationError
            invalid={!!invalid}
            className={clsx(
                'checkboxes-group',
                wrapperClassName
            )}
            style={wrapperStyle}
            error={validationMessage}
            errorClassName={validationMessageClassName}
            inputContainerClassName={className}
            inputContainerStyle={style}
        >
            {label && (
                <div
                    className={clsx(
                        'checkboxes-group-label',
                        labelClassName
                    )}
                    style={labelStyle}
                >
                    {label}
                </div>
            )}
            {optionGroups.map(renderInputsGroup)}
        </InputValidationError>
    )
}

export default withStable<CheckboxesGroupProps>(
    ['onChange'],
    CheckboxesGroup
)
