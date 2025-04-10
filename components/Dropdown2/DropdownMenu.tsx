import React, {RefObject, useContext} from 'react'
import {useDropdownMenu} from '@restart/ui/DropdownMenu'
import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect'
import useMergedRefs from '@restart/hooks/useMergedRefs'
import warning from 'warning'
import {DropdownAlignDirection, DropdownMenuProps, DropdownResponsiveAlign} from './DropdownTypes'
import clsx from 'clsx'
import {DropdownContext} from './DropdownContext'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {getDropdownMenuPlacement} from 'swayok-react-mdb-ui-kit/components/Dropdown2/getDropdownMenuPlacement'

export function DropdownMenu(props: DropdownMenuProps) {

    const {align: contextAlign, drop, isRTL} = useContext(DropdownContext)

    const {
        className,
        align = contextAlign,
        rootCloseEvent,
        flip = true,
        show: showProps,
        renderOnMount,
        tag: Component = 'div',
        popperConfig,
        variant,
        isNavbar,
        ref,
        offset = [0, 2],
        ...otherProps
    } = props

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

    const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)

    // noinspection SuspiciousTypeOfGuard
    const [menuProps, {hasShown, popper, show, toggle}] = useDropdownMenu({
        flip,
        rootCloseEvent,
        show: showProps,
        usePopper: !isNavbar && alignClasses.length === 0,
        offset: typeof offset === 'number' ? [0, offset] : offset,
        popperConfig,
        placement,
    })

    menuProps.ref = useMergedRefs(
        ref as RefObject<HTMLElement>,
        menuProps.ref
    )

    useIsomorphicEffect(() => {
        // Popper's initial position for the menu is incorrect when
        // renderOnMount=true. Need to call update() to correct it.
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

    let style = otherProps.style
    if (popper?.placement) {
        // we don't need the default popper style,
        // menus are display: none when not shown.
        style = {...otherProps.style, ...menuProps.style}
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
            style={style}
            className={clsx(
                className,
                'dropdown-menu',
                show && 'show',
                alignEnd && 'dropdown-menu-end',
                variant && `dropdown-menu-${variant}`,
                ...alignClasses
            )}
        />
    )
}
