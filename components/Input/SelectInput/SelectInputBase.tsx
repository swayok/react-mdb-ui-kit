import {FloatingFocusManager} from '@floating-ui/react'
import {mdiChevronDown} from '@mdi/js'
import clsx from 'clsx'
import {
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    useImperativeHandle,
    useRef,
} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {Button} from '../../Button'
import {DropdownMenuContent} from '../../Dropdown/DropdownMenuContent'
import {Icon} from '../../Icon'
import {useSelectInputDropdown} from '../helpers/useSelectInputDropdown'
import {Input} from '../Input'
import {InputWrapper} from '../InputWrapper'
import {
    SelectInputBasicApi,
    SelectInputBasicProps,
} from './SelectInputTypes'

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
        hidden,
        title,
        onOptionSelect,
        apiRef,
        onClick,
        onKeyDown,
        onFocus,
        // Dropdown.
        open,
        onOpenChange,
        focusFirstItemOnOpen = 'auto',
        closeOnScrollOutside = false,
        maxHeight = 500,
        minWidth = '100%',
        dropdownShadow = '2-strong',
        offset,
        drop,
        align,
        shadow,
        isRTL,
        flip,
        shift,
        dropdownMenuClassName,
        dropdownWidth = 'fit-input',
        textNowrapOnOptions = false,
        inputRef,
        WrapperComponent = InputWrapper,
        ...inputProps
    } = props

    const {
        isOpen,
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
        isDropUp,
    } = useSelectInputDropdown({
        inputRef,
        dropdownWidth,
        flip,
        align,
        offset,
        isRTL,
        shift,
        drop,
        focusFirstItemOnOpen,
        closeOnScrollOutside,
    })

    // Заблокировать выполнение setIsOpen(!isOpen) в onTogglerClick() один раз.
    // Исправляет ошибку при одновременном срабатывании focus и click событий.
    const disableOnClickOpenToggleRef = useRef<boolean>(false)

    const onInputKeyDown = useEventCallback((
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            isOpen
            && activeIndex !== null
            && event.key === 'Enter'
            && onOptionSelect
        ) {
            onOptionSelect(activeIndex, event)
            event.preventDefault()
        }
        onKeyDown?.(event)
    })

    const onTogglerFocus = useEventCallback((
        event: FocusEvent<HTMLInputElement>
    ) => {
        if (mode === 'input') {
            event.currentTarget?.setSelectionRange(0, 0)
        }
        if (!isOpen && event.relatedTarget !== null) {
            setIsOpen(true)
            disableOnClickOpenToggleRef.current = true
        }
        onFocus?.(event)
    })

    const onTogglerClick = useEventCallback((
        event: MouseEvent<HTMLInputElement>
    ) => {
        if (!disableOnClickOpenToggleRef.current) {
            setIsOpen(!isOpen)
        }
        disableOnClickOpenToggleRef.current = false
        onClick?.(event)
    })

    // API.
    useImperativeHandle(apiRef, (): SelectInputBasicApi => ({
        setIsOpen,
        rememberOptionElement: rememberListItem,
        isActiveOption: isActiveListItem,
        getOptionProps: getItemProps,
    }))

    if (hidden) {
        return null
    }

    const chevron = (
        <Icon
            path={mdiChevronDown}
            size={24}
            className="chevron"
            rotate={isDropUp ? 180 : 0}
        />
    )

    const wrapperClasses = clsx(
        // form-outline тут нужен для правильного применения .input-group стилей
        'form-dropdown-select form-outline',
        'mode-' + mode,
        wrapperClassName
    )

    const togglerClasses = clsx(
        className,
        inputProps.disabled ? null : 'cursor'
    )

    let dropdownToggle
    switch (mode) {
        case 'inline':
            dropdownToggle = (
                <WrapperComponent
                    invalid={inputProps.invalid}
                    validationMessage={inputProps.validationMessage}
                    withoutValidationMessage={inputProps.withoutValidationMessage}
                    validationMessageClassName={inputProps.validationMessageClassName}
                    contrast={inputProps.contrast}
                    grouped={inputProps.grouped}
                    title={title}
                    tooltipPlacement={inputProps.tooltipPlacement}
                    tooltipOffset={inputProps.tooltipOffset}
                    tooltipMaxWidth={inputProps.tooltipMaxWidth}
                    tooltipTextClassName={inputProps.tooltipTextClassName}
                    tooltipDisableClickHandler={inputProps.tooltipDisableClickHandler}
                    tooltipDisableHover={inputProps.tooltipDisableHover}
                >
                    <Button
                        {...getReferenceProps({
                            // Чтобы не ругалось на типизацию.
                            ref: setInputRef,
                            onClick: onTogglerClick,
                            onFocus: onTogglerFocus,
                        })}
                        color="link"
                        hasIcon="after"
                        className={togglerClasses}
                        small={inputProps.small}
                        large={inputProps.large}
                    >
                        <div>{inputProps.value}</div>
                        {chevron}
                    </Button>
                </WrapperComponent>
            )
            break
        case 'input':
        default:
            dropdownToggle = (
                <Input
                    {...getReferenceProps({
                        ...inputProps,
                        onClick: onTogglerClick,
                        onFocus: onTogglerFocus,
                        onKeyDown: onInputKeyDown,
                    })}
                    inputRef={setInputRef}
                    type="text"
                    className={togglerClasses}
                    wrapperClassName="m-0 dropdown-toggle"
                    readOnly
                    active={inputProps.value !== null && inputProps.value !== ''}
                    title={title}
                >
                    {chevron}
                </Input>
            )
            break
    }

    return (
        <div className={wrapperClasses}>
            {dropdownToggle}
            {isOpen && (
                <FloatingFocusManager
                    context={context}
                    initialFocus={-1}
                    visuallyHiddenDismiss
                >
                    <DropdownMenuContent
                        ref={setMenuRef}
                        {...getFloatingProps({
                            className: clsx(
                                isDropUp && inputProps.label
                                    ? 'form-dropdown-select-menu-dropup-offset'
                                    : null,
                                dropdownMenuClassName
                            ),
                        })}
                        shadow={dropdownShadow}
                        style={floatingStyles}
                        maxHeight={maxHeight}
                        minWidth={minWidth}
                        textNowrapOnItems={textNowrapOnOptions}
                    >
                        {children}
                    </DropdownMenuContent>
                </FloatingFocusManager>
            )}
        </div>
    )

    // return (
    //     <div
    //         className={clsx(
    //             // form-outline here needed to apply .input-group styles
    //             'form-dropdown-select form-outline',
    //             'mode-' + mode,
    //             inputProps.small && !inputProps.large ? 'form-dropdown-select-sm' : null,
    //             inputProps.large && !inputProps.small ? 'form-dropdown-select-lg' : null,
    //             wrapperClassName
    //         )}
    //         style={wrapperStyle}
    //     >
    //         <Dropdown {...dropdownProps}>
    //             {dropdownToggle}
    //             <DropdownMenu {...dropdownMenuProps}>
    //                 {children}
    //             </DropdownMenu>
    //             {addon}
    //         </Dropdown>
    //     </div>
    // )
}
