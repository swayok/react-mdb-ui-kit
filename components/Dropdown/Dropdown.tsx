import clsx from 'clsx'
import React, {useId, useLayoutEffect, useState} from 'react'
import DropdownContext, {DropdownOpenState} from './DropdownContext'
import {usePopper} from 'react-popper'
import * as PopperJS from '@popperjs/core'
import {ComponentPropsWithModifiableTag} from '../../types/Common'
import withStable from '../../helpers/withStable'

export interface DropdownProps extends Omit<ComponentPropsWithModifiableTag, 'open'> {
    group?: boolean,
    isOpen?: boolean,
    dropup?: boolean,
    dropright?: boolean,
    dropleft?: boolean,
    options?: PopperJS.Options,
    animation?: boolean,
    openingAnimationDuration?: number,
    closingAnimationDuration?: number,
    selectFirstOnOpen?: boolean,
    offset?: number | [number, number],
    positioningContainer?: 'toggler' | 'wrapper'
    placement?: PopperJS.Placement,

    // Закрывать меню при клике вне его.
    // По умолчанию: true,
    closeOnClickOutside?: boolean,
    // Вызывается при клике вне выпадающего меню, даже если closeOnClickOutside === false.
    onClickOutside?: (event: MouseEvent) => void,
    // Закрывать меню при прокрутке вне его.
    // По умолчанию: false,
    closeOnScrollOutside?: boolean,
    // Вызывается при прокрутке вне выпадающего меню, даже если closeOnClickOutside === false.
    onScrollOutside?: (event: Event) => void,
    // Начало открытия выпадающего меню.
    // Функция close может его закрыть по требованию внешнего компонента.
    onOpen?: (close: () => void) => void,
    onOpened?: () => void,
    onClose?: (clickedOutside?: boolean) => void,
    onClosed?: () => void,
}

// Контейнер выпадающего меню. Создает контекст доступный компонентам внутри.
function Dropdown(props: DropdownProps) {
    const {
        className,
        tag: Tag = 'div',
        group,
        isOpen,
        closeOnClickOutside = true,
        onClickOutside,
        closeOnScrollOutside = false,
        onScrollOutside,
        children,
        dropup,
        dropright,
        dropleft,
        options,
        offset,
        animation = true,
        placement,
        positioningContainer = 'toggler',
        selectFirstOnOpen = true,
        disabled,
        onOpen,
        onOpened,
        onClose,
        onClosed,
        openingAnimationDuration = 400,
        closingAnimationDuration = 200,
        ...otherProps
    } = props

    const [
        currentOpenState,
        setCurrentOpenState,
    ] = useState<DropdownOpenState>('closed')
    const [
        animationTimer,
        setAnimationTimer,
    ] = useState<number | null>()
    // const [isFadeIn, setIsFadeIn] = useState(false);
    // const [isFadeOut, setIsFadeOut] = useState(false);
    const [
        referenceElement,
        setReferenceElement,
    ] = useState<HTMLElement | null>(null)
    const [
        wrapperReferenceElement,
        setWrapperReferenceElement,
    ] = useState<HTMLElement | null>(null)
    const [
        popperElement,
        setPopperElement,
    ] = useState<HTMLElement | null>(null)
    const [
        isPlacement,
        setIsPlacement,
    ] = useState(placement)
    const [
        activeIndex,
        setActiveIndex,
    ] = useState<number | null>(null)
    const [
        itemsCount,
        setItemsCount,
    ] = useState<number>(0)
    // Контроль активности всех вложенных DropdownItem, DropdownLink и DropdownButton.
    const [
        isAllItemsDisabled,
        setIsAllItemsDisabled,
    ] = useState<boolean>(false)

    // Идентификатор выпадающего меню.
    const id: string = useId()

    const isManaged: boolean = isOpen !== undefined

    useLayoutEffect(() => {
        if (dropup) {
            setIsPlacement(dropleft === true ? 'top-end' : 'top-start')
        } else if (dropright) {
            setIsPlacement('right-start')
        } else if (dropleft) {
            setIsPlacement('left-start')
        } else {
            setIsPlacement(placement ?? 'bottom-start')
        }
    }, [dropleft, dropright, dropup, placement])

    const popperModifiers: PopperJS.Modifier<unknown, object>[] = [PopperJS.flip]
    if (offset) {
        popperModifiers.push({...PopperJS.offset, options: {offset: Array.isArray(offset) ? offset : [0, offset]}})
    }

    const {styles, attributes} = usePopper(
        positioningContainer === 'wrapper' ? wrapperReferenceElement : referenceElement,
        popperElement,
        {
            placement: isPlacement,
            modifiers: popperModifiers,
            ...options,
        }
    )

    // Внешний контроль видимости выпадающего меню.
    useLayoutEffect(() => {
        if (isOpen === undefined) {
            return
        }
        if (isOpen) {
            if (!isOpened(currentOpenState)) {
                setCurrentOpenState('open')
            }
        } else {
            if (!isClosed(currentOpenState)) {
                setCurrentOpenState('close')
            }
        }
    }, [isOpen])

    useLayoutEffect(
        () => {
            const abortController = new AbortController()
            const handleEvent = (target: Node): boolean => {
                const dropdownElement = positioningContainer === 'wrapper' ? wrapperReferenceElement : referenceElement
                if (popperElement && currentOpenState && dropdownElement) {
                    if (
                        !popperElement.contains(target)
                        && !dropdownElement.contains(target)
                        && !isClosed(currentOpenState)
                    ) {
                        const isToggler = (target as HTMLElement).className.match(
                            /(^|\s)dropdown-toggle($|\s)/)
                        if (!isToggler || (target as HTMLElement).getAttribute('data-id') != id) {
                            if (closeOnClickOutside) {
                                if (isManaged && onClose) {
                                    onClose(true)
                                } else {
                                    setCurrentOpenState('close')
                                }
                            }
                            return true
                        }
                    }
                }
                return false
            }
            if (closeOnClickOutside || onClickOutside) {
                document.addEventListener(
                    'mousedown',
                    (event: MouseEvent) => {
                        if (handleEvent(event.target as Node) && onClickOutside) {
                            onClickOutside(event)
                        }
                    },
                    {signal: abortController.signal}
                )
            }
            if (closeOnScrollOutside) {
                document.addEventListener(
                    'scroll',
                    (event: Event) => {
                        if (handleEvent(event.target as Node) && onScrollOutside) {
                            onScrollOutside(event)
                        }
                    },
                    {signal: abortController.signal}
                )
            }
            return () => {
                abortController.abort()
            }
        },
        [
            closeOnClickOutside,
            closeOnScrollOutside,
            currentOpenState,
            popperElement,
            referenceElement,
            wrapperReferenceElement,
            id,
            isManaged,
            onClose,
            onClickOutside,
        ]
    )

    useLayoutEffect(() => {
        if (currentOpenState) {
            setActiveIndex(selectFirstOnOpen ? 1 : null)
        }
    }, [selectFirstOnOpen, currentOpenState])

    useLayoutEffect(() => {
        if (disabled && !isClosed(currentOpenState)) {
            if (isManaged && onClose) {
                onClose()
            } else {
                setCurrentOpenState('close')
            }
        }
    }, [disabled])

    useLayoutEffect(() => {
        if (currentOpenState !== 'close' && currentOpenState !== 'open') {
            // we only act when state is 'open' or 'close'.
            return
        }
        if (animationTimer) {
            // clear active timeout
            clearTimeout(animationTimer)
            setAnimationTimer(null)
        }
        // let timer: ReturnType<typeof setTimeout>;
        // let secondTimer: ReturnType<typeof setTimeout>;

        if (currentOpenState === 'open') {
            // we need to open closed dropdown
            if (!isManaged) {
                onOpen?.((): void => {
                    if (isOpened(currentOpenState)) {
                        setCurrentOpenState('close')
                    }
                })
            }
            if (animation) {
                setCurrentOpenState('opening')
                setAnimationTimer(window.setTimeout(() => {
                    setCurrentOpenState('opened')
                    onOpened?.()
                }, openingAnimationDuration))
            } else {
                window.setTimeout(() => {
                    setCurrentOpenState('opened')
                    onOpened?.()
                }, 30)
            }
        } else {
            if (!isManaged) {
                onClose?.()
            }
            if (animation) {
                setCurrentOpenState('closing')
                setAnimationTimer(window.setTimeout(() => {
                    setCurrentOpenState('closed')
                    onClosed?.()
                }, closingAnimationDuration))
            } else {
                window.setTimeout(() => {
                    setCurrentOpenState('closed')
                    onClosed?.()
                }, 30)
            }
        }
    }, [currentOpenState])

    const toggleOpenClose = (): void => {
        if (!disabled) {
            const opened = isOpened(currentOpenState)
            if (isManaged && ((opened && onClose) || (!opened && onOpen))) {
                if (opened && onClose) {
                    onClose()
                } else if (onOpen) {
                    onOpen(onClose ?? (() => setCurrentOpenState('close')))
                }
            } else {
                setCurrentOpenState(opened ? 'close' : 'open')
            }
        }
    }

    const handleClose = (): void => {
        if (isManaged) {
            if (isOpened(currentOpenState) && !disabled) {
                if (isManaged && onClose) {
                    onClose()
                } else {
                    setCurrentOpenState('close')
                }
            }
        }
    }

    const classes = clsx(
        group ? 'btn-group' : 'dropdown',
        dropup && 'dropup',
        dropright && 'dropend',
        dropleft && 'dropstart',
        className
    )

    return (
        <DropdownContext.Provider
            value={{
                id,
                animation,
                handleClose,
                toggleOpenClose,
                isOpened: isOpened(currentOpenState),
                isAnimationActive: currentOpenState === 'opening' || currentOpenState === 'closing',
                isVisible: currentOpenState != 'closed',
                setReferenceElement,
                setPopperElement,
                styles,
                attributes,
                activeIndex,
                setActiveIndex,
                moveActiveIndexUp() {
                    setActiveIndex((activeIndex: null | number) => {
                        let nextIndex = activeIndex === null ? 0 : activeIndex - 1
                        if (nextIndex <= 0) {
                            nextIndex = itemsCount
                        }
                        return nextIndex
                    })
                },
                moveActiveIndexDown() {
                    setActiveIndex((activeIndex: null | number) => {
                        let nextIndex = activeIndex === null ? 1 : activeIndex + 1
                        if (nextIndex > itemsCount) {
                            nextIndex = 1
                        }
                        return nextIndex
                    })
                },
                itemsCount,
                increment() {
                    return new Promise(resolve => {
                        setItemsCount((itemsCount: number) => {
                            const newItemsCount = (itemsCount < 0) ? 1 : itemsCount + 1
                            resolve(newItemsCount)
                            return newItemsCount
                        })
                    })
                },
                decrement() {
                    return new Promise(resolve => {
                        setItemsCount((itemsCount: number) => {
                            const newItemsCount = (itemsCount <= 0) ? 0 : itemsCount - 1
                            resolve(newItemsCount)
                            return newItemsCount
                        })
                    })
                },
                isAllItemsDisabled,
                setIsAllItemsDisabled,
            }}
        >
            <Tag
                className={classes}
                {...otherProps}
                ref={setWrapperReferenceElement}
            >
                {children}
            </Tag>
        </DropdownContext.Provider>
    )
}

function isOpened(state: DropdownOpenState): boolean {
    return ['open', 'opening', 'opened'].includes(state)
}

function isClosed(state: DropdownOpenState): boolean {
    return ['close', 'closing', 'closed'].includes(state)
}

export default withStable<DropdownProps>(
    ['onOpen', 'onClose', 'onOpened', 'onClosed'],
    Dropdown
)
