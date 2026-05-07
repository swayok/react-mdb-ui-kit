import clsx from 'clsx'
import {
    type ReactNode,
    type RefObject,
    useRef,
} from 'react'
import {
    CSSTransition,
    SwitchTransition,
} from 'react-transition-group'
import {useMergedRefs} from '../../helpers/useMergedRefs'

interface Props {
    transitionKey: string | boolean | number
    transitionRef?: RefObject<HTMLElement | null>
    // Длительность анимации.
    // По умолчанию: в зависимости от значения свойства animation.
    animationTimeout?: number
    unmountOnExit?: boolean
    mountOnEnter?: boolean
    children: ReactNode | ReactNode[]
    // Тип анимации.
    // По умолчанию: fade.
    // Длительность анимаций по умолчанию: 300 | 200 | 100.
    animation?: 'fade' | 'fade-switch' | 'page-switch'
    // CSS класс для контейнера.
    // Используется только при отсутствии transitionRef.
    className?: string
}

// Анимированная смена children.
export function FadeSwitch(props: Props) {

    const containerRef = useRef<HTMLDivElement>(null)

    const {
        transitionKey,
        unmountOnExit = true,
        mountOnEnter = true,
        transitionRef = containerRef,
        animation = 'fade',
        className,
        children,
        animationTimeout: propsAnimationTimeout,
    } = props

    const mergedRef = useMergedRefs(
        transitionRef,
        containerRef
    )

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={String(transitionKey)}
                classNames={animation}
                timeout={getAnimationTimeout(animation, propsAnimationTimeout)}
                unmountOnExit={unmountOnExit}
                mountOnEnter={mountOnEnter}
                nodeRef={transitionRef}
            >
                {props.transitionRef ? (
                    <>{children}</>
                ) : (
                    <div
                        className={clsx('animated-content-container', className)}
                        ref={mergedRef}
                    >
                        {children}
                    </div>
                )}
            </CSSTransition>
        </SwitchTransition>
    )
}

// Определить длительность анимации.
function getAnimationTimeout(
    animation: Props['animation'],
    propsAnimationTimeout?: number
): number {
    if (propsAnimationTimeout && propsAnimationTimeout > 0) {
        return propsAnimationTimeout
    }
    switch (animation) {
        case 'fade-switch':
            return 100
        case 'page-switch':
            return 200
        default:
            return 300
    }
}
