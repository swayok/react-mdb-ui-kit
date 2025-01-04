import React, {AllHTMLAttributes, useContext} from 'react'
import clsx from 'clsx'
import FilePickerContext from './FilePickerContext'
import {FilePickerContextProps} from '../../types/FilePicker'
import Collapse from '../Collapse'
import Icon from '../Icon'
import {mdiFolderOpenOutline, mdiPlus} from '@mdi/js'
import FilePickerFilePreviewWithoutInfo from './FilePickerFilePreviewWithoutInfo'
import ToastService from '../../services/ToastService'

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
    // Иконка для кнопки добавления картинки.
    adderIcon?: string;
    // Увеличивать картинку при наведении курсора?
    scaleImageOnHover?: boolean;
}

// Блок со списком предпросмотров прикрепленных картинок.
function FilePickerPreviewsWithoutInfo(props: Props) {

    const context = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        children,
        className,
        itemClassName,
        pickerButtonClassName,
        previewSize = 100,
        alwaysVisible,
        scaleImageOnHover,
        ...otherProps
    } = props

    const cssClasses = clsx(
        'file-picker-previews-container d-flex flex-row flex-wrap',
        'align-items-stretch justify-content-around',
        'justify-content-sm-start',
        scaleImageOnHover ? 'file-picker-previews-scale-on-hover' : null,
        className
    )

    const previews = []
    for (let i = 0; i < context.existingFiles.length; i++) {
        previews.push(
            <FilePickerFilePreviewWithoutInfo
                key={'existing-file-preview-' + context.existingFiles[i].UID}
                file={context.existingFiles[i]}
                className={itemClassName}
                previewSize={previewSize}
                onDelete={file => {
                    context.onExistingFileDelete(file, 210)
                }}
            />
        )
    }
    for (let i = 0; i < context.files.length; i++) {
        previews.push(
            <FilePickerFilePreviewWithoutInfo
                key={'file-preview-' + context.files[i].UID}
                file={context.files[i]}
                className={itemClassName}
                previewSize={previewSize}
                onDelete={file => {
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
                        'file-picker-previews-adder rounded-6 mb-4 ms-3 me-3 p-3 cursor',
                        'd-flex flex-row justify-content-center align-items-center',
                        context.reorderable ? 'file-picker-previews-reorderable' : null,
                        !context.canAttachMoreFiles() || context.isDisabled ? 'disabled' : null,
                        pickerButtonClassName
                    )}
                    style={{
                        height: previewSize,
                        width: previewSize,
                        order: adderPosition,
                    }}
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        if (context.canAttachMoreFiles()) {
                            context.pickFile()
                        } else {
                            ToastService.error(
                                context.translations.error.too_many_files(context.maxFiles as number)
                            )
                        }
                    }}
                >
                    <Icon
                        path={props.adderIcon || (context.maxFiles === 1 ? mdiFolderOpenOutline : mdiPlus)}
                        size={Math.round(previewSize / 2)}
                    />
                </a>
                {/* Заполнитель пустого пространства в конце */}
                {context.files.length % 2 === 0 && (
                    <div
                        className="flex-1 d-none d-sm-block"
                        style={{
                            order: adderPosition + 100,
                        }}
                    />
                )}
            </div>
        </Collapse>
    )
}

export default React.memo(FilePickerPreviewsWithoutInfo)
