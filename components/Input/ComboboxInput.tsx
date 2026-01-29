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
import {filterOptions} from '../../helpers/options_list/filterOptions'
import {useEventCallback} from '../../helpers/useEventCallback'
import {
    type AnyObject,
    FormSelectOption,
    FormSelectOptionsList,
} from '../../types'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenuContent} from '../Dropdown/DropdownMenuContent'
import {DropdownMenuScrollableContainer} from '../Dropdown/DropdownMenuScrollableContainer'
import {HtmlContent} from '../Typography/HtmlContent'
import {useSelectInputDropdown} from './helpers/useSelectInputDropdown'
import {Input} from './Input'
import {ComboboxInputProps} from './InputTypes'

// Поле ввода строки с автодополнением по набору опций.
// Опции передаются извне. Автозагрузка опций из API не поддерживается.
export function ComboboxInput<
    OptionValueType = string,
    OptionExtras extends AnyObject = AnyObject,
>(props: ComboboxInputProps<OptionValueType, OptionExtras>) {

    const {
        options = [],
        optionsFiltering = true,
        focusFirstItemOnOpen = true,
        optionLabelIsHtml = false,
        inputRef,
        value,
        title,
        label,
        active,
        onFocus,
        onClick,
        onChange,
        onKeyDown,
        maxDropdownHeight = 500,
        dropUpOffset = label && label.length > 0 ? 8 : 0,
        ...inputProps
    } = props

    // Отфильтрованные опции.
    const [
        filteredOptions,
        setFilteredOptions,
    ] = useState<FormSelectOptionsList<OptionValueType, OptionExtras> | string[]>(
        options
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
        focusFirstItemOnOpen,
        onSearch: useEventCallback((
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            onChange?.(
                event.currentTarget.value,
                undefined,
                event as FormEvent<HTMLInputElement>
            )
        }),
        dropUpOffset,
    })

    // Обновление списка опций.
    useEffect(() => {
        setActiveIndex(focusFirstItemOnOpen ? 0 : null)
        setFilteredOptions(
            optionsFiltering
                ? filterOptions(
                    value ?? '',
                    options as FormSelectOptionsList<OptionValueType, OptionExtras>,
                    false,
                    true
                )
                : options
        )
    }, [options, value])

    // Нажатие опцию.
    const onItemClick = (
        option: FormSelectOption<OptionValueType, OptionExtras> | string,
        event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => {
        onChange?.(
            typeof option === 'string' ? option : String(option.value ?? ''),
            typeof option === 'string' ? undefined : option,
            event
        )
        setIsOpen(false)
    }

    // Ввод символа в поле ввода.
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
        onKeyDown?.(
            event,
            activeIndex,
            activeIndex ? filteredOptions[activeIndex] : null
        )
    })

    // Фокусировка на поле ввода.
    const onSearchFocus = useEventCallback((
        event: FocusEvent<HTMLInputElement>
    ) => {
        if (hasOptions && !isOpen && event.relatedTarget !== null) {
            setIsOpen(true)
        }
        onFocus?.(event)
    })

    // Нажатие на поле ввода.
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
                {...getReferenceProps({
                    ...inputProps,
                    value,
                    onChange: onSearch,
                    onFocus: onSearchFocus,
                    onClick: onSearchClick,
                    onKeyDown: onSearchKeyDown,
                })}
                inputRef={setInputRef}
                label={label}
                title={title}
                active={active || (value ?? '').length > 0}
            />
            <FloatingList elementsRef={listItemsRef}>
                {isOpen && hasOptions && (
                    <DropdownMenuContent
                        ref={setMenuRef}
                        {...getFloatingProps()}
                        style={floatingStyles}
                        maxHeight={maxDropdownHeight}
                    >
                        <DropdownMenuScrollableContainer>
                            {filteredOptions.map((option, index) => (
                                <DropdownItem
                                    key={typeof option === 'string' ? option : String(option.value)}
                                    {...getItemProps({
                                        onClick(event) {
                                            onItemClick(option, event)
                                        },
                                    })}
                                    hover={isActiveListItem(index)}
                                >
                                    {optionLabelIsHtml ? (
                                        <HtmlContent
                                            html={typeof option === 'string' ? option : option.label}
                                        />
                                    ) : (
                                        <>{typeof option === 'string' ? option : option.label}</>
                                    )}
                                </DropdownItem>
                            ))}
                        </DropdownMenuScrollableContainer>
                    </DropdownMenuContent>
                )}
            </FloatingList>
        </>
    )
}
