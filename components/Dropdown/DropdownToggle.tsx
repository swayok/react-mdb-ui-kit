import DropdownContext from '@restart/ui/DropdownContext'
import {useDropdownToggle} from '@restart/ui/DropdownToggle'
import clsx from 'clsx'
import {
    RefObject,
    useContext,
} from 'react'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {MergedComponentProps} from '../../types'
import {
    Button,
    ButtonProps,
} from '../Button'
import {DropdownToggleProps} from './DropdownTypes'

// Кнопка открытия выпадающего меню.
export function DropdownToggle<
    InjectedComponentProps extends object = ButtonProps,
>(
    props: MergedComponentProps<
        DropdownToggleProps,
        Omit<InjectedComponentProps, 'split' | 'className' | 'tag' | 'ref' | 'render' | 'children'>
    >
) {

    const dropdownContext = useContext(DropdownContext)

    const {
        split,
        className,
        tag: Tag = Button,
        ref,
        render,
        children,
        ...otherProps
    } = props

    const [
        toggleProps,
        toggleMetadata,
    ] = useDropdownToggle()

    toggleProps.ref = useMergedRefs(
        toggleProps.ref,
        ref as RefObject<HTMLElement>
    )

    // This intentionally forwards size and variant (if set) to the
    // underlying component to allow it to render size and style variants.
    return (
        <Tag
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
        </Tag>
    )
}
