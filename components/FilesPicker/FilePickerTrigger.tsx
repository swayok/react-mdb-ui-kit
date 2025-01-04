import React, {useContext} from 'react'
import FilePickerContext from './FilePickerContext'
import {FilePickerContextProps} from '../../types/FilePicker'
import {ComponentPropsWithModifiableTag} from '../../types/Common'

type Props = ComponentPropsWithModifiableTag

// Элемент, при нажатии на который запускается выбор файла для прикрепления.
function FilePickerTrigger<TagProps = unknown>(props: Props & TagProps) {

    const context = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        onClick,
        children,
        tag,
        ...otherProps
    } = props

    const Tag = tag || 'div'

    return (
        <Tag
            {...otherProps}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault()
                onClick?.(e)
                context.pickFile()
            }}
        >
            {children}
        </Tag>
    )
}

export default React.memo(FilePickerTrigger) as typeof FilePickerTrigger