import {
    autoUpdate,
    flip,
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
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {useMergedRefs} from '../../../helpers/useMergedRefs'
import {ComboboxInputProps} from '../InputTypes'

interface Options {
    inputRef?: ComboboxInputProps['inputRef']
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
    rememberListItem: (
        item: HTMLElement | null,
        index: number
    ) => void
    isActiveListItem: (index: number) => boolean
}

export function useComboboxDropdown(options: Options): UseComboboxDropdownHookReturn {

    const [
        isOpen,
        setIsOpen,
    ] = useState(false)

    const [
        activeIndex,
        setActiveIndex,
    ] = useState<number | null>(null)

    const listRef = useRef<(HTMLElement | null)[]>([])

    const {
        refs,
        floatingStyles,
        context,
    } = useFloating<HTMLInputElement | HTMLTextAreaElement>({
        whileElementsMounted: autoUpdate,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            flip({padding: 10}),
            size({
                apply({rects, availableHeight, elements}) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                        maxHeight: `${availableHeight}px`,
                    })
                },
                padding: 10,
            }),
        ],
    })

    const role = useRole(context, {role: 'listbox'})
    const dismiss = useDismiss(context)
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
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
        options.onSearch?.(event)

        if (event.currentTarget.value) {
            setIsOpen(true)
            setActiveIndex(0)
        } else {
            setIsOpen(false)
        }
    })

    const setInputRef = useMergedRefs(
        options.inputRef,
        refs.setReference
    )

    const setMenuRef = useMergedRefs(
        options.menuRef,
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
    }
}
