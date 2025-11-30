import useMergedRefs from '@restart/hooks/useMergedRefs'
import DropdownContext from '@restart/ui/DropdownContext'
import {useDropdownToggle} from '@restart/ui/DropdownToggle'
import clsx from 'clsx'
import React, {useContext} from 'react'
import {Button, ButtonProps} from '../Button'
import {DropdownToggleProps} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'

export function DropdownToggle<
    T = ButtonProps
>(props: DropdownToggleProps & Omit<T, 'ref' | keyof DropdownToggleProps>) {

    const dropdownContext = useContext(DropdownContext)

    const {
        split,
        className,
        tag: Component = Button,
        ref,
        render,
        children,
        ...otherProps
    } = props

    const [toggleProps, toggleMetadata] = useDropdownToggle()

    toggleProps.ref = useMergedRefs(
        toggleProps.ref,
        ref as React.RefObject<HTMLElement>
    )

    // This intentionally forwards size and variant (if set) to the
    // underlying component to allow it to render size and style variants.
    return (
        <Component
            className={clsx(
                className,
                'dropdown-toggle',
                split ? 'dropdown-toggle-split' : null,
                dropdownContext?.show && 'show'
            )}
            {...toggleProps}
            {...otherProps}
        >
            {typeof render === 'function' ? render(toggleMetadata) : children}
        </Component>
    )
}
