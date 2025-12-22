import clsx from 'clsx'
import {useId} from 'react'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionsList,
} from '../../types'
import {SectionDivider} from '../SectionDivider'
import {RadiosGroupProps} from './InputTypes'
import {InputValidationError} from './InputValidationError'
import {Radio} from './Radio'

/**
 * Поле выбора одного значения из списка в виде списка <Radio> компонентов.
 * Опции нельзя группировать в FormSelectOptionGroup.
 */
export function RadiosGroup<
    Value = unknown,
    Extras extends AnyObject = AnyObject,
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
            wrapperClassName={radioWrapperClassName}
            wrapperStyle={radioWrapperStyle}
            className={radioClassName}
            style={radioStyle}
            labelClassName={radioLabelClassName}
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
