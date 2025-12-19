import clsx from 'clsx'
import {
    ChangeEvent,
    useId,
} from 'react'
import {findSelectedOption} from '../../helpers/findSelectedOption'
import {AnyObject} from '../../types'
import {OptionsSliderInputProps} from './InputTypes'

// Слайдер по списку опций.
export function OptionsSliderInput<
    OptionValueType = number,
    OptionExtrasType extends AnyObject = AnyObject,
>(props: OptionsSliderInputProps<OptionValueType, OptionExtrasType>) {

    const defaultId: string = useId()

    const {
        id = defaultId,
        label,
        options,
        onChange,
        value,
        showValueInLabel = false,
        minMaxLabelPlacement = 'inline',
        wrapperClassName = 'mb-4',
        labelClassName = 'mb-3',
        className,
        thumbClassName,
        thumbValueClassName = 'text-nowrap',
        optionLabelClassName,
        ...inputProps
    } = props

    const min: number = 0
    const max: number = options.length - 1
    const selectedOptionIndex: number = findSelectedOption(
        options,
        value,
        undefined,
        undefined,
        true
    )?.index ?? 0
    const thumbPosition = value === Number(min)
        ? 0
        : (((selectedOptionIndex ? selectedOptionIndex : 0 - min) * 100) / (max - min))

    return (
        <div
            className={clsx(
                'form-range',
                showValueInLabel ? 'value-in-label' : 'value-in-thumb',
                'min-max-value-label-' + minMaxLabelPlacement,
                wrapperClassName
            )}
        >
            {label && (
                <label
                    htmlFor={id}
                    className={clsx('form-range-label', labelClassName)}
                >
                    {label}
                    {showValueInLabel && (
                        <span className={clsx('selected-value ms-1', thumbValueClassName)}>
                            {options[selectedOptionIndex]?.label ?? ''}
                        </span>
                    )}
                </label>
            )}
            <div className="form-range-input-container d-flex flex-row align-items-center justify-content-between fs-7">
                <div
                    className={clsx(
                        'me-1 text-muted form-range-min',
                        optionLabelClassName
                    )}
                >
                    {options[min].label}
                </div>
                <div className="flex-1 position-relative d-flex flex-row align-items-center">
                    <input
                        {...inputProps}
                        id={id}
                        className={clsx('form-range-input', className)}
                        value={selectedOptionIndex}
                        type="range"
                        min={min}
                        max={max}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const option = options[parseInt(e.target.value)]
                            onChange?.(option.value, option)
                        }}
                    />
                    {!showValueInLabel && (
                        <span
                            className={clsx(
                                'range-thumb',
                                props.disabled ? 'disabled' : null,
                                thumbClassName
                            )}
                            style={{
                                left: `calc(${thumbPosition}% + (${thumbPosition <= 0 ? 8.5 : 7.5 - (thumbPosition * 0.155)}px))`,
                            }}
                        >
                            <span className={clsx('thumb-value', thumbValueClassName)}>
                                {options[selectedOptionIndex]?.label ?? ''}
                            </span>
                        </span>
                    )}
                </div>
                <div
                    className={clsx(
                        'ms-1 text-muted form-range-max',
                        optionLabelClassName
                    )}
                >
                    {options[max].label}
                </div>
            </div>
        </div>
    )
}

/** @deprecated */
export default OptionsSliderInput
