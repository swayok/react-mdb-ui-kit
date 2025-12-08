import {MouseEvent} from 'react'
import {
    MorphingHtmlComponentPropsWithoutRef,
} from '../../types'
import {useFilePickerContext} from './FilePickerContext'

type Props = MorphingHtmlComponentPropsWithoutRef

// Элемент, при нажатии на который запускается выбор файла для прикрепления.
export function FilePickerTrigger<InjectedComponentProps extends object = object>(
    props: Omit<InjectedComponentProps, 'onClick' | 'children' | 'tag'> & Props
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
