import React, {AllHTMLAttributes, useContext} from 'react'
import clsx from 'clsx'
import FilePickerContext from './FilePickerContext'
import FilePickerFilePreview from './FilePickerFilePreview'
import ToastService from '../../services/ToastService'
import {FilePickerContextProps, FilePickerFileInfo} from '../../types/FilePicker'
import Collapse from '../Collapse'
import Icon from '../Icon'
import {mdiPlus} from '@mdi/js'

interface Props extends AllHTMLAttributes<HTMLDivElement> {
    // Размер предпросмотра.
    previewSize?: number;
    // Показывать этот блок всегда или только когда есть прикрепленные файлы?
    // Дополнительная кнопка добавления первого файла может быть размещена вне этого блока,
    // поэтому его можно скрывать до прикрепления первого файла.
    alwaysVisible?: boolean;
    // CSS классы для предпросмотров.
    itemClassName?: string;
    // CSS классы для кнопки добавления файла.
    pickerButtonClassName?: string;
}

// Блок со списком предпросмотров прикрепленных картинок.
function FilePickerPreviews(props: Props) {

    const context = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        className,
        itemClassName,
        pickerButtonClassName,
        previewSize = 100,
        alwaysVisible,
        children,
        ...otherProps
    } = props

    const cssClasses = clsx(
        'file-picker-previews-container d-grid grid-columns-1 grid-columns-lg-2 grid-columns-gap-3 grid-rows-gap-3',
        className
    )

    const previews = []
    for (let i = 0; i < context.existingFiles.length; i++) {
        previews.push(
            <FilePickerFilePreview
                key={'existing-file-preview-' + context.existingFiles[i].UID}
                file={context.existingFiles[i]}
                previewSize={previewSize}
                onDelete={file => context.onExistingFileDelete(file, 210)}
            />
        )
    }
    for (let i = 0; i < context.files.length; i++) {
        previews.push(
            <FilePickerFilePreview
                key={'file-preview-' + context.files[i].UID}
                file={context.files[i]}
                className={itemClassName}
                previewSize={previewSize}
                onDelete={(file: FilePickerFileInfo) => {
                    if (!context.isDisabled) {
                        context.onFileDelete(file, 210)
                    }
                }}
            />
        )
    }

    const adderPosition: number = context.getNextFilePosition() + 100000

    return (
        <Collapse
            show={alwaysVisible || context.files.length > 0}
            showImmediately={alwaysVisible}
        >
            <div
                className={cssClasses}
                {...otherProps}
            >
                {children}
                {previews}
                <a
                    className={clsx(
                        'file-picker-previews-adder full-width full-height d-flex flex-row justify-content-center align-items-center me-auto cursor p-3',
                        !context.canAttachMoreFiles() || context.isDisabled ? 'disabled' : null,
                        pickerButtonClassName
                    )}
                    style={{
                        minHeight: 128,
                        order: adderPosition,
                    }}
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        if (context.canAttachMoreFiles()) {
                            context.pickFile()
                        } else {
                            ToastService.error(
                                context.translations.error.too_many_files(
                                    context.maxFiles as number
                                )
                            )
                        }
                    }}
                >
                    <Icon
                        path={mdiPlus}
                        size={Math.round(previewSize / 2)}
                    />
                    <div className="fs-5 ms-2">
                        {context.translations.attach_file}
                    </div>
                </a>
                {/* Заполнитель пустого пространства в конце */}
                {context.files.length % 2 === 0 && (
                    <div
                        style={{
                            order: adderPosition + 100,
                        }}
                    />
                )}
            </div>
        </Collapse>
    )
}

export default React.memo(FilePickerPreviews)
