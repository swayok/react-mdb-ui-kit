import {
    autoUpdate,
    flip,
    FlipOptions,
    offset,
    OpenChangeReason,
    shift,
    size,
    useClick,
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
import {SelectInputBasicProps} from '../SelectInput/SelectInputTypes'

interface UseSelectInputDropdownHookOptions extends Pick<
    SelectInputBasicProps,
    'inputRef' | 'dropdownWidth' | 'flip' | 'align' | 'offset' | 'isRTL' | 'shift' | 'drop'
    | 'closeOnScrollOutside' | 'focusFirstItemOnOpen' | 'onOpenChange' | 'open'
> {
    dropUpOffset?: number
    menuRef?: Ref<HTMLDivElement>
    onSearch?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    maxHeight?: number
}

interface UseSelectInputDropdownHookReturn extends UseInteractionsReturn,
    Pick<UseFloatingReturn<HTMLInputElement | HTMLTextAreaElement>, 'floatingStyles' | 'context'> {
    onSearch: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    isOpen: boolean
    setIsOpen: (
        nextIsOpen: boolean | ((prevState: boolean) => boolean),
        event?: Event,
        reason?: OpenChangeReason
    ) => void
    activeIndex: number | null
    setActiveIndex: Dispatch<SetStateAction<number | null>>
    setInputRef: RefCallback<HTMLInputElement | HTMLTextAreaElement>
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
    setMenuRef: RefCallback<HTMLDivElement>
    menuRef: RefObject<HTMLDivElement | null>
    listItemsRef: RefObject<(HTMLElement | null)[]>
    isActiveListItem: (index: number) => boolean
    isDropUp: boolean
}

// Настройка floating-ui для выпадающих меню в полях выбора значения:
// Select, MultiSelect, Combobox.
export function useSelectInputDropdown(
    options: UseSelectInputDropdownHookOptions
): UseSelectInputDropdownHookReturn {

    const {
        inputRef,
        menuRef,
        align,
        drop = 'down',
        dropUpOffset,
        isRTL,
        flip: shouldFlip = {padding: 10} as FlipOptions,
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
        maxHeight,
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
    const defaultPlacement = useMemo(
        () => getDropdownMenuPlacement(
            align === 'end',
            drop,
            isRTL
        ),
        [align, drop, isRTL]
    )

    const sizeMiddleware = size({
        apply(info) {
            const {
                rects,
                availableHeight,
                elements,
                placement,
            } = info
            switch (dropdownWidth) {
                case 'fit-input':
                    elements.floating.style.width = `${rects.reference.width}px`
                    break
                case 'fill-container':
                    elements.floating.style.width = '100%'
                    break
            }
            let height: number = availableHeight
            if (dropUpOffset && placement.startsWith('top')) {
                height -= dropUpOffset
                elements.floating.style.top = `${-1 * dropUpOffset}px`
            }
            if (maxHeight) {
                height = Math.min(maxHeight, height)
            }
            elements.floating.style.maxHeight = `${height}px`
            // Ищем внутренний scrollable.
            const scrollable = Array.from(elements.floating.children)
                .find(
                    element => element.classList.contains('dropdown-menu-scrollable')
                ) as HTMLElement | null
            if (scrollable) {
                // Если scrollable не первый отображаемый элемент, то нужно
                // уменьшить высоту на размер элементов сверху (offsetTop).
                // Сверху может быть поле ввода для фильтрации опций.
                height -= scrollable.offsetTop
                scrollable.style.maxHeight = `${height}px`
            }
        },
        padding: 10,
    }, [dropdownWidth, maxHeight, dropUpOffset])

    // noinspection SuspiciousTypeOfGuard
    const {
        refs,
        floatingStyles,
        context,
    } = useFloating<HTMLInputElement | HTMLTextAreaElement>({
        whileElementsMounted: autoUpdate,
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: defaultPlacement,
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
            sizeMiddleware,
        ],
    })

    const click = useClick(context, {
        event: 'click',
        toggle: false,
        ignoreMouse: false,
        keyboardHandlers: true,
    })
    const role = useRole(context, {
        role: 'listbox',
    })
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
        setIsOpen(true, event.nativeEvent, 'reference-press')
    })

    const setInputRef = useMergedRefs(
        inputRef,
        refs.setReference
    )

    const setMenuRef = useMergedRefs(
        menuRef,
        refs.setFloating
    )

    const isActiveListItem = useCallback(
        (index: number) => activeIndex === index,
        [activeIndex]
    )

    return {
        context,
        setInputRef,
        setMenuRef,
        inputRef: refs.reference as UseSelectInputDropdownHookReturn['inputRef'],
        menuRef: refs.floating as UseSelectInputDropdownHookReturn['menuRef'],
        listItemsRef: listRef,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        floatingStyles,
        onSearch,
        isOpen,
        setIsOpen,
        activeIndex,
        setActiveIndex,
        isActiveListItem,
        isDropUp: context.placement.startsWith('top'),
    }
}
