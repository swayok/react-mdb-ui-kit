import {
    useClick,
    useDismiss,
    useInteractions,
    UseInteractionsReturn,
    useRole,
} from '@floating-ui/react'
import {Ref} from 'react'
import {
    useInputFloatingMenu,
    UseInputFloatingMenuHookOptions,
    UseInputFloatingMenuHookReturn,
} from './useInputFloatingMenu'

interface UseInputDropdownHookOptions extends UseInputFloatingMenuHookOptions {
    closeOnScrollOutside?: boolean
    // Дополнительный отступ для выпадающего меню, если оно открывается над полем ввода.
    // Требуется для того, чтобы не загораживать подпись в активном режиме отображения.
    dropUpOffset?: number
    menuRef?: Ref<HTMLDivElement>
    maxHeight?: number
}

interface UseInputDropdownHookReturn extends UseInputFloatingMenuHookReturn, UseInteractionsReturn {
}

// Настройка floating-ui для выпадающих меню в полях ввода/выбора значения:
// DateInput, DateRangeInput.
export function useInputDropdown(
    options: UseInputDropdownHookOptions
): UseInputDropdownHookReturn {

    const {
        dropdownWidth = 'fit-items',
        closeOnScrollOutside = false,
        maxHeight,
        ...floatingOptions
    } = options

    const floatingConfig = useInputFloatingMenu({
        ...floatingOptions,
        dropdownWidth,
    })

    const click = useClick(floatingConfig.context, {
        event: 'click',
        /**
         * Контроль открытия при фокусе и нажатии в полях ввода осуществляется отдельно.
         * @see SelectInputBase
         */
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

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps,
    } = useInteractions(
        [
            click,
            role,
            dismiss,
        ]
    )

    return {
        ...floatingConfig,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
    }
}
