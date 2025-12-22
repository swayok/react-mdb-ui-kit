import {FloatingList} from '@floating-ui/react'
import {
    ChangeEvent,
    FocusEvent,
    FormEvent,
    KeyboardEvent,
    MouseEvent,
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
import {DropdownMenuScrollableContainer} from '../Dropdown/DropdownMenuScrollableContainer'
import {useSelectInputDropdown} from './helpers/useSelectInputDropdown'
import {Input} from './Input'
import {ComboboxInputProps} from './InputTypes'

// Поле ввода строки с автодополнением по набору опций.
// Опции передаются извне. Автозагрузка опций из API не поддерживается.
export function ComboboxInput(props: ComboboxInputProps) {

    const {
        options = [],
        inputRef,
        value,
        title,
        active,
        onFocus,
        onClick,
        onChange,
        onKeyDown,
        maxHeight = 500,
        dropUpOffset = props.label && props.label.length > 0 ? 8 : 0,
        ...inputProps
    } = props

    // Отфильтрованные опции.
    const [
        filteredOptions,
        setFilteredOptions,
    ] = useState<FormSelectOptionsList<string> | string[]>(
        options as FormSelectOptionsList<string>
    )

    const {
        isOpen,
        onSearch,
        getReferenceProps,
        setInputRef,
        setMenuRef,
        floatingStyles,
        getFloatingProps,
        setIsOpen,
        getItemProps,
        listItemsRef,
        isActiveListItem,
        activeIndex,
        setActiveIndex,
    } = useSelectInputDropdown({
        inputRef,
        focusFirstItemOnOpen: true,
        onSearch: useEventCallback((
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            onChange?.(
                event.currentTarget.value,
                event as FormEvent<HTMLInputElement>
            )
        }),
        dropUpOffset,
    })

    // Обновление списка опций.
    useEffect(() => {
        setActiveIndex(0)
        setFilteredOptions(
            filterOptions(
                value ?? '',
                options as FormSelectOptionsList<string>,
                false,
                true
            )
        )
    }, [options, value])

    const onItemClick = (
        option: FormSelectOption | string,
        event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => {
        onChange?.(
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
            && (event.key === 'Enter' || event.key === 'Tab')
            && !event.shiftKey
            && !event.altKey
            && !event.ctrlKey
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
                title={title}
                active={active || (value ?? '').length > 0}
            />
            <FloatingList elementsRef={listItemsRef}>
                {isOpen && hasOptions && (
                    <DropdownMenuContent
                        ref={setMenuRef}
                        {...getFloatingProps()}
                        style={floatingStyles}
                        maxHeight={maxHeight}
                    >
                        <DropdownMenuScrollableContainer>
                            {filteredOptions.map((option, index) => (
                                <DropdownItem
                                    key={typeof option === 'string' ? option : option.value}
                                    {...getItemProps({
                                        onClick(event) {
                                            onItemClick(option, event)
                                        },
                                    })}
                                    hover={isActiveListItem(index)}
                                >
                                    {typeof option === 'string' ? option : option.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenuScrollableContainer>
                    </DropdownMenuContent>
                )}
            </FloatingList>
        </>
    )
}
