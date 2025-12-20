import clsx from 'clsx'
import {
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
import {useEventCallback} from '../../helpers/useEventCallback'
import {
    InputUiApi,
    InputUiProps,
} from './InputTypes'

const activeInputLabelSizeMultipliers = {
    normal: 0.9,
    small: 0.9,
    large: 0.9,
}

// Оформление поля ввода.
export function InputUi(props: InputUiProps) {

    const {
        ref,
        labelRef,
        activeInputLabelSizeMultiplier,
        size,
        className,
        invalid,
    } = props

    const middleNotchRef = useRef<HTMLDivElement>(null)

    const updateWidth = useEventCallback(() => {
        if (labelRef.current && middleNotchRef.current) {
            if (labelRef.current && labelRef.current.clientWidth !== 0) {
                let multiplier: number = activeInputLabelSizeMultipliers[size]
                if (
                    activeInputLabelSizeMultiplier
                    && typeof activeInputLabelSizeMultiplier === 'object'
                    && activeInputLabelSizeMultiplier[size]
                ) {
                    multiplier = activeInputLabelSizeMultiplier[size]!
                }
                middleNotchRef.current.style.width = `${(labelRef.current.clientWidth * multiplier) + 8}px`
                observer.disconnect()
            } else {
                middleNotchRef.current.style.width = '80%'
            }
        }
    })

    const observer = useMemo(() => new IntersectionObserver(updateWidth, {
        root: document.body,
        threshold: 0,
    }), [])

    useEffect(() => {
        updateWidth()
    }, [labelRef.current?.clientWidth])

    useEffect(() => {
        if (middleNotchRef.current) {
            const el = middleNotchRef.current
            observer.observe(el)
            return () => {
                observer.unobserve(el)
            }
        }
        return () => {
        }
    }, [middleNotchRef.current])

    return (
        <div
            ref={ref}
            className={clsx(
                'form-notch',
                invalid ? 'invalid' : null,
                className
            )}
        >
            <div className="form-notch-leading" />
            <div
                className="form-notch-middle"
                ref={middleNotchRef}
            />
            <div className="form-notch-trailing" />
        </div>
    )
}
