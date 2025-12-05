import {
    ReactNode,
    RefObject,
    useRef,
} from 'react'
import {CSSTransition} from 'react-transition-group'

interface Props {
    visible?: boolean
    long?: boolean
    transitionRef?: RefObject<HTMLElement | null>
    animationTimeout?: number
    unmountOnExit?: boolean
    mountOnEnter?: boolean
    children: ReactNode | ReactNode[]
}

// Анимированное отображение children (fade-in).
export function FadeIn(props: Props) {

    const containerRef = useRef<HTMLDivElement>(null)

    const {
        visible = true,
        long = false,
        transitionRef = containerRef,
        children,
        unmountOnExit = true,
        mountOnEnter = true,
        animationTimeout = long ? 600 : 300,
    } = props

    return (
        <CSSTransition
            in={visible}
            classNames={long ? 'fade-long' : 'fade'}
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
                    ref={transitionRef as RefObject<HTMLDivElement>}
                >
                    {children}
                </div>
            )}
        </CSSTransition>
    )
}

/** @deprecated */
export default FadeIn
