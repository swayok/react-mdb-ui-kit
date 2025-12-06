import * as PopperJS from '@popperjs/core'
import clsx from 'clsx'
import {
    CSSProperties,
    ReactNode,
    RefObject,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react'
import ReactDOM from 'react-dom'
import {usePopper} from 'react-popper'

export interface TooltipContentProps {
    show: boolean
    containerRef: RefObject<HTMLElement | null>
    title?: string | ReactNode
    placement?: PopperJS.Placement
    options?: Omit<Partial<PopperJS.Options>, 'placement'>
    className?: string
    textClassName?: string
    textStyle?: CSSProperties
    maxWidth?: number
}

// Содержимое всплывающей подсказки.
export function TooltipContent(props: TooltipContentProps) {

    const {
        show,
        containerRef,
        title,
        placement = 'top',
        options,
        className,
        textClassName,
        textStyle = {},
        maxWidth,
    } = props

    // Не useRef() т.к. нужно чтобы usePopper() обновлял стили при изменении.
    const [
        tooltipElement,
        setTooltipElement,
    ] = useState<HTMLDivElement | null>(null)

    // Не нужно монтировать подсказку когда ее не видно.
    // Проблема в том, что нужно дождаться окончания анимации скрытия,
    // чтобы демонтировать подсказку.
    const [
        shouldMount,
        setShouldMount,
    ] = useState<boolean>(show)

    const {
        styles,
        attributes,
    } = usePopper(
        containerRef.current,
        tooltipElement,
        {
            placement,
            ...options,
        }
    )

    // Монтируем подсказку, когда show === true.
    useLayoutEffect(() => {
        console.log({show, shouldMount, tooltipElement})
        if (show) {
            setShouldMount(true)
        }
    }, [show])

    // Управление анимацией через CSS класс 'show'.
    // Если добавлять класс в className, то анимация появления работать не будет.
    useEffect(() => {
        if (!tooltipElement) {
            return
        }
        if (show) {
            tooltipElement.classList.add('show')
        } else {
            tooltipElement.classList.remove('show')
        }
    }, [tooltipElement, show])

    if (!shouldMount) {
        return
    }

    if (maxWidth) {
        textStyle.maxWidth = maxWidth
    }

    return ReactDOM.createPortal(
        <div
            ref={setTooltipElement}
            className={clsx(
                'tooltip fade',
                `bs-tooltip-${placement}`,
                className
            )}
            style={{...styles.popper}}
            {...attributes.popper}
            role="tooltip"
            onTransitionEnd={() => {
                if (!show) {
                    // Демонтируем подсказку при завершении анимации скрытия.
                    setShouldMount(false)
                }
            }}
        >
            <div
                className={clsx('tooltip-inner', textClassName)}
                style={textStyle}
            >
                {title}
            </div>
        </div>,
        document.body
    )
}
