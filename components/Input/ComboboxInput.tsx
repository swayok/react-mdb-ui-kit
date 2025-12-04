import {
    KeyboardEvent,
    FormEvent,
    useEffect,
    useState,
} from 'react'
import {ComboboxInputProps} from './InputTypes'
import {FormSelectOptionsList} from '../../types'
import {filterOptions} from '../../helpers/filterOptions'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {Input} from './Input'

// Поле ввода строки с автодополнением по набору опций.
// Опции передаются извне. Автозагрузка опций из API не поддерживается.
export function ComboboxInput(props: ComboboxInputProps) {

    const {
        options = [],
        active,
        onBlur,
        onFocus,
        onKeyDown,
        onChange,
        ...inputProps
    } = props

    // Отфильтрованные опции.
    const [
        filteredOptions,
        setFilteredOptions,
    ] = useState<FormSelectOptionsList<string>>(
        options as FormSelectOptionsList<string>
    )
    // Нужно ли показывать результаты быстрого поиска?
    const [
        showDropdown,
        setShowDropdown,
    ] = useState<boolean>(false)
    // Выбранный элемент в выпадающем меню быстрого поиска.
    const [
        dropdownSelectedItem,
        setDropdownSelectedItem,
    ] = useState<number | null>(null)

    // Обновление списка опций.
    useEffect(() => {
        setFilteredOptions(
            filterOptions(
                props.value ?? '',
                options as FormSelectOptionsList<string>
            )
        )
    }, [options, props.value])

    // Обработка нажатия клавиши на клавиатуре.
    const onSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (filteredOptions.length === 0) {
            return
        }
        if (event.key === 'Enter') {
            if (dropdownSelectedItem !== null && filteredOptions[dropdownSelectedItem]) {
                event.preventDefault()
                const value: string | number | null = filteredOptions[dropdownSelectedItem].value
                props.onChange?.(value ? String(value) : '', event)
                setFilteredOptions(options as FormSelectOptionsList<string>)
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
                    // Предотвращаем изменение позиции курсора в меню, если меню было закрыто.
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
            active={active ?? (props.value ?? '').length > 0}
            onChange={event => onChange(
                event.currentTarget.value,
                event as FormEvent<HTMLInputElement>
            )}
            onBlur={event => {
                // Тайм-аут требуется, чтобы успел отработать клик на кнопку в выпадающем меню.
                setTimeout(() => setShowDropdown(false), 150)
                onBlur?.(event)
            }}
            onFocus={event => {
                if (hasOptions) {
                    setShowDropdown(true)
                }
                onFocus?.(event)
            }}
            onKeyDown={onSearchInputKeyDown}
        >
            {hasOptions && (
                <Dropdown
                    show={showDropdown}
                    autoClose={false}
                    focusFirstItemOnShow={false}
                >
                    <DropdownMenu
                        fillContainer
                        className="shadow-2-strong"
                    >
                        {filteredOptions.map((option, index) => (
                            <DropdownItem
                                key={option.value}
                                active={index === dropdownSelectedItem}
                                onClick={event => props.onChange(
                                    option.value ? String(option.value) : '',
                                    event
                                )}
                            >
                                {option.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            )}
        </Input>
    )
}

/** @deprecated */
export default ComboboxInput
