import React from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'

type Props = {
    transitionKey: string | boolean | number,
    transitionRef?: React.RefObject<HTMLElement>,
    animationTimeout?: number,
    unmountOnExit?: boolean,
    mountOnEnter?: boolean,
    children: React.ReactNode | React.ReactNode[],
}

// Анимированная смена children.
function FadeSwitch(props: Props) {

    const containerRef = React.useRef<HTMLDivElement>(null)

    const {
        transitionKey,
        animationTimeout = 300,
        unmountOnExit = true,
        mountOnEnter = true,
        transitionRef = containerRef,
        children,
    } = props

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={String(transitionKey)}
                classNames="fade"
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
