import {
    mdiCalendarMonthOutline,
    mdiClose,
} from '@mdi/js'
import clsx from 'clsx'
import {
    ComponentType,
    lazy,
    Suspense,
    useMemo,
    useRef,
} from 'react'
import {CalendarProps} from 'react-calendar'
import {useEventCallback} from '../../helpers/useEventCallback'
import {
    DropdownApi,
    DropdownDropDirection,
    DropdownMenuProps,
    DropdownProps,
} from '../Dropdown/DropdownTypes'
import {DateTimeService} from '../../services/DateTimeService'
import {UserBehaviorService} from '../../services/UserBehaviorService'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {Icon} from '../Icon'
import {IconButton} from '../IconButton'
import {Input} from './Input'
import {InputAddonText} from './InputAddonText'
import {
    DateInputProps,
    DateInputSingleDateValue,
    DateInputValue,
} from './InputTypes'
import {InputValidationError} from './InputValidationError'

const Calendar = lazy<ComponentType<CalendarProps>>(() => import('react-calendar'))

// Выбор даты или периода.
export function DateInput(props: DateInputProps) {

    const {
        value,
        valueToString,
        dateFormat = DateTimeService.defaultFormat,
        allowEmptyValue,
        className,
        wrapperClass = 'mb-4',
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
        invalid,
        // Dropdown
        closeDropdownOnSelect = false,
        closeOnScrollOutside,
        onOpenChange,
        // DropdownToggle
        dropdownToggleClassName,
        // DropdownMenu
        offset,
        drop,
        align,
        flip,
        shift,
        shadow,
        isRTL,
        dropdownMenuClassName,
        ...inputProps
    } = props

    // Управление выпадающим меню.
    const dropdownApiRef = useRef<DropdownApi | null>(null)

    const dropdownProps: DropdownProps = {
        closeOnScrollOutside,
        autoClose: closeDropdownOnSelect ? true : 'outside',
        onOpenChange,
        focusFirstItemOnOpen: false,
        disabled: inputProps.disabled,
    }

    const dropdownMenuProps: DropdownMenuProps = {
        className: clsx(
            'shadow-2-strong',
            drop && ([] as DropdownDropDirection[]).includes(drop) && inputProps.label
                ? 'form-date-input-dropdown-menu-dropup-offset'
                : null,
            dropdownMenuClassName
        ),
        offset,
        drop,
        align,
        shadow,
        isRTL,
        flip,
        shift,
    }

    // Обработка выбора новой даты или периода.
    const handleChange = useEventCallback((
        value: DateInputValue
    ): void => {
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
            dropdownApiRef.current?.setIsOpen(false)
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(convertDateInputValueToString(value, dateFormat, valueToString))
            }
        }
        onChange(from, to)
    })

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
                inputProps.disabled ? null : 'cursor'
            )}
            wrapperClass="m-0"
            wrapperTag={DropdownToggle}
            wrapperProps={wrapperProps}
            active={inputValue !== ''}
            readOnly
            invalid={invalid}
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
            {(!!showCleanValueButton || showCalendarIcon) && (
                <InputAddonText>
                    {showCleanValueButton && (
                        <IconButton
                            path={mdiClose}
                            size={24}
                            className={clsx(
                                'clean-value-icon',
                                showCalendarIcon ? 'me-2' : null
                            )}
                            disabled={inputProps.disabled}
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (!inputProps.disabled) {
                                    handleChange(null)
                                }
                            }}
                        />
                    )}
                    {showCalendarIcon && (
                        <Icon
                            path={mdiCalendarMonthOutline}
                            size={24}
                            color="muted"
                            className="calendar-icon"
                        />
                    )}
                </InputAddonText>
            )}
        </Input>
    )

    if (
        !withoutValidationMessage
        && (invalid !== undefined || !!validationMessage)
    ) {
        dropdownToggle = (
            <InputValidationError
                invalid={!!invalid}
                error={validationMessage}
                errorClassName={validationMessageClassName}
            >
                {dropdownToggle}
            </InputValidationError>
        )
    }

    return (
        <div
            className={clsx(
                'form-date-input form-outline',
                inputProps.small && !inputProps.large ? 'form-date-input-sm' : null,
                inputProps.large && !inputProps.small ? 'form-date-input-lg' : null,
                wrapperClass
            )} // < form-outline here needed to apply .input-group styles
        >
            <Dropdown {...dropdownProps}>
                {dropdownToggle}
                <DropdownMenu
                    ref={dropdownApiRef}
                    {...dropdownMenuProps}
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
        </div>
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

/** @deprecated */
export default DateInput
