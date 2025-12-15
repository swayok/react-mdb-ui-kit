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
    ReactNode,
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

interface Props extends Omit<TooltipProps, 'title'> {
    title: string | ReactNode
}

// Всплывающая подсказка.
export function TooltipWithTitle<InjectedComponentProps extends object = HtmlComponentProps>(
    props: MergedComponentProps<Props, InjectedComponentProps>
) {
    const {
        children,
        tag: Tag = 'div',
        tooltipPlacement = 'top',
        title,
        tooltipDisableClickHandler,
        tooltipDisableHover,
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

    // Не нужно монтировать подсказку когда она спрятана.
    // Проблема в том, что нужно дождаться окончания анимации скрытия,
    // чтобы демонтировать подсказку.
    const [
        shouldMount,
        setShouldMount,
    ] = useState<boolean>(isOpened)

    // Настройки всплывающей подсказки.
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
        placement: tooltipPlacement,
    })

    // Ref для компонента-триггера.
    const togglerRef = useMergedRefs(
        ref,
        refs.setReference
    )

    // Настройка взаимодействий.
    const hover = useHover(context, {
        enabled: !tooltipDisableHover,
        move: false,
    })
    const focus = useFocus(context)
    const click = useClick(context, {
        enabled: !tooltipDisableClickHandler,
    })
    const dismiss = useDismiss(context)
    const role = useRole(context, {role: tooltipRole})

    // Задаем все взаимодействия и получаем функции генерации свойств для триггера и подсказки.
    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
        focus,
        dismiss,
        role,
        click,
    ])

    // Настройка анимаций.

    // Обработчик окончания CSS анимации.
    const onCssTransitionEnd = useEffectEvent(() => {
        if (!isOpened) {
            // Демонтируем подсказку при завершении анимации скрытия.
            setShouldMount(false)
        }
    })

    const tooltipRef = refs.floating as RefObject<HTMLElement | null>
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
                                `bs-tooltip-${tooltipPlacement}`
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
