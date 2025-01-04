import React, {Suspense, useMemo, useRef} from 'react'
import Icon from '../Icon'
import clsx from 'clsx'
import Dropdown, {DropdownProps} from '../Dropdown/Dropdown'
import DropdownToggle from '../Dropdown/DropdownToggle'
import DropdownMenu from '../Dropdown/DropdownMenu'
import Input, {InputProps} from './Input'
import InputValidationError from './InputValidationError'
import {mdiCalendarMonthOutline, mdiClose} from '@mdi/js'
import withStable from '../../helpers/withStable'
import IconButton from '../IconButton'
import DateTimeService from '../../services/DateTimeService'
import {CalendarProps} from 'react-calendar'
import InputAddonText from './InputAddonText'
import UserBehaviorService from '../../services/UserBehaviorService'

const Calendar = React.lazy(() => import('react-calendar'))

export type DateInputSingleDateValue = Date | null;
export type DateInputDateRangeValue = [Date | null, Date | null];
export type DateInputValue = DateInputSingleDateValue | DateInputDateRangeValue;

export interface DateInputProps extends Omit<InputProps, 'children' | 'onChange' | 'value'> {
    value: DateInputValue;
    // Конвертация даты или периода для отображения в поле ввода.
    valueToString?: (from: DateInputSingleDateValue, to: DateInputSingleDateValue) => string;
    // Формат даты (DateTimeService) для стандартного valueToString.
    dateFormat?: string;
    allowEmptyValue?: boolean;
    // Настройки выпадающего меню.
    dropdownMenuClassName?: string;
    dropdownToggleClassName?: string;
    dropdownProps?: Omit<DropdownProps, 'dropup' | 'className' | 'disabled'>;
    dropup?: boolean;
    onChange: (from: DateInputSingleDateValue, to: DateInputSingleDateValue) => void;
    calendarProps?: Omit<CalendarProps, 'onChange' | 'value'>;
    // Показать иконку календаря? По умолчанию: true.
    showCalendarIcon?: boolean;
}

type DropdownControls = {
    close: () => void
}

// Выбор даты или периода.
function DateInput(props: DateInputProps) {

    const {
        value,
        valueToString,
        dateFormat = DateTimeService.defaultFormat,
        allowEmptyValue,
        className,
        dropdownToggleClassName,
        dropdownMenuClassName,
        wrapperClass = 'mb-4',
        dropdownProps,
        dropup,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        onChange,
        onFocus,
        calendarProps = {
            selectRange: Array.isArray(value),
        },
        trackBehaviorAs,
        wrapperProps = {
            tag: 'div',
        },
        showCalendarIcon = true,
        ...inputProps
    } = props

    // Управление выпадающим меню.
    const dropdownControlsRef = useRef<DropdownControls>({
        close() {
        },
    })

    // Обработка выбора новой даты или периода.
    const handleChange = (value: DateInputValue): void => {
        let from: DateInputSingleDateValue
        let to: DateInputSingleDateValue = null
        if (Array.isArray(value)) {
            from = value[0]
            to = value[1]
        } else {
            from = value
        }

        if (
            !calendarProps.selectRange
            || !calendarProps.allowPartialRange
            || (from && to)
        ) {
            dropdownControlsRef.current.close()
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(convertDateInputValueToString(value, dateFormat, valueToString))
            }
        }
        onChange(from, to)
    }

    // Конвертирование даты или периода в строку для отображения в поле ввода.
    const inputValue: string = useMemo(
        () => convertDateInputValueToString(value, dateFormat, valueToString),
        [value, dateFormat, valueToString]
    )

    let hasValue: boolean
    if (Array.isArray(value)) {
        hasValue = value[0] !== null || value[1] !== null
    } else {
        hasValue = value !== null
    }

    const showCleanValueButton = allowEmptyValue && hasValue

    let dropdownToggle = (
        <Input
            type="text"
            value={inputValue}
            className={clsx(
                dropdownToggleClassName,
                className,
                props.disabled ? null : 'cursor'
            )}
            wrapperClass="m-0"
            wrapperTag={DropdownToggle}
            wrapperProps={wrapperProps}
            active={inputValue !== ''}
            readOnly
            withoutValidationMessage
            onFocus={event => {
                if (trackBehaviorAs) {
                    UserBehaviorService.onFocus(event.currentTarget, trackBehaviorAs)
                }
                onFocus?.(event)
            }}
            {...inputProps}
            tabIndex={-1}
        >
            {(showCleanValueButton || showCalendarIcon) && (
                <InputAddonText>
                    {showCleanValueButton && (
                        <IconButton
                            path={mdiClose}
                            size={24}
                            className={clsx(
                                'clean-value-icon',
                                showCalendarIcon ? 'me-2' : null
                            )}
                            disabled={props.disabled}
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (!props.disabled) {
                                    handleChange(null)
                                }
                            }}
                        />
                    )}
                    {showCalendarIcon && (
                        <Icon
                            path={mdiCalendarMonthOutline}
                            size={24}
                            className="text-muted calendar-icon"
                        />
                    )}
                </InputAddonText>
            )}
        </Input>
    )

    if (
        !withoutValidationMessage
        && (props.invalid !== undefined || !!validationMessage)
    ) {
        dropdownToggle = (
            <InputValidationError
                invalid={!!props.invalid}
                error={validationMessage}
                errorClassName={validationMessageClassName}
            >
                {dropdownToggle}
            </InputValidationError>
        )
    }

    return (
        <Dropdown
            {...dropdownProps}
            className={clsx(
                'form-dropdown-date-picker form-outline',
                inputProps.small && !inputProps.large ? 'form-dropdown-date-picker-sm' : null,
                inputProps.large && !inputProps.small ? 'form-dropdown-date-picker-lg' : null,
                wrapperClass
            )} //< form-outline here needed to apply .input-group styles
            dropup={dropup}
            disabled={props.disabled}
            onOpen={close => {
                dropdownControlsRef.current = {close}
            }}
        >
            {dropdownToggle}
            <DropdownMenu
                className={clsx(
                    'shadow-2-strong',
                    dropup && props.label ? 'form-dropdown-date-picker-menu-dropup-offset' : null,
                    dropdownMenuClassName
                )}
            >
                <Suspense>
                    <Calendar
                        onChange={handleChange}
                        value={value}
                        {...calendarProps}
                    />
                </Suspense>
            </DropdownMenu>
        </Dropdown>
    )
}

// Конвертация значения в строку для отображения в поле ввода.
function convertDateInputValueToString(
    value: DateInputValue,
    dateFormat: DateInputProps['dateFormat'],
    valueToString?: DateInputProps['valueToString']
): string {
    let from: DateInputSingleDateValue
    let to: DateInputSingleDateValue = null
    if (Array.isArray(value)) {
        from = value[0]
        to = value[1]
    } else {
        from = value
    }
    if (valueToString) {
        return valueToString(from, to)
    }
    if (!from && !to) {
        return ''
    }
    if (!to) {
        return DateTimeService.parse(from).format(dateFormat)
    }
    return DateTimeService.parse(from).format(dateFormat)
        + ' - ' + DateTimeService.parse(to).format(dateFormat)
}

export default withStable<DateInputProps>(
    ['onChange', 'onFocus', 'onBlur', 'valueToString'],
    DateInput
)