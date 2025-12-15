import {mdiChevronDown} from '@mdi/js'
import clsx from 'clsx'
import {CSSProperties} from 'react'
import {Dropdown} from '../../Dropdown/Dropdown'
import {DropdownMenu} from '../../Dropdown/DropdownMenu'
import {DropdownToggle} from '../../Dropdown/DropdownToggle'
import {
    DropdownMenuProps,
    DropdownProps,
} from '../../Dropdown/DropdownTypes'
import {Icon} from '../../Icon'
import {Input} from '../Input'
import {InputValidationError} from '../InputValidationError'
import {SelectInputBasicProps} from './SelectInputTypes'

// Выбор одного из вариантов.
// Список опций задается через props.children.
// Опции - список элементов <DropdownItem><DropdownLink>...</DropdownLink></DropdownItem>.
// Более удобный компонент: FormSelect.
export function SelectInputBase(props: SelectInputBasicProps) {

    const {
        className,
        wrapperClassName = 'mb-4',
        wrapperStyle,
        children,
        mode = 'input',
        invalid,
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        addon,
        hidden,
        // Dropdown.
        closeDropdownOnSelect = true,
        focusFirstItemOnOpen = 'auto',
        closeOnScrollOutside = false,
        onOpenChange,
        // DropdownToggle.
        dropdownToggleClassName,
        // DropdownMenu.
        maxHeight = 500,
        minWidth = '100%',
        offset,
        drop = 'down',
        align,
        shadow,
        isRTL,
        flip = true,
        shift = true,
        dropdownMenuClassName,
        dropdownFluidWidth = true,
        textNowrapOnOptions: textNowrapOnItems = false,
        ...inputProps
    } = props

    if (hidden) {
        return null
    }

    const dropdownMenuStyle: CSSProperties = {}

    const dropdownProps: DropdownProps = {
        // open: isOpen,
        closeOnScrollOutside,
        autoClose: closeDropdownOnSelect ? true : 'outside',
        focusFirstItemOnOpen,
        disabled: inputProps.disabled,
        onOpenChange,
        // onOpenChange(nextOpen: boolean, event, reason) {
        //     setIsOpen(nextOpen)
        //     onOpenChange?.(nextOpen, event, reason)
        // },
    }

    if (maxHeight) {
        dropdownMenuStyle.maxHeight = maxHeight
    }
    if (minWidth) {
        dropdownMenuStyle.minWidth = minWidth
    }

    const isDropUp: boolean = ['up', 'up-centered'].includes(drop)

    const dropdownMenuProps: DropdownMenuProps = {
        className: clsx(
            'shadow-2-strong',
            isDropUp && inputProps.label ? 'form-dropdown-select-menu-dropup-offset' : null,
            dropdownFluidWidth ? 'full-width' : null,
            dropdownMenuClassName
        ),
        style: dropdownMenuStyle,
        offset,
        drop,
        align,
        shadow,
        isRTL,
        flip,
        shift,
        fillContainer: dropdownFluidWidth,
        textNowrapOnItems,
        inline: true,
    }

    const chevron = (
        <Icon
            path={mdiChevronDown}
            size={24}
            className="chevron"
            rotate={isDropUp ? 180 : 0}
        />
    )

    let dropdownToggle
    switch (mode) {
        case 'inline':
            dropdownToggle = (
                <DropdownToggle
                    tag="div"
                    className={clsx('cursor with-icon-flex', className)}
                >
                    <div>{inputProps.value}</div>
                    {chevron}
                </DropdownToggle>
            )
            break
        case 'input':
        default:
            dropdownToggle = (
                <Input
                    type="text"
                    className={clsx(
                        dropdownToggleClassName,
                        className,
                        inputProps.disabled ? null : 'cursor'
                    )}
                    wrapperClassName="m-0"
                    active={inputProps.value !== null && inputProps.value !== ''}
                    readOnly
                    withoutValidationMessage
                    invalid={invalid}
                    onFocus={e => {
                        e.currentTarget?.setSelectionRange(0, 0)
                    }}
                    {...inputProps}
                >
                    {chevron}
                </Input>
            )
            break
    }

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
                'form-dropdown-select form-outline',
                'mode-' + mode,
                inputProps.small && !inputProps.large ? 'form-dropdown-select-sm' : null,
                inputProps.large && !inputProps.small ? 'form-dropdown-select-lg' : null,
                wrapperClassName
            )} // < form-outline here needed to apply .input-group styles
            style={wrapperStyle}
        >
            <Dropdown {...dropdownProps}>
                {dropdownToggle}
                <DropdownMenu {...dropdownMenuProps}>
                    {children}
                </DropdownMenu>
                {addon}
            </Dropdown>
        </div>
    )
}
