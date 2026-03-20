import type {MouseEvent} from 'react'
import type {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {useFilePickerContext} from './FilePickerContext'
import type {FilePickerTriggerProps} from './FilePickerTypes'

// Элемент, при нажатии на который запускается выбор файла для прикрепления.
export function FilePickerTrigger<
    InjectedComponentProps extends object = HtmlComponentProps<HTMLDivElement>,
>(props: MergedComponentProps<FilePickerTriggerProps, InjectedComponentProps>) {
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
