import React from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'

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
}

// Анимированная смена children.
function FadeSwitch(props: Props) {

    const containerRef = React.useRef<HTMLDivElement>(null)

    const {
        transitionKey,
        unmountOnExit = true,
        mountOnEnter = true,
        transitionRef = containerRef,
        animation = 'fade',
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
                        className="animated-content-container"
                        ref={transitionRef as React.RefObject<HTMLDivElement>}
                    >
                        {children}
                    </div>
                )}
            </CSSTransition>
        </SwitchTransition>
    )
}

export default React.memo(FadeSwitch)
