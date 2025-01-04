import React, {CSSProperties} from 'react'
import Icon from '../../Icon'
import clsx from 'clsx'
import Dropdown, {DropdownProps} from '../../Dropdown/Dropdown'
import DropdownToggle, {DropdownToggleProps} from '../../Dropdown/DropdownToggle'
import DropdownMenu from '../../Dropdown/DropdownMenu'
import Input, {InputProps} from '../Input'
import InputValidationError from '../InputValidationError'
import {mdiChevronDown} from '@mdi/js'
import withStable from '../../../helpers/withStable'

export interface SelectInputBasicProps extends Omit<InputProps, 'wrapperProps' | 'wrapperTag'> {
    children: React.ReactNode | React.ReactNode[];
    // Режим отображения.
    // Если inline: внешний вид: {текст} {chevron}, без оформления в виде поля ввода, подходит для вставки в текст или в панель навигации.
    // Если input: внешний вид соответствует полю ввода c {chevron} в конце блока.
    mode?: 'inline' | 'input';
    // Настройки выпадающего меню.
    dropdownMenuClassName?: string;
    dropdownToggleClassName?: string;
    dropdownProps?: Omit<DropdownProps, 'dropup' | 'className' | 'disabled'>;
    dropup?: boolean;
    // Максимальная высота выпадающего меню.
    maxHeight?: number | null;
    // Минимальная ширина выпадающего меню.
    minWidth?: null | number | string;
    // Если true: адаптировать ширину выпадающего меню под ширину поля ввода.
    // Если false: ширина выпадающего меню зависит от ширины опций.
    dropdownFluidWidth?: boolean;
    // Дополнительные элементы, которые нужно вставить после поля ввода.
    addon?: React.ReactNode | React.ReactNode[];
}

// Выбор одного из вариантов.
// Список опций задается через props.children.
// Опции - список элементов <DropdownItem><DropdownLink>...</DropdownLink></DropdownItem>.
// Более удобный компонент: FormSelect.
function SelectInputBasic(props: SelectInputBasicProps) {

    const {
        className,
        dropdownToggleClassName,
        dropdownMenuClassName,
        wrapperClass = 'mb-4',
        wrapperStyle,
        dropdownProps,
        children,
        dropup,
        maxHeight = 500,
        minWidth = '100%',
        dropdownFluidWidth = true,
        mode = 'input',
        validationMessage,
        validationMessageClassName,
        withoutValidationMessage,
        addon,
        ...inputProps
    } = props

    const dropdownMenuStyle: CSSProperties = {}

    if (maxHeight) {
        dropdownMenuStyle.maxHeight = maxHeight
    }
    if (minWidth) {
        dropdownMenuStyle.minWidth = minWidth
    }

    const isDropUp: boolean = dropup || ['top', 'top-start', 'top-end'].includes(props.dropdownProps?.placement || '')
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
                    tag={'div'}
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
                    wrapperProps={{tag: 'div'} as DropdownToggleProps}
                    active={inputProps.value !== null && inputProps.value !== ''}
                    readOnly
                    withoutValidationMessage
                    onFocus={e => {
                        e.currentTarget.selectionStart = 0
                        e.currentTarget.selectionEnd = 0
                    }}
                    onKeyDown={e => {
                        if (e.key !== 'Tab') {
                            e.currentTarget.click()
                        }
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
            )} //< form-outline here needed to apply .input-group styles
            style={wrapperStyle}
            dropup={!!dropup}
            disabled={props.disabled}
            closeOnClickOutside={true}
        >
            {dropdownToggle}
            <DropdownMenu
                className={clsx(
                    'shadow-2-strong',
                    dropup && props.label ? 'form-dropdown-select-menu-dropup-offset' : null,
                    dropdownFluidWidth ? 'full-width' : null,
                    dropdownMenuClassName
                )}
                style={dropdownMenuStyle}
            >
                {children}
            </DropdownMenu>
            {addon}
        </Dropdown>
    )
}

export default withStable<SelectInputBasicProps>(
    ['onChange'],
    SelectInputBasic
)