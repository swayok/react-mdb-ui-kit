import React, {useEffect, useState} from 'react'
import Input, {InputProps} from './Input'
import {FormSelectOptionsList} from '../../types/Common'
import withStable from '../../helpers/withStable'
import Dropdown from '../Dropdown/Dropdown'
import DropdownMenu from '../Dropdown/DropdownMenu'
import DropdownItem from '../Dropdown/DropdownItem'
import DropdownButton from '../Dropdown/DropdownButton'
import filterOptions from '../../helpers/filterOptions'

interface Props extends Omit<InputProps, 'onChange'> {
    options?: FormSelectOptionsList<string | number | null>;
    onChange: (value: string, event: React.FormEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => void;
}

// Поле ввода строки с автодополнением по набору опций.
// Опции передаются извне. Автозагрузка опций из API не поддерживается.
function ComboboxInput(props: Props) {

    const {
        options,
        active,
        onBlur,
        onFocus,
        onKeyDown,
        onChange,
        ...inputProps
    } = props

    // Отфильтрованные опции.
    const [filteredOptions, setFilteredOptions] = useState<FormSelectOptionsList<string>>(
        (options || []) as FormSelectOptionsList<string>
    )
    // Нужно ли показывать результаты быстрого поиска?
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    // Выбранный элемент в выпадающем меню быстрого поиска.
    const [dropdownSelectedItem, setDropdownSelectedItem] = useState<number | null>(null)

    // Обновление списка опций.
    useEffect(() => {
        setFilteredOptions(
            filterOptions(
                props.value || '',
                (options || []) as FormSelectOptionsList<string>
            )
        )
    }, [options, props.value])

    // Обработка нажатия клавиши на клавиатуре.
    const onSearchInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (filteredOptions.length === 0) {
            return
        }
        if (event.key === 'Enter') {
            if (dropdownSelectedItem !== null && filteredOptions[dropdownSelectedItem]) {
                event.preventDefault()
                const value: string | number | null = filteredOptions[dropdownSelectedItem].value
                props.onChange?.(value ? String(value) : '', event)
                setFilteredOptions((options || []) as FormSelectOptionsList<string>)
                setShowDropdown(false)
            }
            return
        }
        // Если меню скрыто, то нужно его открыть при нажатии кнопки.
        if (!showDropdown) {
            // Некоторые нажатия нужно игнорировать.
            const ignoredKeysForMenuOpener: string[] = ['Control', 'Alt', 'Shift', 'Meta']
            if (!ignoredKeysForMenuOpener.includes(event.key)) {
                setShowDropdown(true)
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    // Предотвращаем изменение позиции курсора в меню если меню было закрыто.
                    event.preventDefault()
                }
                return
            }
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            setDropdownSelectedItem(
                dropdownSelectedItem !== null && dropdownSelectedItem > 0
                    ? dropdownSelectedItem - 1
                    : filteredOptions.length - 1
            )
            return
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setDropdownSelectedItem(
                dropdownSelectedItem === null
                    ? 0
                    : (dropdownSelectedItem + 1) % filteredOptions.length
            )
            return
        }
        onKeyDown?.(event)
    }

    const hasOptions: boolean = filteredOptions.length > 0

    return (
        <Input
            {...inputProps}
            active={active || (props.value || '').length > 0}
            onChange={event => onChange(
                event.currentTarget.value,
                event as React.FormEvent<HTMLInputElement>
            )}
            onBlur={event => {
                // Таймаут требуется чтобы успел отработать клик на кнопку в выпадающем меню.
                setTimeout(() => setShowDropdown(false), 150)
                onBlur?.(event)
            }}
            onFocus={event => {
                hasOptions && setShowDropdown(true)
                onFocus?.(event)
            }}
            onKeyDown={onSearchInputKeyDown}
        >
            {hasOptions && (
                <Dropdown
                    isOpen={showDropdown}
                    closeOnClickOutside={false}
                    animation={false}
                    selectFirstOnOpen={false}
                    positioningContainer="wrapper"
                >
                    <DropdownMenu
                        fillContainer
                        className="shadow-2"
                    >
                        {filteredOptions.map((option, index) => (
                            <DropdownItem
                                key={option.value}
                                active={index === dropdownSelectedItem}
                                highlightable={false}
                            >
                                <DropdownButton
                                    onClick={event => props.onChange(
                                        option.value ? String(option.value) : '',
                                        event
                                    )}
                                >
                                    {option.label}
                                </DropdownButton>
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            )}
        </Input>
    )
}

export default withStable(
    ['onChange'],
    ComboboxInput
)
