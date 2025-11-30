import React, {AbstractView, CSSProperties, useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import {usePopper} from 'react-popper'
import * as PopperJS from '@popperjs/core'
import {ComponentPropsWithModifiableTag} from 'swayok-react-mdb-ui-kit/types/Common'

export interface TooltipProps extends Omit<ComponentPropsWithModifiableTag, 'title'> {
    placement?: PopperJS.Placement,
    options?: Omit<Partial<PopperJS.Options>, 'placement'>,
    title?: string | React.ReactNode,
    tooltipClassName?: string,
    tooltipTextClassName?: string,
    tooltipStyle?: CSSProperties,
    tooltipMaxWidth?: number,
    containsInteractiveElements?: boolean,
    disableClickHandler?: boolean,
    disableHover?: boolean
}

// Всплывающая подсказка.
export function Tooltip<PropsType>(props: TooltipProps & PropsType) {

    const {
        children,
        tag: Tag = 'div',
        options,
        placement = 'top',
        title,
        onMouseEnter,
        onMouseLeave,
        onTouchStart,
        tooltipClassName,
        tooltipTextClassName,
        tooltipStyle = {},
        tooltipMaxWidth,
        containsInteractiveElements,
        disableClickHandler,
        disableHover,
        ...otherProps
    } = props

    //< do not use useRef() because props.tag can be functional component with forwarded ref
    const [
        referenceElement,
        setReferenceElement,
    ] = useState<HTMLElement | null>(null)
    const [
        popperElement,
        setPopperElement,
    ] = useState<HTMLDivElement | null>(null)

    const [
        isOpenState,
        setIsOpenState,
    ] = useState(false)
    const [
        isClicked,
        setIsClicked,
    ] = useState(false)
    const [
        isFaded,
        setIsFaded,
    ] = useState(false)
    const [
        isReadyToHide,
        setIsReadyToHide,
    ] = useState(false)

    // Было ли последнее взаимодействие осуществлено с помощью touch screen?
    const isTouchEvent = useRef<boolean>(false)

    const tooltipClasses = clsx(
        'tooltip fade',
        isFaded ? 'show' : null,
        `bs-tooltip-${placement}`,
        tooltipClassName
    )

    const {styles, attributes} = usePopper(referenceElement, popperElement, {
        placement,
        ...options,
    })

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>
        let secondTimer: ReturnType<typeof setTimeout>

        if (isOpenState || isClicked) {
            setIsReadyToHide(true)
            timer = setTimeout(() => {
                setIsFaded(true)
            }, 4)
        } else {
            setIsFaded(false)

            secondTimer = setTimeout(() => {
                setIsReadyToHide(false)
            }, 300)
        }
        return () => {
            clearTimeout(timer)
            clearTimeout(secondTimer)
        }
    }, [isOpenState, isClicked])

    // Catch touch events and remember it.
    const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
        isTouchEvent.current = true
        onTouchStart?.(e)
    }

    const handleOnMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        if (
            disableHover
            // There is a problem when the tooltip is clicked by touch event,
            // but the click handler is disabled: the tooltip remains always visible.
            || (isTouchEvent.current && disableClickHandler)
        ) {
            isTouchEvent.current = false
            return
        }

        isTouchEvent.current = false
        setIsOpenState(true)
        onMouseEnter?.(e)
    }

    const handleOnMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        isTouchEvent.current = false
        if (disableHover) {
            return
        }
        setIsOpenState(false)
        onMouseLeave?.(e)
    }

    useEffect(() => {
        if (disableClickHandler) {
            return
        }
        const abortController = new AbortController()
        if (containsInteractiveElements && referenceElement) {
            const handleOnMouseLeave = (e: MouseEvent) => {
                if (disableHover) {
                    return
                }

                setIsOpenState(false)
                const event: React.MouseEvent<HTMLElement> = {
                    ...e,
                    nativeEvent: e,
                    isDefaultPrevented(): boolean {
                        return e.defaultPrevented
                    },
                    isPropagationStopped(): boolean {
                        return false
                    },
                    persist(): void {
                    },
                    view: e.view as unknown as AbstractView,
                    currentTarget: e.target as HTMLElement,
                    target: e.target as HTMLElement,
                }
                onMouseLeave?.(event)
            }
            referenceElement.parentElement?.addEventListener(
                'mouseleave',
                handleOnMouseLeave,
                {signal: abortController.signal}
            )
            referenceElement.parentElement?.parentElement?.addEventListener(
                'mouseleave',
                handleOnMouseLeave,
                {signal: abortController.signal}
            )
        }
        document.addEventListener(
            'mousedown',
            (e: MouseEvent) => {
                if (e.target === referenceElement) {
                    setIsClicked(true)
                } else {
                    setIsClicked(false)
                    setIsOpenState(false)
                }
            },
            {signal: abortController.signal}
        )
        return () => {
            abortController.abort()
        }
    }, [referenceElement, containsInteractiveElements])

    if (!title) {
        return (
            <Tag
                ref={referenceElement}
                {...otherProps}
            >
                {children}
            </Tag>
        )
    }

    if (tooltipMaxWidth) {
        tooltipStyle.maxWidth = tooltipMaxWidth
    }

    return (
        <>
            <Tag
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchStart}
                ref={setReferenceElement}
                {...otherProps}
            >
                {children}
            </Tag>

            {isReadyToHide && ReactDOM.createPortal(
                <div
                    ref={setPopperElement}
                    className={tooltipClasses}
                    style={{...styles.popper}}
                    {...attributes.popper}
                    role="tooltip"
                >
                    <div
                        className={clsx('tooltip-inner', tooltipTextClassName)}
                        style={tooltipStyle}
                    >
                        {title}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

/** @deprecated */
export default Tooltip
