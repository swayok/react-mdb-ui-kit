import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect'
import useMergedRefs from '@restart/hooks/useMergedRefs'
import {useDropdownMenu} from '@restart/ui/DropdownMenu'
import clsx from 'clsx'
import React, {CSSProperties, RefObject, useEffect, useRef} from 'react'
import warning from 'warning'
import {AnyObject} from '../../types/Common'
import {useDropdownContext} from './DropdownContext'
import {
    DropdownAlign,
    DropdownAlignDirection,
    DropdownDropDirection,
    DropdownMenuProps,
    DropdownResponsiveAlign,
} from './DropdownTypes'
import {getDropdownMenuPlacement} from './getDropdownMenuPlacement'

// Выпадающее меню (отображение).
export function DropdownMenu(props: DropdownMenuProps) {

    const {
        align: contextAlign,
        drop,
        isRTL,
        offset: contextOffset,
    } = useDropdownContext()

    const {
        className,
        align = contextAlign,
        rootCloseEvent,
        flip = true,
        show: showFromProps,
        renderOnMount,
        tag: Component = 'div',
        popperConfig,
        variant,
        isNavbar,
        ref,
        offset = contextOffset ?? [0, 2],
        closeOnScrollOutside = false,
        maxHeight,
        textNowrapOnItems,
        style = {},
        fillContainer,
        ...otherProps
    } = props

    const {
        placement,
        alignClasses,
        alignEnd,
    } = getPlacementAndAlignClasses(align, drop, isRTL)

    // noinspection SuspiciousTypeOfGuard
    const [menuProps, {hasShown, popper, show, toggle}] = useDropdownMenu({
        flip,
        rootCloseEvent,
        show: showFromProps,
        usePopper: !isNavbar && alignClasses.length === 0,
        offset: typeof offset === 'number' ? [0, offset] : offset,
        popperConfig,
        placement,
    })

    menuProps.ref = useMergedRefs(
        ref as RefObject<HTMLElement>,
        menuProps.ref
    )

    const menuRef = useRef<HTMLElement>(null)
    menuProps.ref = useMergedRefs(
        element => {
            menuRef.current = element
        },
        menuProps.ref
    )

    // Обработка глобального события скроллинга для закрытия меню при
    // срабатывании события вне меню.
    useEffect(() => {
        if (closeOnScrollOutside && show) {
            const abortController = new AbortController()
            document.addEventListener(
                'scroll',
                event => {
                    if (!menuRef.current?.contains(event.target as Node)) {
                        abortController.abort()
                        toggle?.(false)
                    }
                },
                {
                    passive: true,
                    signal: abortController.signal,
                    capture: true,
                }
            )
            return () => {
                abortController.abort()
            }
        }
        return () => {
        }
    }, [closeOnScrollOutside, toggle, show])

    // Popper's initial position for the menu is incorrect when
    // renderOnMount=true. Need to call update() to correct it.
    useIsomorphicEffect(() => {
        if (show) {
            popper?.update()
        }
    }, [show])

    if (!hasShown && !renderOnMount) {
        return null
    }

    // For custom components provide additional, non-DOM, props;
    // noinspection SuspiciousTypeOfGuard
    if (typeof Component !== 'string') {
        menuProps.show = show
        menuProps.close = () => toggle?.(false)
        menuProps.align = align
    }

    const additionalStyles: CSSProperties = {}
    if (maxHeight !== undefined) {
        additionalStyles.maxHeight = maxHeight
    }

    const bsProps: AnyObject = {
        'x-placement': popper?.placement,
    }
    if (alignClasses.length || isNavbar) {
        // Bootstrap css requires this data attrib to style responsive menus.
        bsProps['data-bs-popper'] = 'static'
    }

    return (
        <Component
            {...otherProps}
            {...menuProps}
            {...bsProps}
            style={{
                ...additionalStyles,
                ...style,
                // Так надо.
                ...(popper?.placement ? menuProps.style : {}),
            }}
            className={clsx(
                className,
                'dropdown-menu',
                show && 'show',
                alignEnd && 'dropdown-menu-end',
                variant && `dropdown-menu-${variant}`,
                fillContainer ? 'full-width' : null,
                textNowrapOnItems ? 'text-nowrap-on-items' : null,
                ...alignClasses
            )}
        />
    )
}

function getPlacementAndAlignClasses(
    align?: DropdownAlign,
    drop?: DropdownDropDirection,
    isRTL?: boolean
) {
    let alignEnd = false

    const alignClasses: string[] = []
    if (align) {
        if (typeof align === 'object') {
            const keys = Object.keys(align)

            warning(
                keys.length === 1,
                'There should only be 1 breakpoint when passing an object to `align`'
            )

            if (keys.length) {
                const brkPoint = keys[0] as keyof DropdownResponsiveAlign
                const direction: DropdownAlignDirection = align[brkPoint]

                // .dropdown-menu-end is required for responsively aligning
                // left in addition to align left classes.
                alignEnd = direction === 'start'
                alignClasses.push(`dropdown-menu-${brkPoint as string}-${direction as string}`)
            }
        } else if (align === 'end') {
            alignEnd = true
        }
    }

    return {
        placement: getDropdownMenuPlacement(alignEnd, drop, isRTL),
        alignClasses,
        alignEnd,
    }
}
