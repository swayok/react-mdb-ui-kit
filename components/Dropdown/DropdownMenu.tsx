import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {useDropdownContext} from './DropdownContext'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

interface DropdownMenuProps extends ComponentPropsWithModifiableTag {
    dark?: boolean,
    // По ширине контейнера.
    fillContainer?: boolean,
    // Если true, то не нужно демонтировать меню при закрытии.
    alwaysMounted?: boolean,
}

// Выпадающее меню (отображение)
function DropdownMenu(props: DropdownMenuProps) {

    const {
        setPopperElement,
        isVisible,
        isOpened,
        isAnimationActive,
        styles,
        attributes,
        animation,
        toggleOpenClose,
        moveActiveIndexUp,
        moveActiveIndexDown,
    } = useDropdownContext()

    const {
        className,
        tag: Tag = 'ul',
        children,
        style,
        dark,
        fillContainer,
        alwaysMounted,
        ...otherProps
    } = props

    const classes = clsx(
        'dropdown-menu',
        dark ? 'dropdown-menu-dark' : null,
        isVisible ? 'show' : null,
        animation && 'animation',
        isAnimationActive && isOpened && animation ? 'fade-in' : null,
        isAnimationActive && !isOpened && animation ? 'fade-out' : null,
        fillContainer ? 'full-width' : null,
        className
    )

    const [attachElements, setAttachElements] = useState(false)
    const [childrenLength, setChildrenLength] = useState<number>(-1)

    useEffect(() => {
        if (!isVisible) {
            setAttachElements(false)
        } else {
            const child = React.Children.count(children)

            setChildrenLength(child)
            setAttachElements(true)
        }
    }, [children, isVisible])

    useEffect(() => {
        if (!attachElements) {
            return
        }

        const abortController = new AbortController()
        document.addEventListener(
            'keydown',
            (e: KeyboardEvent) => {
                if (e.target instanceof HTMLInputElement) {
                    return
                }
                e.preventDefault()

                if (attachElements) {
                    if (e.key === 'ArrowUp') {
                        moveActiveIndexUp()
                    }
                    if (e.key === 'ArrowDown') {
                        moveActiveIndexDown()
                    }
                    if (e.key === 'Escape' || e.key === 'Enter') {
                        setAttachElements(false)
                        toggleOpenClose()
                    }
                }
            },
            {signal: abortController.signal}
        )
        return () => {
            abortController.abort()
        }
    }, [attachElements, childrenLength, toggleOpenClose])

    if (!attachElements && !alwaysMounted) {
        return null
    }

    return (
        <Tag
            className={classes}
            style={{position: 'absolute', zIndex: 1000, ...styles.popper, ...style}}
            {...otherProps}
            {...(attributes.popper || {})}
            // Если так не сделать, то popper неправильно определит своё положение
            // в контейнере когда alwaysMounted = true.
            ref={alwaysMounted && !attachElements ? undefined : setPopperElement}
            tabIndex={-1}
        >
            {children}
        </Tag>
    )
}

export default React.memo(DropdownMenu)
