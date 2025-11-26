import React, {useContext} from 'react'
import FilePickerContext from './FilePickerContext'
import {FilePickerContextProps} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
import {ComponentPropsWithModifiableTag} from 'swayok-react-mdb-ui-kit/types/Common'

type Props = ComponentPropsWithModifiableTag

// Элемент, при нажатии на который запускается выбор файла для прикрепления.
function FilePickerTrigger<TagProps = unknown>(
    props: Props & Omit<TagProps, 'onClick'>
) {

    const {
        pickFile,
    } = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        onClick,
        children,
        tag: Tag = 'div',
        ...otherProps
    } = props

    return (
        <Tag
            {...otherProps}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault()
                onClick?.(e)
                pickFile()
            }}
        >
            {children}
        </Tag>
    )
}

export default React.memo(FilePickerTrigger) as typeof FilePickerTrigger
