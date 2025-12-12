import {
    FloatingFocusManager,
    FloatingPortal,
} from '@floating-ui/react'
import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from 'react'
import {filterOptions} from '../../helpers/filterOptions'
import {useEventCallback} from '../../helpers/useEventCallback'
import {FormSelectOptionsList} from '../../types'
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
        // onBlur,
        // onFocus,
        // onKeyDown,
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
    // Выбранный элемент в выпадающем меню быстрого поиска.
    // const [
    //     dropdownSelectedItem,
    //     setDropdownSelectedItem,
    // ] = useState<number | null>(null)

    // Обновление списка опций.
    useEffect(() => {
        setFilteredOptions(
            filterOptions(
                value ?? '',
                options as FormSelectOptionsList<string>
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
        activeIndex,
        rememberListItem,
        isActiveListItem,
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

    const hasOptions: boolean = filteredOptions.length > 0

    console.log(inputProps.label, {activeIndex})

    return (
        <>
            <Input
                inputRef={setInputRef}
                {...getReferenceProps({
                    ...inputProps,
                    value,
                    onChange: onSearch,
                    onFocus() {
                        setIsOpen(true)
                    },
                })}
                active={active ?? (value ?? '').length > 0}
                // onChange={onSearch}
                // onBlur={onBlur}
                // onBlur={event => {
                //     // Тайм-аут требуется, чтобы успел отработать клик на кнопку в выпадающем меню.
                //     setTimeout(() => setShowDropdown(false), 150)
                //     onBlur?.(event)
                // }}
                // onFocus={event => {
                //     setShowDropdown(true)
                //     onFocus?.(event as FocusEvent<HTMLInputElement>)
                // }}
                // onKeyDown={onSearchInputKeyDown}
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
                                    key={option.value}
                                    {...getItemProps({
                                        onClick(event) {
                                            onChange(
                                                option.value ? String(option.value) : '',
                                                event
                                            )
                                            setIsOpen(false)
                                        },
                                        ref(item) {
                                            rememberListItem(item, index)
                                        },
                                    })}
                                    active={isActiveListItem(index)}
                                >
                                    {option.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenuContent>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
            {/* <DropdownMenu*/}
            {/*    fillContainer*/}
            {/*    className="shadow-2-strong"*/}
            {/*    inline*/}
            {/* >*/}
            {/*    {filteredOptions.map((option, index) => (*/}
            {/*        <DropdownItem*/}
            {/*            key={option.value}*/}
            {/*            active={index === dropdownSelectedItem}*/}
            {/*            onClick={event => onChange(*/}
            {/*                option.value ? String(option.value) : '',*/}
            {/*                event*/}
            {/*            )}*/}
            {/*        >*/}
            {/*            {option.label}*/}
            {/*        </DropdownItem>*/}
            {/*    ))}*/}
            {/* </DropdownMenu>*/}
        </>
    )
}

/** @deprecated */
export default ComboboxInput
