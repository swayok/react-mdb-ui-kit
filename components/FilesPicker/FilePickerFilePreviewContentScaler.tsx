import clsx from 'clsx'
import React, {AllHTMLAttributes} from 'react'

interface Props extends AllHTMLAttributes<HTMLAnchorElement> {
    scaleImageOnHover?: boolean
}

export const FilePickerFilePreviewContentScaler = React.memo(function FilePickerFilePreviewContentContainer(props: Props) {

    const {
        children,
        scaleImageOnHover,
        onClick,
        onFocus,
        onBlur,
        onMouseLeave,
        className,
        ...otherProps
    } = props

    if (!scaleImageOnHover) {
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <a
            className={clsx(
                'file-picker-preview-scaler position-relative z-index-1 cursor-default',
                'd-flex flex-row align-items-start justify-content-start',
                className
            )}
            href="#"
            onClick={e => {
                e.preventDefault()
                // Scale toggle картинки для touch-устройств.
                if (e.currentTarget.parentElement?.parentElement?.classList.contains('active')) {
                    e.currentTarget.blur()
                } else {
                    e.currentTarget.focus()
                }

                onClick?.(e)
            }}
            onFocus={e => {
                // Scale up картинки для touch-устройств.
                e.currentTarget.parentElement?.parentElement?.classList.add('active')
                onFocus?.(e)
            }}
            onBlur={e => {
                // Scale down картинки для touch-устройств.
                e.currentTarget.parentElement?.parentElement?.classList.remove('active')
                onBlur?.(e)
            }}
            onMouseLeave={e => {
                // Scale down картинки для touch-устройств.
                e.currentTarget.parentElement?.parentElement?.classList.remove('active')
                onMouseLeave?.(e)
            }}
            {...otherProps}
        >
            {children}
        </a>
    )
})
