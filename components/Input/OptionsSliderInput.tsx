import clsx from 'clsx'
import {useId} from 'react'
import {OptionsSliderInputProps} from './InputTypes'
import {AnyObject} from '../../types'
import {findSelectedOption} from '../../helpers/findSelectedOption'

// Слайдер по списку опций.
export function OptionsSliderInput<
    OptionValueType = number,
    OptionExtrasType = AnyObject,
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
        wrapperClass = 'mb-4',
        labelClass = 'mb-3',
        className,
        thumbClass,
        thumbValueClass = 'text-nowrap',
        optionLabelClass,
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
                wrapperClass
            )}
        >
            {label && (
                <label
                    htmlFor={id}
                    className={clsx('form-range-label', labelClass)}
                >
                    {label}
                    {showValueInLabel && (
                        <span className={clsx('selected-value ms-1', thumbValueClass)}>
                            {options[selectedOptionIndex]?.label ?? ''}
                        </span>
                    )}
                </label>
            )}
            <div className="form-range-input-container d-flex flex-row align-items-center justify-content-between fs-7">
                <div className={clsx(
                    'me-1 text-muted form-range-min',
                    optionLabelClass
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const option = options[parseInt(e.target.value)]
                            onChange?.(option.value, option)
                        }}
                    />
                    {!showValueInLabel && (
                        <span
                            className={clsx(
                                'range-thumb',
                                props.disabled ? 'disabled' : null,
                                thumbClass
                            )}
                            style={{
                                left: `calc(${thumbPosition}% + (${thumbPosition <= 0 ? 8.5 : 7.5 - (thumbPosition * 0.155)}px))`,
                            }}
                        >
                            <span className={clsx('thumb-value', thumbValueClass)}>
                                {options[selectedOptionIndex]?.label ?? ''}
                            </span>
                        </span>
                    )}
                </div>
                <div className={clsx(
                    'ms-1 text-muted form-range-max',
                    optionLabelClass
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
