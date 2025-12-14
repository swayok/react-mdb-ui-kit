import {
    FloatingFocusManager,
    FloatingPortal,
} from '@floating-ui/react'
import {
    ChangeEvent,
    FormEvent,
    MouseEvent,
    FocusEvent,
    KeyboardEvent,
    useEffect,
    useState,
} from 'react'
import {filterOptions} from '../../helpers/filterOptions'
import {useEventCallback} from '../../helpers/useEventCallback'
import {
    FormSelectOption,
    FormSelectOptionsList,
} from '../../types'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenuContent} from '../Dropdown/DropdownMenuContent'
import {Input} from './Input'
import {ComboboxInputProps} from './InputTypes'
import {useComboboxDropdown} from './SelectInput/useComboboxDropdown'

// Поле ввода строки с автодополнением по набору опций.
// Опции передаются извне. Автозагрузка опций из API не поддерживается.
export function ComboboxInput(props: ComboboxInputProps) {

    const {
        options = [],
        inputRef,
        value,
        active,
        onFocus,
        onClick,
        onChange,
        onKeyDown,
        ...inputProps
    } = props

    // Отфильтрованные опции.
    const [
        filteredOptions,
        setFilteredOptions,
    ] = useState<FormSelectOptionsList<string> | string[]>(
        options as FormSelectOptionsList<string>
    )

    // Обновление списка опций.
    useEffect(() => {
        setFilteredOptions(
            filterOptions(
                value ?? '',
                options as FormSelectOptionsList<string>,
                false,
                true
            )
        )
    }, [options, value])

    const {
        isOpen,
        onSearch,
        getReferenceProps,
        setInputRef,
        setMenuRef,
        context,
        floatingStyles,
        getFloatingProps,
        setIsOpen,
        getItemProps,
        rememberListItem,
        isActiveListItem,
        activeIndex,
    } = useComboboxDropdown({
        inputRef,
        onSearch: useEventCallback((
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(
            event.currentTarget.value,
            event as FormEvent<HTMLInputElement>
        )),
    })

    // Обработка нажатия клавиши на клавиатуре.
    // const onSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    //     if (filteredOptions.length === 0) {
    //         return
    //     }
    //     if (event.key === 'Enter') {
    //         if (dropdownSelectedItem !== null && filteredOptions[dropdownSelectedItem]) {
    //             event.preventDefault()
    //             const value: string | number | null = filteredOptions[dropdownSelectedItem].value
    //             onChange?.(value ? String(value) : '', event)
    //             setFilteredOptions(options as FormSelectOptionsList<string>)
    //             setShowDropdown(false)
    //         }
    //         return
    //     }
    //     // Если меню скрыто, то нужно его открыть при нажатии кнопки.
    //     if (!showDropdown) {
    //         // Некоторые нажатия нужно игнорировать.
    //         const ignoredKeysForMenuOpener: string[] = ['Control', 'Alt', 'Shift', 'Meta']
    //         if (!ignoredKeysForMenuOpener.includes(event.key)) {
    //             setShowDropdown(true)
    //             if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    //                 // Предотвращаем изменение позиции курсора в меню, если меню было закрыто.
    //                 event.preventDefault()
    //             }
    //             return
    //         }
    //     }
    //     if (event.key === 'ArrowUp') {
    //         event.preventDefault()
    //         setDropdownSelectedItem(
    //             dropdownSelectedItem !== null && dropdownSelectedItem > 0
    //                 ? dropdownSelectedItem - 1
    //                 : filteredOptions.length - 1
    //         )
    //         return
    //     }
    //     if (event.key === 'ArrowDown') {
    //         event.preventDefault()
    //         setDropdownSelectedItem(
    //             dropdownSelectedItem === null
    //                 ? 0
    //                 : (dropdownSelectedItem + 1) % filteredOptions.length
    //         )
    //         return
    //     }
    //     onKeyDown?.(event)
    // }

    const onItemClick = (
        option: FormSelectOption | string,
        event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => {
        onChange(
            typeof option === 'string' ? option : String(option.value ?? ''),
            event
        )
        setIsOpen(false)
    }

    const onSearchKeyDown = useEventCallback((
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            isOpen
            && activeIndex !== null
            && event.key === 'Enter'
            && filteredOptions.length > activeIndex
        ) {
            onItemClick(filteredOptions[activeIndex], event)
            event.preventDefault()
        }
        onKeyDown?.(event)
    })

    const onSearchFocus = useEventCallback((
        event: FocusEvent<HTMLInputElement>
    ) => {
        if (hasOptions && !isOpen && event.relatedTarget !== null) {
            setIsOpen(true)
        }
        onFocus?.(event)
    })

    const onSearchClick = useEventCallback((
        event: MouseEvent<HTMLInputElement>
    ) => {
        if (hasOptions && !isOpen) {
            setIsOpen(true)
        }
        onClick?.(event)
    })

    const hasOptions: boolean = filteredOptions.length > 0

    return (
        <>
            <Input
                inputRef={setInputRef}
                {...getReferenceProps({
                    ...inputProps,
                    value,
                    onChange: onSearch,
                    onFocus: onSearchFocus,
                    onClick: onSearchClick,
                    onKeyDown: onSearchKeyDown,
                })}
                active={active ?? (value ?? '').length > 0}
            />
            {isOpen && hasOptions && (
                <FloatingPortal>
                    <FloatingFocusManager
                        context={context}
                        initialFocus={-1}
                        visuallyHiddenDismiss
                    >
                        <DropdownMenuContent
                            isOpen={isOpen}
                            ref={setMenuRef}
                            {...getFloatingProps()}
                            style={floatingStyles}
                        >
                            {filteredOptions.map((option, index) => (
                                <DropdownItem
                                    key={typeof option === 'string' ? option : option.value}
                                    {...getItemProps({
                                        onClick(event) {
                                            onItemClick(option, event)
                                        },
                                        ref(item) {
                                            rememberListItem(item, index)
                                        },
                                    })}
                                    active={isActiveListItem(index)}
                                >
                                    {typeof option === 'string' ? option : option.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenuContent>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </>
    )
}

/** @deprecated */
export default ComboboxInput
