import React, {CSSProperties, useEffect, useState} from 'react'
import {CSSTransition} from 'react-transition-group'
import clsx from 'clsx'

export interface LoadingProps {
    loading: boolean,
    overlayColor?: 'solid-default' | 'solid-white' | 'semitransparent-default' | 'semitransparent-white',
    overlayFillsParent?: boolean,
    className?: string,
    indicatorClassName?: string,
    floating?: boolean,
    style?: CSSProperties,
    label?: string | React.ReactNode,
    showDelay?: number | null
}

// Индикатор загрузки.
function Loading(props: LoadingProps) {

    const [
        showOverlay,
        setShowOverlay,
    ] = useState<boolean>(false)
    const [
        showSpinner,
        setShowSpinner,
    ] = useState<boolean>(false)
    const [
        spinnerTimeoutId,
        setSpinnerTimeoutId,
    ] = useState<number | null>(null)

    const outerTransitionRef = React.useRef<HTMLDivElement>(null)
    const innerTransitionRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        setShowOverlay(props.loading)
        if (props.loading && props.showDelay) {
            setSpinnerTimeoutId(
                window.setTimeout(() => {
                    setShowSpinner(props.loading)
                    setSpinnerTimeoutId(null)
                }, props.showDelay)
            )
        } else {
            if (spinnerTimeoutId) {
                window.clearTimeout(spinnerTimeoutId)
            }
            setSpinnerTimeoutId(null)
            setShowSpinner(props.loading)
        }
        return () => {
            if (spinnerTimeoutId) {
                window.clearTimeout(spinnerTimeoutId)
            }
            setSpinnerTimeoutId(null)
        }
    }, [props.loading, props.showDelay])

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
                    props.overlayColor ? 'with-background' : null,
                    props.overlayColor,
                    props.overlayFillsParent ? 'fill-parent' : null,
                    props.floating ? 'floating' : null,
                    props.className
                )}
                style={props.style}
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
                            props.indicatorClassName
                        )}
                    >
                        <div className="loading-indicator-spinner-container">
                            <div className="loading-indicator-spinner"/>
                        </div>
                        {props.label && (
                            <div className="loading-indicator-label">
                                {props.label}
                            </div>
                        )}
                    </div>
                </CSSTransition>
            </div>
        </CSSTransition>
    )
}

export default React.memo(Loading)
