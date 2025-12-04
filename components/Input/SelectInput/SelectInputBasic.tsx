import {mdiChevronDown} from '@mdi/js'
import clsx from 'clsx'
import {CSSProperties} from 'react'
import {Dropdown} from '../../Dropdown/Dropdown'
import {DropdownMenu} from '../../Dropdown/DropdownMenu'
import {DropdownToggle} from '../../Dropdown/DropdownToggle'
import {Icon} from '../../Icon'
import {Input} from '../Input'
import {InputValidationError} from '../InputValidationError'
import {SelectInputBasicProps} from './SelectInputTypes'

// Выбор одного из вариантов.
// Список опций задается через props.children.
// Опции - список элементов <DropdownItem><DropdownLink>...</DropdownLink></DropdownItem>.
// Более удобный компонент: FormSelect.
export function SelectInputBasic(props: SelectInputBasicProps) {

    const {
        className,
        dropdownToggleClassName,
        dropdownMenuClassName,
        textNowrapOnOptions = false,
        wrapperClass = 'mb-4',
        wrapperStyle,
        dropdownProps,
        children,
        drop = 'down',
        maxHeight = 500,
        minWidth = '100%',
        dropdownFluidWidth = true,
        mode = 'input',
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        addon,
        closeDropdownOnSelect = true,
        hidden,
        ...inputProps
    } = props

    if (hidden) {
        return null
    }

    const dropdownMenuStyle: CSSProperties = {}

    if (maxHeight) {
        dropdownMenuStyle.maxHeight = maxHeight
    }
    if (minWidth) {
        dropdownMenuStyle.minWidth = minWidth
    }

    const isDropUp: boolean = ['up', 'up-centered'].includes(drop)
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
                        props.disabled ? null : 'cursor'
                    )}
                    wrapperClass="m-0"
                    wrapperTag={DropdownToggle}
                    wrapperProps={{
                        tag: 'div',
                    }}
                    active={inputProps.value !== null && inputProps.value !== ''}
                    readOnly
                    withoutValidationMessage
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
                'form-dropdown-select form-outline',
                'mode-' + mode,
                inputProps.small && !inputProps.large ? 'form-dropdown-select-sm' : null,
                inputProps.large && !inputProps.small ? 'form-dropdown-select-lg' : null,
                wrapperClass
            )} // < form-outline here needed to apply .input-group styles
            style={wrapperStyle}
            drop={drop}
            disabled={props.disabled}
            autoClose={closeDropdownOnSelect ? true : 'outside'}
            focusFirstItemOnShow={true}
        >
            {dropdownToggle}
            <DropdownMenu
                className={clsx(
                    'shadow-2-strong',
                    isDropUp && props.label ? 'form-dropdown-select-menu-dropup-offset' : null,
                    dropdownFluidWidth ? 'full-width' : null,
                    dropdownMenuClassName
                )}
                style={dropdownMenuStyle}
                textNowrapOnItems={textNowrapOnOptions}
            >
                {children}
            </DropdownMenu>
            {addon}
        </Dropdown>
    )
}
