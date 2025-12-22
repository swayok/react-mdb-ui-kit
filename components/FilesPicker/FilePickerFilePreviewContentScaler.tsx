import clsx from 'clsx'
import {FileAPISelectedFileInfo} from '../../helpers/file_api/FileAPI'
import {HtmlComponentProps} from '../../types'

interface Props extends HtmlComponentProps<HTMLAnchorElement> {
    file: FileAPISelectedFileInfo
    scaleImageOnHover?: boolean
}

// Увеличитель размера картинки предпросмотра.
export function FilePickerFilePreviewContentScaler(props: Props) {

    const {
        file,
        children,
        scaleImageOnHover,
        onClick,
        onFocus,
        onBlur,
        onMouseLeave,
        className,
        ...otherProps
    } = props

    if (!scaleImageOnHover || !file.isImage) {
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
}
