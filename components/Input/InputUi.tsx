import clsx from 'clsx'
import {
    useEffect,
    useImperativeHandle,
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
        apiRef,
        ref,
        labelRef,
        activeInputLabelSizeMultiplier,
        size,
        className,
        invalid,
    } = props

    const [
        labelNotchWidth,
        setLabelNotchWidth,
    ] = useState<number | string>(0)

    const updateWidth = useEventCallback(() => {
        if (labelRef.current) {
            if (labelRef.current && labelRef.current.clientWidth !== 0) {
                let multiplier: number = activeInputLabelSizeMultipliers[size]
                if (
                    activeInputLabelSizeMultiplier
                    && typeof activeInputLabelSizeMultiplier === 'object'
                    && activeInputLabelSizeMultiplier[size]
                ) {
                    multiplier = activeInputLabelSizeMultiplier[size]!
                }
                setLabelNotchWidth((labelRef.current.clientWidth * multiplier) + 8)
            } else if (labelNotchWidth === 0) {
                setLabelNotchWidth('80%')
                setTimeout(updateWidth, 500)
            }
        } else {
            setLabelNotchWidth(0)
        }
    })

    useImperativeHandle(apiRef, (): InputUiApi => ({
        updateWidth,
    }))

    useEffect(updateWidth, [])

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
                style={{width: labelNotchWidth}}
            />
            <div className="form-notch-trailing" />
        </div>
    )
}
