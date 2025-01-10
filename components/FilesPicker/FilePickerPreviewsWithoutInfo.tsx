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

    const {
        maxFiles,
        existingFiles,
        files,
        reorderable,
        translations,
        isDisabled,
        canAttachMoreFiles,
        pickFile,
        getNextFilePosition,
        onExistingFileDelete,
        onFileDelete,
    } = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        children,
        className,
        itemClassName,
        pickerButtonClassName,
        previewSize = 100,
        alwaysVisible,
        scaleImageOnHover,
        adderIcon,
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
    for (let i = 0; i < existingFiles.length; i++) {
        previews.push(
            <FilePickerFilePreviewWithoutInfo
                key={'existing-file-preview-' + existingFiles[i].UID}
                file={existingFiles[i]}
                className={itemClassName}
                previewSize={previewSize}
                onDelete={file => {
                    onExistingFileDelete(file, 210)
                }}
            />
        )
    }
    for (let i = 0; i < files.length; i++) {
        previews.push(
            <FilePickerFilePreviewWithoutInfo
                key={'file-preview-' + files[i].UID}
                file={files[i]}
                className={itemClassName}
                previewSize={previewSize}
                onDelete={file => {
                    if (!isDisabled) {
                        onFileDelete(file, 210)
                    }
                }}
            />
        )
    }

    const adderPosition: number = getNextFilePosition() + 100000

    return (
        <Collapse
            show={alwaysVisible || files.length > 0}
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
                        reorderable ? 'file-picker-previews-reorderable' : null,
                        !canAttachMoreFiles() || isDisabled ? 'disabled' : null,
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
                        if (canAttachMoreFiles()) {
                            pickFile()
                        } else {
                            ToastService.error(
                                translations.error.too_many_files(maxFiles as number)
                            )
                        }
                    }}
                >
                    <Icon
                        path={adderIcon || (maxFiles === 1 ? mdiFolderOpenOutline : mdiPlus)}
                        size={Math.round(previewSize / 2)}
                    />
                </a>
                {/* Заполнитель пустого пространства в конце */}
                {files.length % 2 === 0 && (
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
