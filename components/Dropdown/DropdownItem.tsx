import Anchor from '@restart/ui/Anchor'
import {useDropdownItem} from '@restart/ui/DropdownItem'
import clsx from 'clsx'
import {
    MouseEvent,
    useMemo,
} from 'react'
import {
    Link,
    LinkProps,
} from 'react-router-dom'
import {useEventCallback} from '../../helpers/useEventCallback'
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
        eventKey,
        disabled = false,
        onClick,
        active,
        external,
        tag,
        LinkComponent = Link,
        target,
        href,
        ref,
        ...otherProps
    } = props

    const {
        disableAllItems,
    } = useDropdownContext()

    const handleClick = useEventCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (disabled || disableAllItems) {
                e.preventDefault()
                return
            }
            onClick?.(e)
        }
    )

    const [
        dropdownItemProps,
        meta,
    ] = useDropdownItem({
        key: eventKey,
        href,
        disabled: disabled || disableAllItems,
        onClick: handleClick,
        active,
    })

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

    return (
        <Component
            {...otherProps}
            {...dropdownItemProps}
            {...componentProps}
            disabled={disableAllItems}
            ref={ref}
            className={clsx(
                'dropdown-item',
                meta.isActive ? 'active' : null,
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
            Component = Anchor
        }
    }
    return {
        Component,
        componentProps,
    }
}
