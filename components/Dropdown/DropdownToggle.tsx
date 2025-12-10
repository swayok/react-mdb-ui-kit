import clsx from 'clsx'
import * as React from 'react'
import {FocusEvent} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {MergedComponentProps} from '../../types'
import {
    Button,
    ButtonProps,
} from '../Button'
import {useDropdownContext} from './DropdownContext'
import {DropdownToggleProps} from './DropdownTypes'

// Кнопка открытия выпадающего меню.
export function DropdownToggle<
    InjectedComponentProps extends object = ButtonProps,
>(
    props: MergedComponentProps<
        DropdownToggleProps,
        Omit<InjectedComponentProps, 'onFocus'>
    >
) {
    const {
        split,
        className,
        tag: Tag = Button,
        ref: propsRef,
        renderContent,
        children,
        onFocus: propsOnFocus,
        ...otherProps
    } = props

    const {
        isOpen,
        setToggleElement,
        isNested,
        hasFocusInside,
        parentContext,
        getReferenceProps,
        itemForParent,
        setIsOpen,
        setHasFocusInside,
    } = useDropdownContext()

    const mergedRefs = useMergedRefs(
        propsRef,
        setToggleElement
    )

    const tabIndex = isNested && parentContext && itemForParent
        ? parentContext.activeIndex === itemForParent.index ? 0 : -1
        : undefined

    // @ts-ignore Ругается на задание otherProps.onFocus.
    otherProps.onFocus = useEventCallback(
        (event: FocusEvent<HTMLElement>): void => {
            propsOnFocus?.(event)
            setHasFocusInside(false)
            parentContext?.setHasFocusInside(true)
        }
    )

    const mergedProps = getReferenceProps(
        isNested && parentContext
            ? parentContext.getItemProps(otherProps)
            : otherProps
    )

    return (
        <Tag
            className={clsx(
                className,
                'dropdown-toggle',
                split ? 'dropdown-toggle-split' : null,
                isOpen ? 'show' : null,
                isNested ? 'nested' : null,
                hasFocusInside ? 'focused' : null
            )}
            ref={mergedRefs}
            tabIndex={tabIndex}
            role={isNested ? 'menuitem' : undefined}
            {...mergedProps}
        >
            {
                typeof renderContent === 'function'
                    ? renderContent({
                        isOpen,
                        isNested,
                        hasFocusInside,
                        setIsOpen,
                    })
                    : children
            }
        </Tag>
    )
}
