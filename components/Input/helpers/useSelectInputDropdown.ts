import {
    autoUpdate,
    flip,
    offset,
    OpenChangeReason,
    shift,
    size,
    useDismiss,
    useFloating,
    UseFloatingReturn,
    useInteractions,
    UseInteractionsReturn,
    useListNavigation,
    useRole,
} from '@floating-ui/react'
import {
    ChangeEvent,
    Dispatch,
    Ref,
    RefCallback,
    RefObject,
    type SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {useMergedRefs} from '../../../helpers/useMergedRefs'
import {getDropdownMenuPlacement} from '../../Dropdown/getDropdownMenuPlacement'
import {
    SelectInputBasicApi,
    SelectInputBasicProps,
} from '../SelectInput/SelectInputTypes'

interface UseComboboxDropdownHookOptions extends Pick<
    SelectInputBasicProps,
    'inputRef' | 'dropdownWidth' | 'flip' | 'align' | 'offset' | 'isRTL' | 'shift' | 'drop'
    | 'closeOnScrollOutside' | 'focusFirstItemOnOpen' | 'onOpenChange' | 'open'
> {
    menuRef?: Ref<HTMLDivElement>
    onSearch?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

interface UseComboboxDropdownHookReturn extends UseInteractionsReturn,
    Pick<UseFloatingReturn<HTMLInputElement | HTMLTextAreaElement>, 'floatingStyles' | 'context'> {
    onSearch: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    activeIndex: number | null
    setActiveIndex: Dispatch<SetStateAction<number | null>>
    setInputRef: RefCallback<HTMLInputElement | HTMLTextAreaElement>
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
    setMenuRef: RefCallback<HTMLDivElement>
    menuRef: RefObject<HTMLDivElement | null>
    listRef: RefObject<(HTMLElement | null)[]>
    rememberListItem: SelectInputBasicApi['rememberOptionElement']
    isActiveListItem: SelectInputBasicApi['isActiveOption']
    isDropUp: boolean
}

// Настройка floating-ui для выпадающих меню в полях выбора значения:
// Select, MultiSelect, Combobox.
export function useSelectInputDropdown(
    options: UseComboboxDropdownHookOptions
): UseComboboxDropdownHookReturn {

    const {
        inputRef,
        menuRef,
        align,
        drop = 'down',
        isRTL,
        flip: shouldFlip = {padding: 10},
        offset: optionsOffset = 2,
        shift: shouldShift = false,
        /**
         * Способ определения ширины выпадающего меню:
         * - fit-input - размер меню = размеру поля ввода.
         * - fill-container - размер меню = размеру контейнера поля ввода (width = 100%).
         * - fit-items - размер меню определяется размерами элементов в нем (авто-ширина по сути).
         * По умолчанию: 'fit-input'
         */
        dropdownWidth = 'fit-input',
        focusFirstItemOnOpen = 'auto',
        closeOnScrollOutside = false,
        onSearch: optionsOnSearch,
        onOpenChange: optionsOnOpenChange,
        open: managedOpen,
    } = options

    const [
        isOpenState,
        setIsOpenState,
    ] = useState<boolean>(false)

    const isManaged: boolean = managedOpen !== undefined
    // noinspection PointlessBooleanExpressionJS
    const isOpen: boolean = isManaged ? !!managedOpen : isOpenState

    const setIsOpen = useEventCallback((
        nextIsOpen: boolean | ((prevState: boolean) => boolean),
        event?: Event,
        reason?: OpenChangeReason
    ) => {
        if (typeof nextIsOpen === 'function') {
            nextIsOpen = nextIsOpen(isOpen)
        }
        if (!isManaged) {
            setIsOpenState(nextIsOpen)
        }
        optionsOnOpenChange?.(nextIsOpen, event, reason)
    })

    const [
        activeIndex,
        setActiveIndex,
    ] = useState<number | null>(null)

    const listRef = useRef<(HTMLElement | null)[]>([])

    // Вычисление расположения выпадающего меню относительно DropdownToggle.
    // Не работает, если нет компонента DropdownToggle внутри Dropdown.
    const placement = useMemo(
        () => getDropdownMenuPlacement(
            align === 'end',
            drop,
            isRTL
        ),
        [align, drop, isRTL]
    )

    // noinspection SuspiciousTypeOfGuard
    const {
        refs,
        floatingStyles,
        context,
    } = useFloating<HTMLInputElement | HTMLTextAreaElement>({
        whileElementsMounted: autoUpdate,
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        middleware: [
            optionsOffset
                ? offset(
                    typeof optionsOffset === 'number'
                        ? {
                            mainAxis: optionsOffset,
                        }
                        : optionsOffset
                )
                : null,
            shouldFlip ? flip(typeof shouldFlip === 'object' ? shouldFlip : undefined) : null,
            shouldShift ? shift(typeof shouldShift === 'object' ? shouldShift : undefined) : null,
            size({
                apply({rects, availableHeight, elements}) {
                    let width
                    switch (dropdownWidth) {
                        case 'fit-input':
                            width = `${rects.reference.width}px`
                            break
                        case 'fill-container':
                            width = '100%'
                            break
                    }
                    Object.assign(elements.floating.style, {
                        width,
                        maxHeight: `${availableHeight}px`,
                    })
                },
                padding: 10,
            }, [dropdownWidth]),
        ],
    })

    const role = useRole(context, {role: 'listbox'})
    const dismiss = useDismiss(context, {
        ancestorScroll: closeOnScrollOutside,
    })
    const listNav = useListNavigation(context, {
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
        [role, dismiss, listNav]
    )

    const onSearch = useEventCallback((
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        optionsOnSearch?.(event)

        if (event.currentTarget.value) {
            setIsOpen(true, event.nativeEvent, 'reference-press')
            setActiveIndex(0)
        } else {
            setIsOpen(false, event.nativeEvent, 'escape-key')
        }
    })

    const setInputRef = useMergedRefs(
        inputRef,
        refs.setReference
    )

    const setMenuRef = useMergedRefs(
        menuRef,
        refs.setFloating
    )

    const rememberListItem = useCallback((
        item: HTMLElement | null,
        index: number
    ) => {
        listRef.current[index] = item
    }, [])

    const isActiveListItem = useCallback(
        (index: number) => activeIndex === index,
        [activeIndex]
    )

    return {
        context,
        setInputRef,
        setMenuRef,
        inputRef: refs.reference as UseComboboxDropdownHookReturn['inputRef'],
        menuRef: refs.floating as UseComboboxDropdownHookReturn['menuRef'],
        listRef,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        floatingStyles,
        onSearch,
        isOpen,
        setIsOpen,
        activeIndex,
        setActiveIndex,
        rememberListItem,
        isActiveListItem,
        isDropUp: ['up', 'up-centered'].includes(drop),
    }
}
