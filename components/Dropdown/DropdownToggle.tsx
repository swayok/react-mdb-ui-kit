import clsx from 'clsx'
import {
    FocusEvent,
    KeyboardEvent,
    RefCallback,
} from 'react'
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
    RefType extends HTMLElement = HTMLElement,
>(
    props: MergedComponentProps<
        DropdownToggleProps<RefType, InjectedComponentProps>,
        Omit<InjectedComponentProps, 'onFocus'>
    >
) {
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

    const {
        split,
        className,
        tag: Tag = isNested ? 'div' : Button,
        ref: propsRef,
        renderContent,
        modifyProps,
        children,
        onFocus: propsOnFocus,
        ...otherProps
    } = props

    const mergedRefs = useMergedRefs<RefType>(
        propsRef,
        setToggleElement as RefCallback<RefType>
    )

    // @ts-ignore Ругается на задание otherProps.onFocus.
    otherProps.onFocus = useEventCallback(
        (event: FocusEvent<RefType>): void => {
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

    const tabIndex = isNested && parentContext && itemForParent
        ? parentContext.activeIndex === itemForParent.index ? 0 : -1
        : undefined

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
            {...(modifyProps ? modifyProps({
                isOpen,
                isNested,
                hasFocusInside,
            }) : {})}
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
