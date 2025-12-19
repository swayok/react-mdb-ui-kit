import {
    autoUpdate,
    flip,
    FlipOptions,
    offset,
    OpenChangeReason,
    shift,
    size,
    useFloating,
    UseFloatingReturn,
} from '@floating-ui/react'
import {
    Ref,
    RefCallback,
    RefObject,
    useMemo,
    useState,
} from 'react'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {useMergedRefs} from '../../../helpers/useMergedRefs'
import {getDropdownMenuPlacement} from '../../Dropdown/getDropdownMenuPlacement'
import {SelectInputBasicProps} from '../SelectInput/SelectInputTypes'
import {applyDropdownMenuSize} from './applyDropdownMenuSize'

export interface UseInputFloatingMenuHookOptions extends Pick<
    SelectInputBasicProps,
    'inputRef' | 'dropdownWidth' | 'flip' | 'align' | 'offset' | 'isRTL' | 'shift' | 'drop'
    | 'onOpenChange' | 'open'
> {
    // Дополнительный отступ для выпадающего меню, если оно открывается над полем ввода.
    // Требуется для того, чтобы не загораживать подпись в активном режиме отображения.
    dropUpOffset?: number
    menuRef?: Ref<HTMLDivElement>
    maxHeight?: number
}

export interface UseInputFloatingMenuHookReturn extends Pick<
    UseFloatingReturn<HTMLInputElement | HTMLTextAreaElement>,
    'floatingStyles' | 'context'
> {
    isOpen: boolean
    setIsOpen: (
        nextIsOpen: boolean | ((prevState: boolean) => boolean),
        event?: Event,
        reason?: OpenChangeReason
    ) => void
    setInputRef: RefCallback<HTMLInputElement | HTMLTextAreaElement>
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
    setMenuRef: RefCallback<HTMLDivElement>
    menuRef: RefObject<HTMLDivElement | null>
    isDropUp: boolean
}

// Настройка floating-ui для выпадающих меню для полей ввода/выбора значений.
export function useInputFloatingMenu(
    options: UseInputFloatingMenuHookOptions
): UseInputFloatingMenuHookReturn {

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
            return applyDropdownMenuSize(info, maxHeight, dropdownWidth, dropUpOffset)
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

    const setInputRef = useMergedRefs(
        inputRef,
        refs.setReference
    )

    const setMenuRef = useMergedRefs(
        menuRef,
        refs.setFloating
    )

    return {
        context,
        setInputRef,
        setMenuRef,
        inputRef: refs.reference as UseInputFloatingMenuHookReturn['inputRef'],
        menuRef: refs.floating as UseInputFloatingMenuHookReturn['menuRef'],
        floatingStyles,
        isOpen,
        setIsOpen,
        isDropUp: context.placement.startsWith('top'),
    }
}
