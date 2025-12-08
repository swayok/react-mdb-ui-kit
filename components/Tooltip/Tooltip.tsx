import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react'
import clsx from 'clsx'
import {
    RefObject,
    useEffect,
    useEffectEvent,
    useState,
} from 'react'
import {useMergedRefs} from '../../helpers/useMergedRefs'
import {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {TooltipProps} from './TooltipTypes'

// Всплывающая подсказка.
export function Tooltip<InjectedComponentProps extends object = HtmlComponentProps>(
    props: MergedComponentProps<TooltipProps, InjectedComponentProps>
) {
    const {
        children,
        tag: Tag = 'div',
        placement = 'top',
        title,
        disableClickHandler,
        disableHover,
        ref,
        // Свойства для подсказки.
        tooltipClassName,
        tooltipTextClassName,
        tooltipStyle = {},
        tooltipMaxWidth,
        tooltipOffset = 4,
        tooltipRole = 'tooltip',
        ...otherProps
    } = props

    const [
        isOpened,
        setIsOpened,
    ] = useState(false)

    // Не нужно монтировать подсказку когда ее не видно.
    // Проблема в том, что нужно дождаться окончания анимации скрытия,
    // чтобы демонтировать подсказку.
    const [
        shouldMount,
        setShouldMount,
    ] = useState<boolean>(isOpened)

    const {refs, floatingStyles, context} = useFloating<HTMLElement>({
        open: isOpened,
        onOpenChange(open) {
            setIsOpened(open)
            if (open) {
                // Монтируем подсказку, когда open === true.
                setShouldMount(true)
            }
        },
        middleware: [offset(tooltipOffset), flip(), shift()],
        whileElementsMounted: autoUpdate,
        placement,
    })

    const hover = useHover(context, {
        enabled: !disableHover,
        move: false,
    })
    const focus = useFocus(context)
    const click = useClick(context, {
        enabled: !disableClickHandler,
    })
    const dismiss = useDismiss(context)
    const role = useRole(context, {role: tooltipRole})
    // todo: add useTransition

    // Merge all the interactions into prop getters
    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
        focus,
        dismiss,
        role,
        click,
    ])

    const togglerRef = useMergedRefs(
        ref,
        refs.setReference
    )

    const tooltipRef = refs.floating as RefObject<HTMLElement | null>

    // Обработчик окончания CSS анимации.
    const onCssTransitionEnd = useEffectEvent(() => {
        if (!isOpened) {
            // Демонтируем подсказку при завершении анимации скрытия.
            setShouldMount(false)
        }
    })

    // Управление анимацией через CSS класс 'show'.
    // Если добавлять класс в className, то анимация появления работать не будет.
    useEffect(() => {
        if (!tooltipRef.current) {
            return
        }
        if (isOpened) {
            tooltipRef.current.classList.add('show')
        } else {
            tooltipRef.current.classList.remove('show')
        }
    }, [tooltipRef.current, isOpened])

    if (!title) {
        return (
            <Tag
                ref={ref}
                {...otherProps}
            >
                {children}
            </Tag>
        )
    }

    return (
        <>
            <Tag
                ref={togglerRef}
                {...getReferenceProps(otherProps)}
            >
                {children}
            </Tag>

            {shouldMount && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps({
                            onTransitionEnd: onCssTransitionEnd,
                            className: clsx(
                                'tooltip fade',
                                `bs-tooltip-${placement}`
                            ),
                        })}
                    >
                        <div
                            className={clsx('tooltip-inner', tooltipTextClassName)}
                            style={{
                                ...tooltipStyle,
                                ...(tooltipMaxWidth ? {maxWidth: tooltipMaxWidth} : {}),
                            }}
                        >
                            {title}
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </>
    )
}

/** @deprecated */
export default Tooltip
