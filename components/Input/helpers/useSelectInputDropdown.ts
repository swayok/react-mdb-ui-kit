import {
    useClick,
    useDismiss,
    useInteractions,
    UseInteractionsReturn,
    useListNavigation,
    useRole,
} from '@floating-ui/react'
import {
    ChangeEvent,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {SelectInputBasicProps} from '../SelectInput/SelectInputTypes'
import {
    useInputFloatingMenu,
    UseInputFloatingMenuHookOptions,
    UseInputFloatingMenuHookReturn,
} from './useInputFloatingMenu'

interface UseSelectInputDropdownHookOptions extends UseInputFloatingMenuHookOptions,
    Pick<SelectInputBasicProps, 'closeOnScrollOutside' | 'focusFirstItemOnOpen'> {
    onSearch?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

interface UseSelectInputDropdownHookReturn extends UseInputFloatingMenuHookReturn, UseInteractionsReturn {
    onSearch: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    listItemsRef: RefObject<(HTMLElement | null)[]>
    activeIndex: number | null
    setActiveIndex: Dispatch<SetStateAction<number | null>>
    isActiveListItem: (index: number) => boolean
}

// Настройка floating-ui для выпадающих меню в полях выбора значения:
// Select, MultiSelect, Combobox.
export function useSelectInputDropdown(
    options: UseSelectInputDropdownHookOptions
): UseSelectInputDropdownHookReturn {

    const {
        dropdownWidth = 'fit-input',
        focusFirstItemOnOpen = 'auto',
        closeOnScrollOutside = false,
        onSearch: optionsOnSearch,
        ...floatingOptions
    } = options

    const [
        activeIndex,
        setActiveIndex,
    ] = useState<number | null>(null)

    const listRef = useRef<(HTMLElement | null)[]>([])

    const floatingConfig = useInputFloatingMenu({
        ...floatingOptions,
        dropdownWidth,
    })

    const click = useClick(floatingConfig.context, {
        event: 'click',
        toggle: false,
        ignoreMouse: false,
        keyboardHandlers: true,
    })
    const role = useRole(floatingConfig.context, {
        role: 'listbox',
    })
    const dismiss = useDismiss(floatingConfig.context, {
        ancestorScroll: closeOnScrollOutside,
    })
    const listNav = useListNavigation(floatingConfig.context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
        focusItemOnOpen: focusFirstItemOnOpen,
    })

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps,
    } = useInteractions(
        [
            click,
            role,
            dismiss,
            listNav,
        ]
    )

    const onSearch = useEventCallback((
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        optionsOnSearch?.(event)
        floatingConfig.setIsOpen(true, event.nativeEvent, 'reference-press')
    })

    const isActiveListItem = useCallback(
        (index: number) => activeIndex === index,
        [activeIndex]
    )

    return {
        ...floatingConfig,
        listItemsRef: listRef,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        onSearch,
        activeIndex,
        setActiveIndex,
        isActiveListItem,
    }
}
