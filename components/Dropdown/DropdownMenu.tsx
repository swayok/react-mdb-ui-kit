import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingList,
    FloatingPortal,
    offset,
    shift,
    useFloating,
} from '@floating-ui/react'
import {
    Fragment,
    HTMLProps,
    useImperativeHandle,
    useMemo,
} from 'react'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {useDropdownContext} from './DropdownContext'
import {DropdownMenuContent} from './DropdownMenuContent'
import {
    DropdownApi,
    DropdownMenuProps,
} from './DropdownTypes'
import {getDropdownMenuPlacement} from './getDropdownMenuPlacement'

// Выпадающее меню (отображение).
export function DropdownMenu<
    RefType extends HTMLElement = HTMLDivElement,
    InjectedComponentProps extends object = HtmlComponentProps<RefType>,
>(props: MergedComponentProps<DropdownMenuProps<RefType>, InjectedComponentProps>) {

    const {
        drop = 'down',
        align = 'start',
        isRTL = false,
        flip: shouldFlip = true,
        shift: shouldShift = false,
        offset: propsOffset = 2,
        renderOnMount,
        ref,
        apiRef,
        style = {},
        inline,
        noFocus,
        children,
        ...otherProps
    } = props

    const {
        isOpen,
        setIsOpen,
        isNested,
        setMenuElement,
        rootContext,
        getFloatingProps,
        elementsRef,
    } = useDropdownContext<HTMLElement, RefType>()

    // API компонента для использования во внешних компонентах.
    useImperativeHandle(apiRef, (): DropdownApi => ({
        setIsOpen,
    }))

    // Вычисление расположения выпадающего меню относительно DropdownToggle.
    // Не работает, если нет компонента DropdownToggle внутри Dropdown.
    const placement = useMemo(
        () => (
            isNested ? 'right-start' : getDropdownMenuPlacement(
                align === 'end',
                drop,
                isRTL
            )
        ),
        [align, drop, isRTL, isNested]
    )

    const mergedRef = useMergedRefs<RefType>(
        ref,
        setMenuElement
    )

    // noinspection SuspiciousTypeOfGuard
    const {floatingStyles, context} = useFloating<HTMLButtonElement>({
        rootContext,
        placement,
        middleware: [
            offset(
                typeof propsOffset === 'number'
                    ? {
                        mainAxis: isNested ? 0 : propsOffset,
                        alignmentAxis: isNested ? -1 * propsOffset : 0,
                    }
                    : propsOffset
            ),
            shouldFlip ? flip(typeof shouldFlip === 'object' ? shouldFlip : undefined) : null,
            shouldShift ? shift(typeof shouldShift === 'object' ? shouldShift : undefined) : null,
        ],
        whileElementsMounted: autoUpdate,
    })

    const Portal = inline ? Fragment : FloatingPortal

    return (
        <FloatingList
            elementsRef={elementsRef}
        >
            {(isOpen || renderOnMount) && (
                <Portal>
                    <FloatingFocusManager
                        context={context}
                        modal={false}
                        initialFocus={isNested ? -1 : 0}
                        returnFocus={!isNested}
                        disabled={noFocus}
                    >
                        <DropdownMenuContent
                            ref={mergedRef}
                            isOpen={isOpen}
                            {...getFloatingProps(
                                otherProps as HTMLProps<HTMLElement>
                            )}
                            style={{
                                ...style,
                                ...floatingStyles,
                            }}
                        >
                            {children}
                        </DropdownMenuContent>
                    </FloatingFocusManager>
                </Portal>
            )}
        </FloatingList>
    )
}

