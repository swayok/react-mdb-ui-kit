import clsx from 'clsx'
import React, {AllHTMLAttributes, CSSProperties, useId} from 'react'
import withStable from '../../helpers/withStable'
import {AnyObject, CheckboxColors, FormSelectOption, FormSelectOptionsList} from '../../types/Common'
import SectionDivider from '../SectionDivider'
import InputValidationError from './InputValidationError'
import Radio from './Radio'

export interface RadiosGroupProps<Value = unknown, Extras = AnyObject> {
    // Основная подпись.
    // Если false - не отображать <SectionDivider>.
    label?: string | null | false;
    // Имя группы (<input type="radio" name>).
    name?: string;
    // Выбранные значения (опции).
    value: Value;
    // Набор опций или групп опций.
    options: FormSelectOptionsList<Value, Extras>;
    // Распределить поля ввода на несколько колонок.
    // По умолчанию: null (не разделять на колонки).
    // Для более тонкой настройки под разные размеры экрана используйте inputsContainerClassName.
    columns?: number | null;
    // Размер иконки чекбокса: уменьшенный.
    small?: boolean,
    // Цвет переключателя.
    color?: CheckboxColors
    // CSS класс внешней обертки.
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    // CSS класс обертки подписи и полей ввода содержимого.
    className?: string;
    style?: CSSProperties;
    // CSS класс для основной подписи (radiosProps.label).
    labelClassName?: string;
    labelStyle?: CSSProperties;
    // CSS класс контейнера одного чекбокса (<div className><input></div>).
    radioWrapperClassName?: string;
    radioWrapperStyle?: CSSProperties;
    // CSS класс для чекбокса (<input className>).
    radioClassName?: string;
    radioStyle?: CSSProperties;
    // Свойства одного чекбокса.
    radioProps?: Omit<
        AllHTMLAttributes<HTMLInputElement>,
        'label' | 'value' | 'className' | 'style' | 'checked' | 'disabled' | 'readOnly' | 'type'
    >
    // CSS класс для подписи чекбокса (<input><label className>).
    radioLabelClassName?: string;
    radioLabelStyle?: CSSProperties;
    // CSS класс для контейнера полей ввода (<Items>).
    // Пример inputsContainerClassName для 2х колонок:
    // 'd-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3'.
    radiosContainerClassName?: string;
    radiosContainerStyle?: CSSProperties;
    // Настройки валидности введенных данных.
    invalid?: boolean,
    validationMessage?: string | null,
    validationMessageClassName?: string,
    // Обработчик изменения значения одного из чекбоксов.
    onChange?: (
        value: Value,
        option: FormSelectOption<Value, Extras>
    ) => void;
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string,
    // Запрет изменения значений.
    disabled?: boolean,
    // Запрет изменения значений.
    readOnly?: boolean,
}

/**
 * Поле выбора одного значения из списка в виде списка <Radio> компонентов.
 * Опции нельзя группировать в FormSelectOptionGroup.
 */
function RadiosGroup<
    Value = unknown,
    Extras = AnyObject
>(props: RadiosGroupProps<Value, Extras>) {

    const defaultName = useId()

    const {
        label,
        name = defaultName,
        value,
        options,
        columns = 1,
        small,
        color,

        wrapperClassName = 'mb-4',
        wrapperStyle,
        className,
        style,
        labelClassName = 'mb-3',
        labelStyle,
        radioWrapperClassName = 'mb-0',
        radioWrapperStyle,
        radioClassName,
        radioStyle,
        radioLabelClassName,
        radioLabelStyle,
        radiosContainerClassName,
        radiosContainerStyle,

        validationMessage,
        validationMessageClassName = 'ps-0',
        invalid,

        disabled,
        readOnly,

        trackBehaviorAs,
        radioProps,
        onChange,
    } = props

    // Отрисовка радио-кнопки.
    const renderInput = (
        option: FormSelectOption,
        index: number | string
    ) => (
        <Radio
            {...radioProps}
            key={'radio-' + index}
            name={name}
            label={option.label}
            checked={
                option.value === value
                || String(option.value) === value
            }
            small={small}
            color={color}
            wrapperClass={radioWrapperClassName}
            wrapperStyle={radioWrapperStyle}
            className={radioClassName}
            style={radioStyle}
            labelClass={radioLabelClassName}
            labelStyle={radioLabelStyle}
            withoutValidationMessage
            trackBehaviorAs={trackBehaviorAs}
            disabled={disabled}
            readOnly={readOnly}
            onChange={event => {
                if (readOnly || disabled || !event.currentTarget.checked) {
                    return
                }
                onChange?.(option.value as Value, option as FormSelectOption<Value, Extras>)
            }}
        />
    )

    return (
        <InputValidationError
            invalid={!!invalid}
            className={clsx(
                'radios-input',
                wrapperClassName
            )}
            style={wrapperStyle}
            error={validationMessage}
            errorClassName={validationMessageClassName}
            inputContainerClassName={className}
            inputContainerStyle={style}
        >
            {label !== false && (
                <SectionDivider
                    label={label}
                    className={clsx(
                        'radios-input-label',
                        labelClassName
                    )}
                    margins="none"
                    style={labelStyle}
                />
            )}
            <div
                className={clsx(
                    radiosContainerClassName,
                    columns
                        ? `d-grid grid-columns-${columns} grid-columns-gap-3 grid-rows-gap-3`
                        : null
                )}
                style={radiosContainerStyle}
            >
                {(options as FormSelectOptionsList).map(renderInput)}
            </div>
        </InputValidationError>
    )
}

export default withStable<RadiosGroupProps>(
    ['onChange'],
    RadiosGroup
) as typeof RadiosGroup
