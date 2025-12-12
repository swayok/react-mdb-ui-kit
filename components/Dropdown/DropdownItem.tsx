import {
    useFloatingTree,
    useListItem,
} from '@floating-ui/react'
import clsx from 'clsx'
import {
    MouseEvent,
    FocusEvent,
    useMemo,
} from 'react'
import {
    Link,
    LinkProps,
} from 'react-router-dom'
import {useEventCallback} from '../../helpers/useEventCallback'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {
    AnyObject,
    MergedComponentProps,
    ReactComponentOrTagName,
} from '../../types'
import {useDropdownContext} from './DropdownContext'
import {DropdownItemProps} from './DropdownTypes'

// Элемент выпадающего меню.
export function DropdownItem<
    InjectedComponentProps extends object = LinkProps,
>(props: MergedComponentProps<DropdownItemProps, Omit<InjectedComponentProps, 'to'>>) {

    const {
        className,
        disabled = false,
        onClick: propsOnClick,
        onFocus: propsOnFocus,
        active,
        external,
        submenu,
        tag,
        LinkComponent = Link,
        target,
        href,
        ref,
        ...otherProps
    } = props as MergedComponentProps<DropdownItemProps, Omit<LinkProps, 'to'>>

    const {
        disableAllItems,
        activeIndex,
        getItemProps,
        setHasFocusInside,
    } = useDropdownContext()

    const item = useListItem()
    const isActive = active || item.index === activeIndex
    console.log({active, activeIndex})
    const tree = useFloatingTree()

    const onClick = useEventCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (disabled || disableAllItems) {
                e.preventDefault()
                return
            }
            propsOnClick?.(e as MouseEvent<HTMLAnchorElement>)
            tree?.events.emit('click')
        }
    )

    const onFocus = useEventCallback(
        (e: FocusEvent<HTMLElement>) => {
            propsOnFocus?.(e as FocusEvent<HTMLAnchorElement>)
            setHasFocusInside(true)
        }
    )

    const {
        Component,
        componentProps,
    } = useMemo(
        () => getComponentAndProps(
            tag,
            href,
            target,
            external,
            LinkComponent
        ),
        [
            tag,
            href,
            target,
            external,
            LinkComponent,
        ]
    )

    const mergedRef = useMergedRefs(
        ref,
        item.ref
    )

    return (
        <Component
            {...getItemProps({
                ...otherProps,
                onClick,
                onFocus,
            })}
            ref={mergedRef}
            tabIndex={isActive ? 0 : -1}
            role="menuitem"
            {...componentProps}
            disabled={disableAllItems || disabled}
            className={clsx(
                'dropdown-item',
                submenu ? 'submenu' : null,
                isActive ? 'active' : null,
                disabled ? 'disabled' : null,
                componentProps.className as string,
                className
            )}
        />
    )
}

// Определить правильный компонент и его свойства для отрисовки.
function getComponentAndProps(
    tag: DropdownItemProps['tag'],
    href: DropdownItemProps['href'],
    target: DropdownItemProps['target'],
    external: DropdownItemProps['external'],
    LinkComponent: DropdownItemProps['LinkComponent']
): {
    Component: ReactComponentOrTagName
    componentProps: AnyObject
} {
    if (tag && typeof tag !== 'string') {
        // Какой-то компонент: ничего не меняем.
        return {
            Component: tag,
            componentProps: {
                href,
                target,
            },
        }
    }
    // Обычный тэг типа <a> или <div>.
    const componentProps: AnyObject = {}
    let Component: ReactComponentOrTagName = tag ?? (href ? 'a' : 'div')
    if (Component === 'a') {
        // Это ссылка (<a href="">).
        if (target) {
            componentProps.target = target
        }
        if (!external) {
            // Конвертируем в <Link>, чтобы работало с навигацией
            Component = LinkComponent
            componentProps.to = href
        } else {
            // Если указан target или external, то ссылку считаем внешней (не должна идти через роутер)
            componentProps.href = href
            Component = 'a'
        }
    }
    return {
        Component,
        componentProps,
    }
}
