import React from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'
import clsx from 'clsx'

type Props = {
    transitionKey: string | boolean | number,
    transitionRef?: React.RefObject<HTMLElement>,
    // Длительность анимации.
    // По умолчанию: в зависимости от значения свойства animation.
    animationTimeout?: number,
    unmountOnExit?: boolean,
    mountOnEnter?: boolean,
    children: React.ReactNode | React.ReactNode[],
    // Тип анимации.
    // По умолчанию: fade.
    // Длительность анимаций по умолчанию: 300 | 200 | 100.
    animation?: 'fade' | 'fade-switch' | 'page-switch',
    // CSS класс для контейнера.
    // Используется только при отсутствии transitionRef.
    className?: string,
}

// Анимированная смена children.
export function FadeSwitch(props: Props) {

    const containerRef = React.useRef<HTMLDivElement>(null)

    const {
        transitionKey,
        unmountOnExit = true,
        mountOnEnter = true,
        transitionRef = containerRef,
        animation = 'fade',
        className,
        children,
    } = props

    let animationTimeout: number = props.animationTimeout ?? 300
    if (!props.animationTimeout) {
        switch (animation) {
            case 'fade-switch':
                animationTimeout = 100
                break
            case 'page-switch':
                animationTimeout = 200
                break
        }
    }

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={String(transitionKey)}
                classNames={animation}
                timeout={animationTimeout}
                unmountOnExit={unmountOnExit}
                mountOnEnter={mountOnEnter}
                nodeRef={transitionRef}
            >
                {props.transitionRef ? (
                    <>{children}</>
                ) : (
                    <div
                        className={clsx('animated-content-container', className)}
                        ref={transitionRef as React.RefObject<HTMLDivElement>}
                    >
                        {children}
                    </div>
                )}
            </CSSTransition>
        </SwitchTransition>
    )
}

/** @deprecated */
export default FadeSwitch
