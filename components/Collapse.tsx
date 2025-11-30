import clsx from 'clsx'
import {
    RefObject,
    useEffectEvent,
    useLayoutEffect,
    useMemo,
    useRef,
} from 'react'
import {ComponentPropsWithModifiableTag} from 'swayok-react-mdb-ui-kit/types/Common'
import {getCssTransitionDuration} from '../helpers/getCssTransitionDuration'

export interface CollapseProps extends Omit<ComponentPropsWithModifiableTag, 'onTransitionEnd'> {
    navbar?: boolean
    show: boolean
    // Использовать горизонтальное скрытие?
    horizontal?: boolean
    // Если true и show === true, то содержимое отображается без анимации открытия.
    // Если false и show === true, то содержимое отображается с анимацией открытия.
    showImmediately?: boolean
    // Ссылка на контейнер компонента.
    wrapperRef?: RefObject<HTMLElement>
    // Функция, вызываемая при завершении анимации.
    onTransitionEnd?: (opened: boolean, ref: null | HTMLElement) => void
    // Добавляет CSS класс d-block чтобы компонент не скрывался через {display: 'none'}.
    // Может пригодится, если подряд расположено несколько Collapse компонентов.
    alwaysMounted?: boolean
}

// Анимированное отображение данных (вертикальная/горизонтальная slide open/close анимация).
export function Collapse(props: CollapseProps) {
    const {
        className,
        horizontal = false,
        children,
        show,
        showImmediately,
        id,
        navbar,
        wrapperRef,
        onTransitionEnd: propsOnTransitionEnd,
        alwaysMounted,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const localRef = useRef<HTMLElement>(null)
    const containerRef = wrapperRef ?? localRef
    const isRenderedOnce = useRef<boolean>(false)
    const cssProperty: 'width' | 'height' = horizontal ? 'width' : 'height'

    // Задать ширину/высоту элемента == ширине/высоте содержимого.
    const updateContentSize = (el: HTMLElement) => {
        el.style[cssProperty] = ((cssProperty === 'width' ? el.scrollWidth : el.scrollHeight) || '0') + 'px'
    }

    const onTransitionEnd = useEffectEvent(
        (opened: boolean, ref: null | HTMLElement) => {
            propsOnTransitionEnd?.(opened, ref)
        },
    )

    // Подписываемся на отслеживание размеров содержимого.
    useLayoutEffect(() => {
        if (containerRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                if (
                    containerRef.current?.classList.contains('opened')
                ) {
                    updateContentSize(containerRef.current)
                }
            })
            resizeObserver.observe(containerRef.current)
            return () => {
                resizeObserver.disconnect()
            }
        }
        return () => {
        }
    }, [containerRef.current])

    // Обработка изменения свойства show.
    useLayoutEffect(() => {
        if (!containerRef.current) {
            return
        }

        const container: HTMLElement = containerRef.current
        const isFirstRender: boolean = !isRenderedOnce.current
        isRenderedOnce.current = true

        // Проверяем включена ли анимация.
        const cssTransitionDuration = getCssTransitionDuration(container, cssProperty)
        if (cssTransitionDuration <= 0) {
            // Анимация отключена, просто показываем или скрываем содержимое.
            container.classList.remove('transition')
            if (show) {
                container.style[cssProperty] = 'auto'
                container.classList.add('opened')
                container.classList.remove('closed')
            } else {
                container.style[cssProperty] = '0'
                container.classList.add('closed')
                container.classList.remove('opened')
            }
            onTransitionEnd(show, container)
            return
        }

        let timeoutId: number | undefined = undefined

        if (isFirstRender) {
            container.style[cssProperty] = '0'
        }

        // Анимация включена.
        // Нельзя тут использовать событие ontransitionend, т.к. в случае когда внутри
        // этого Collapse есть другой Collapse или компонент с анимацией, то при
        // закрытии этого Collapse событие ontransitionend вызывается 2 раза - в начале
        // анимации и в конце (похоже баг браузера или кривая особенность).
        // В итоге получаем дерганую анимацию и 2 раза вызов props.onTransitionEnd.
        if (show) {
            // Открытие.
            if (isFirstRender && showImmediately) {
                // Первое отображение и не требуется анимация открытия.
                container.classList.remove('transition', 'closed')
                container.classList.add('opened')
            } else {
                container.classList.remove('closed')
                container.classList.add('transition', 'opened')
            }
            timeoutId = window.setTimeout(() => {
                container.classList.remove('transition')
                timeoutId = undefined
                onTransitionEnd(true, container)
            }, cssTransitionDuration + 10)
            // Нужно высоту менять после изменения container.classList, а это невозможно
            // сделать без тайм-аута.
            setTimeout(() => {
                updateContentSize(container)
            })
        } else {
            // Закрытие.
            if (isFirstRender) {
                container.classList.add('closed')
                container.classList.remove('transition', 'opened')
            } else {
                container.classList.remove('opened')
                container.classList.add('transition', 'closed')
                timeoutId = window.setTimeout(() => {
                    container.classList.remove('transition')
                    timeoutId = undefined
                    onTransitionEnd(false, container)
                }, cssTransitionDuration + 10)
            }
            // Нужно высоту менять после изменения container.classList, а это невозможно
            // сделать без тайм-аута.
            setTimeout(() => {
                container.style[cssProperty] = '0'
            }, 0)
        }

        return () => {
            clearTimeout(timeoutId)
        }
    }, [show])

    const classNames = useMemo(() => clsx(
        'collapsible',
        horizontal ? 'horizontal' : 'vertical',
        navbar ? 'navbar-collapse' : null,
        alwaysMounted ? 'd-block' : null,
        className,
    ), [className, horizontal, navbar, alwaysMounted])

    return (
        <Tag
            id={id}
            className={classNames}
            {...otherProps}
            ref={containerRef}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default Collapse
