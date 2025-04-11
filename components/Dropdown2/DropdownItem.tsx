import React from 'react'
import {useDropdownItem} from '@restart/ui/DropdownItem'
import Anchor from '@restart/ui/Anchor'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {AnyObject, ReactComponentOrTagName} from '../../types/Common'
import {DropdownItemProps} from './DropdownTypes'

export function DropdownItem(props: DropdownItemProps) {

    const {
        className,
        eventKey,
        disabled = false,
        onClick,
        active,
        external,
        tag,
        target,
        href,
        ref,
        ...otherProps
    } = props

    const [dropdownItemProps, meta] = useDropdownItem({
        key: eventKey,
        href,
        disabled,
        onClick,
        active,
    })

    const {
        Component,
        componentProps,
    } = getComponentAndProps(tag, href, target, external)

    return (
        <Component
            {...otherProps}
            {...dropdownItemProps}
            {...componentProps}
            ref={ref}
            className={clsx(
                'dropdown-item',
                meta.isActive ? 'active' : null,
                disabled ? 'disabled' : 'clickable',
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
    external: DropdownItemProps['external']
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
        // Это ссылка (<a>).
        if (target) {
            componentProps.target = target
        }
        if (!external) {
            // Конвертируем в <Link>, чтобы работало с навигацией
            Component = Link
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
