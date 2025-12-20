import {
    mdiCalendarMonthOutline,
    mdiClose,
} from '@mdi/js'
import clsx from 'clsx'
import {
    ComponentType,
    FocusEvent,
    lazy,
    MouseEvent,
    Suspense,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react'
import {CalendarProps} from 'react-calendar'
import {useEventCallback} from '../../helpers/useEventCallback'
import {DateTimeService} from '../../services/DateTimeService'
import {UserBehaviorService} from '../../services/UserBehaviorService'
import {DropdownMenuContent} from '../Dropdown/DropdownMenuContent'
import {Icon} from '../Icon'
import {IconButton} from '../IconButton'
import {useInputDropdown} from './helpers/useInputDropdown'
import {Input} from './Input'
import {InputAddonText} from './InputAddonText'
import {
    DateInputProps,
    DateInputSingleDateValue,
    DateInputValue,
    InputWithDropdownApi,
} from './InputTypes'

const Calendar = lazy<ComponentType<CalendarProps>>(() => import('react-calendar'))

// Выбор даты или периода.
export function DateInput(props: DateInputProps) {

    const {
        value,
        valueToString,
        dateFormat = DateTimeService.defaultFormat,
        allowEmptyValue,
        className,
        wrapperClassName = 'mb-4',
        calendarProps = {
            selectRange: Array.isArray(value),
        },
        trackBehaviorAs,
        showCalendarIcon = true,
        title,
        hidden,
        apiRef,
        onChange: propsOnChange,
        onFocus,
        onClick,
        // Dropdown
        closeDropdownOnSelect = true,
        closeOnScrollOutside,
        onOpenChange,
        offset,
        drop,
        align,
        dropdownShadow = '2-strong',
        flip,
        shift,
        shadow,
        isRTL,
        dropUpOffset = props.label && props.label.length > 0 ? 8 : 0,
        dropdownMenuClassName,
        inputRef,
        ...inputProps
    } = props

    const {
        isOpen,
        getReferenceProps,
        setInputRef,
        setMenuRef,
        floatingStyles,
        getFloatingProps,
        setIsOpen,
        inputRef: inputRefObject,
    } = useInputDropdown({
        inputRef,
        dropdownWidth: 'fit-items',
        flip,
        align,
        offset,
        isRTL,
        shift,
        drop,
        closeOnScrollOutside,
        dropUpOffset,
    })

    // Заблокировать выполнение setIsOpen(!isOpen) в onTogglerClick() один раз.
    // Исправляет ошибку при одновременном срабатывании focus и click событий.
    const disableOnClickOpenToggleRef = useRef<boolean>(false)

    // Обработка выбора новой даты или периода.
    const onChange = useEventCallback((
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
            // Единичное значение.
            if (closeDropdownOnSelect) {
                setIsOpen(false)
            }
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(convertDateInputValueToString(value, dateFormat, valueToString))
            }
        } else if (from && to) {
            // Период дат и выбраны оба значения.
            if (closeDropdownOnSelect) {
                setIsOpen(false)
            }
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(convertDateInputValueToString(value, dateFormat, valueToString))
            }
        }
        propsOnChange?.(from, to)
    })

    // Конвертирование даты или периода в строку для отображения в поле ввода.
    const inputValue: string = useMemo(
        () => convertDateInputValueToString(value, dateFormat, valueToString),
        [value, dateFormat, valueToString]
    )

    const onTogglerFocus = useEventCallback((
        event: FocusEvent<HTMLInputElement>
    ) => {
        if (trackBehaviorAs) {
            UserBehaviorService.onFocus(event.currentTarget, trackBehaviorAs)
        }
        if (!isOpen) {
            setIsOpen(true, event.nativeEvent, 'focus')
            disableOnClickOpenToggleRef.current = true
        }
        onFocus?.(event)
    })

    const onTogglerClick = useEventCallback((
        event: MouseEvent<HTMLInputElement>
    ) => {
        if (!disableOnClickOpenToggleRef.current) {
            setIsOpen(!isOpen, event.nativeEvent, 'click')
        }
        disableOnClickOpenToggleRef.current = false
        onClick?.(event)
    })

    // API.
    useImperativeHandle(apiRef, (): InputWithDropdownApi => ({
        setIsOpen,
    }))

    if (hidden) {
        return null
    }

    let hasValue: boolean
    if (Array.isArray(value)) {
        hasValue = value[0] !== null || value[1] !== null
    } else {
        hasValue = value !== null
    }

    const showCleanValueButton = allowEmptyValue && hasValue

    return (
        <div
            className={clsx(
                'form-date-input form-outline',
                inputProps.small && !inputProps.large ? 'form-date-input-sm' : null,
                inputProps.large && !inputProps.small ? 'form-date-input-lg' : null,
                wrapperClassName
            )} // < form-outline here needed to apply .input-group styles
        >
            <Input
                {...getReferenceProps({
                    ...inputProps,
                    onClick: onTogglerClick,
                    onFocus: onTogglerFocus,
                })}
                inputRef={setInputRef}
                type="text"
                title={title}
                value={inputValue}
                className={clsx(
                    className,
                    inputProps.disabled ? null : 'cursor',
                    !valueToString || valueToString.length === 0 ? 'empty-value' : null,
                )}
                wrapperClassName="m-0 dropdown-toggle"
                active={inputValue !== ''}
                readOnly
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
                                        onChange(null)
                                    }
                                }}
                            />
                        )}
                        {showCalendarIcon && (
                            <IconButton
                                path={mdiCalendarMonthOutline}
                                size={24}
                                color="muted"
                                className="calendar-icon"
                                disabled={inputProps.disabled}
                                onClick={() => inputRefObject.current?.focus()}
                            />
                        )}
                    </InputAddonText>
                )}
            </Input>
            {isOpen && (
                <Suspense>
                    <DropdownMenuContent
                        ref={setMenuRef}
                        {...getFloatingProps({
                            className: dropdownMenuClassName,
                        })}
                        shadow={dropdownShadow}
                        style={floatingStyles}
                    >
                        <Calendar
                            onChange={onChange}
                            value={value}
                            {...calendarProps}
                        />
                    </DropdownMenuContent>
                </Suspense>
            )}
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
