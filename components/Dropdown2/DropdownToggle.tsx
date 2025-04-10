import React, {AllHTMLAttributes} from 'react'
import useMergedRefs from '@restart/hooks/useMergedRefs'
import DropdownContext from '@restart/ui/DropdownContext'
import {useDropdownToggle} from '@restart/ui/DropdownToggle'
import {useContext} from 'react'
import clsx from 'clsx'
import Button from '../Button'
import {DropdownToggleProps} from './DropdownTypes'

export function DropdownToggle<
    T = AllHTMLAttributes<HTMLElement>
>(props: DropdownToggleProps & Omit<T, 'ref'>) {

    const dropdownContext = useContext(DropdownContext)

    const {
        split,
        className,
        tag: Component = Button,
        ref,
        ...otherProps
    } = props

    const [toggleProps] = useDropdownToggle()

    toggleProps.ref = useMergedRefs(
        toggleProps.ref,
        ref as React.RefObject<HTMLElement>
    )

    // This intentionally forwards size and variant (if set) to the
    // underlying component, to allow it to render size and style variants.
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
        />
    )
}
