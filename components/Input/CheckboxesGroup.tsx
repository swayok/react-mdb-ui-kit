import clsx from 'clsx'
import {useMemo} from 'react'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
} from '../../types'
import {SectionDivider} from '../SectionDivider'
import {Checkbox} from './Checkbox'
import {CheckboxesGroupProps} from './InputTypes'
import {InputValidationError} from './InputValidationError'

/**
 * Поле выбора нескольких значений из списка в виде списка <Checkbox> компонентов.
 * Опции можно группировать в FormSelectOptionGroup.
 */
export function CheckboxesGroup<
    Value = unknown,
    OptionExtras = AnyObject,
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

/** @deprecated */
export default CheckboxesGroup
