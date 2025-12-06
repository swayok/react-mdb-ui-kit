import * as PopperJS from '@popperjs/core'
import {
    AbstractView,
    CSSProperties,
    MouseEvent as ReactMouseEvent,
    ReactNode,
    TouchEvent,
    useEffect,
    useRef,
    useState,
} from 'react'
import {ComponentPropsWithModifiableTag} from '../types'
import {TooltipContent} from './TooltipContent'

export interface TooltipProps extends Omit<ComponentPropsWithModifiableTag, 'title'> {
    placement?: PopperJS.Placement
    options?: Omit<Partial<PopperJS.Options>, 'placement'>
    title?: string | ReactNode
    tooltipClassName?: string
    tooltipTextClassName?: string
    tooltipStyle?: CSSProperties
    tooltipMaxWidth?: number
    containsInteractiveElements?: boolean
    disableClickHandler?: boolean
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

    const wrapperRef = useRef<HTMLElement>(null)

    const [
        isOpenState,
        setIsOpened,
    ] = useState(false)
    const [
        isClicked,
        setIsClicked,
    ] = useState(false)

    // Было ли последнее взаимодействие осуществлено с помощью touch screen?
    const isTouchEvent = useRef<boolean>(false)

    // Catch touch events and remember it.
    const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
        isTouchEvent.current = true
        onTouchStart?.(e)
    }

    const handleOnMouseEnter = (e: ReactMouseEvent<HTMLElement>) => {
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
        setIsOpened(true)
        onMouseEnter?.(e)
    }

    const handleOnMouseLeave = (e: ReactMouseEvent<HTMLElement>) => {
        isTouchEvent.current = false
        if (disableHover) {
            return
        }
        setIsOpened(false)
        onMouseLeave?.(e)
    }

    // Подписка на события mouseleave.
    useEffect(() => {
        if (disableClickHandler || !title) {
            return
        }
        const abortController = new AbortController()
        if (containsInteractiveElements && wrapperRef.current) {
            const handleOnMouseLeave = (e: MouseEvent) => {
                if (disableHover) {
                    return
                }

                setIsOpened(false)
                const event: ReactMouseEvent<HTMLElement> = {
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
            wrapperRef.current.parentElement?.addEventListener(
                'mouseleave',
                handleOnMouseLeave,
                {signal: abortController.signal}
            )
            wrapperRef.current.parentElement?.parentElement?.addEventListener(
                'mouseleave',
                handleOnMouseLeave,
                {signal: abortController.signal}
            )
        }
        document.addEventListener(
            'mousedown',
            (e: MouseEvent) => {
                if (e.target === wrapperRef.current) {
                    setIsClicked(true)
                } else {
                    setIsClicked(false)
                    setIsOpened(false)
                }
            },
            {signal: abortController.signal}
        )
        return () => {
            abortController.abort()
        }
    }, [wrapperRef.current, containsInteractiveElements])

    if (!title) {
        return (
            <Tag
                ref={wrapperRef}
                {...otherProps}
            >
                {children}
            </Tag>
        )
    }

    return (
        <>
            <Tag
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchStart}
                ref={wrapperRef}
                {...otherProps}
            >
                {children}
            </Tag>

            <TooltipContent
                show={isOpenState || isClicked}
                containerRef={wrapperRef}
                title={title}
                placement={placement}
                options={options}
                className={tooltipClassName}
                textClassName={tooltipTextClassName}
                textStyle={tooltipStyle}
                maxWidth={tooltipMaxWidth}
            />
        </>
    )
}

/** @deprecated */
export default Tooltip
