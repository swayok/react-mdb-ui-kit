import React from 'react'
import {CSSTransition} from 'react-transition-group'

type Props = {
    visible?: boolean,
    transitionRef?: React.RefObject<HTMLElement>,
    animationTimeout?: number,
    unmountOnExit?: boolean,
    mountOnEnter?: boolean,
    children: React.ReactNode | React.ReactNode[],
}

// Анимированное отображение children (fade-in).
function FadeIn(props: Props) {

    const containerRef = React.useRef<HTMLDivElement>(null)

    const {
        visible = true,
        transitionRef = containerRef,
        children,
        unmountOnExit = true,
        mountOnEnter = true,
        animationTimeout = 300,
    } = props

    return (
        <CSSTransition
            in={visible}
            classNames="fade"
            appear
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
    )
}

export default React.memo(FadeIn)
