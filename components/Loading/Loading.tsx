import clsx from 'clsx'
import {
    type CSSProperties,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'
import {CSSTransition} from 'react-transition-group'

export interface LoadingProps {
    loading: boolean
    overlayColor?: 'solid-default' | 'solid-white' | 'semitransparent-default' | 'semitransparent-white'
    overlayFillsParent?: boolean
    className?: string
    indicatorClassName?: string
    floating?: boolean
    style?: CSSProperties
    label?: string | ReactNode
    labelClassName?: string
    // Отложить отображение анимации на указанное кол-во миллисекунд.
    showDelay?: number | null
}

// Индикатор загрузки.
export function Loading(props: LoadingProps) {

    const {
        loading,
        overlayColor,
        overlayFillsParent,
        className,
        indicatorClassName,
        floating,
        style,
        label,
        labelClassName,
        showDelay,
    } = props

    const [
        showOverlay,
        setShowOverlay,
    ] = useState<boolean>(false)
    const [
        showSpinner,
        setShowSpinner,
    ] = useState<boolean>(false)

    const outerTransitionRef = useRef<HTMLDivElement>(null)
    const innerTransitionRef = useRef<HTMLDivElement>(null)

    // Отображение анимации загрузки.
    useEffect(() => {
        setShowOverlay(loading)
        if (loading && showDelay && showDelay > 0) {
            const timeoutId = window.setTimeout(() => {
                setShowSpinner(loading)
            }, showDelay)
            return () => {
                window.clearTimeout(timeoutId)
            }
        } else {
            setShowSpinner(loading)
            return () => {
            }
        }
    }, [loading, showDelay])

    return (
        <CSSTransition
            in={showOverlay}
            classNames="loading-indicator"
            timeout={500}
            mountOnEnter
            unmountOnExit
            nodeRef={outerTransitionRef}
        >
            <div
                className={clsx(
                    'loading-indicator-overlay',
                    overlayColor ? 'with-background' : null,
                    overlayColor,
                    overlayFillsParent ? 'fill-parent' : null,
                    floating ? 'floating' : null,
                    className
                )}
                style={style}
                ref={outerTransitionRef}
            >
                <CSSTransition
                    in={showSpinner}
                    classNames="loading-indicator-spinner"
                    timeout={500}
                    mountOnEnter
                    unmountOnExit
                    nodeRef={innerTransitionRef}
                >
                    <div
                        ref={innerTransitionRef}
                        className={clsx(
                            'loading-indicator',
                            indicatorClassName
                        )}
                    >
                        <div className="loading-indicator-spinner-container">
                            <div className="loading-indicator-spinner" />
                        </div>
                        {label && (
                            <div className={clsx('loading-indicator-label', labelClassName)}>
                                {label}
                            </div>
                        )}
                    </div>
                </CSSTransition>
            </div>
        </CSSTransition>
    )
}
