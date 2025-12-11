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
import clsx from 'clsx'
import {
    CSSProperties,
    Fragment,
    useImperativeHandle,
    useMemo,
} from 'react'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {useDropdownContext} from './DropdownContext'
import {
    DropdownApi,
    DropdownMenuProps,
} from './DropdownTypes'
import {getDropdownMenuPlacement} from './getDropdownMenuPlacement'

// Выпадающее меню (отображение).
export function DropdownMenu<
    InjectedComponentProps extends object = HtmlComponentProps<HTMLDivElement>,
>(props: MergedComponentProps<DropdownMenuProps, InjectedComponentProps>) {

    const {
        className,
        shadow,
        drop = 'down',
        align = 'start',
        isRTL = false,
        flip: shouldFlip = true,
        shift: shouldShift = false,
        renderOnMount,
        tag: Tag = 'div',
        variant,
        ref,
        offset: propsOffset = 2,
        maxHeight,
        textNowrapOnItems,
        style = {},
        inline,
        fillContainer,
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
        labelsRef,
    } = useDropdownContext()

    // API компонента для использования во внешних компонентах.
    useImperativeHandle(ref, (): DropdownApi => ({
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

    const mergedRef = useMergedRefs(
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

    const additionalStyles: CSSProperties = {}
    if (maxHeight) {
        additionalStyles.maxHeight = maxHeight
    }

    const Portal = inline ? Fragment : FloatingPortal

    return (
        <FloatingList
            elementsRef={elementsRef}
            labelsRef={labelsRef}
        >
            {(isOpen || renderOnMount) && (
                <Portal>
                    <FloatingFocusManager
                        context={context}
                        modal={false}
                        initialFocus={isNested ? -1 : 0}
                        returnFocus={!isNested}
                    >
                        <Tag
                            ref={mergedRef}
                            {...getFloatingProps(otherProps)}
                            className={clsx(
                                className,
                                'dropdown-menu',
                                shadow ? `shadow-${shadow}` : null,
                                isOpen ? 'show' : null,
                                variant ? `dropdown-menu-${variant}` : null,
                                fillContainer ? 'full-width' : null,
                                textNowrapOnItems ? 'text-nowrap-on-items' : null
                            )}
                            style={{
                                ...style,
                                ...floatingStyles,
                                ...(maxHeight ? {maxHeight} : {}),
                            }}
                        >
                            {children}
                        </Tag>
                    </FloatingFocusManager>
                </Portal>
            )}
        </FloatingList>
    )
}

