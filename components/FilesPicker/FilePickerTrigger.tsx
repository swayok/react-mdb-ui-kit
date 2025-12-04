import {MouseEvent} from 'react'
import {ComponentPropsWithModifiableTag} from '../../types'
import {useFilePickerContext} from './FilePickerContext'

type Props = ComponentPropsWithModifiableTag

// Элемент, при нажатии на который запускается выбор файла для прикрепления.
export function FilePickerTrigger<TagProps = unknown>(
    props: Props & Omit<TagProps, 'onClick'>
) {
    const {
        onClick,
        children,
        tag: Tag = 'div',
        ...otherProps
    } = props

    const {
        pickFile,
    } = useFilePickerContext()

    return (
        <Tag
            {...otherProps}
            onClick={(e: MouseEvent<HTMLElement>) => {
                e.preventDefault()
                onClick?.(e)
                pickFile()
            }}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default FilePickerTrigger
