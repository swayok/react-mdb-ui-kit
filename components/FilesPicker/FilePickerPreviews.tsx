import React, {useContext} from 'react'
import clsx from 'clsx'
import FilePickerContext from './FilePickerContext'
import FilePickerFilePreview from './FilePickerFilePreview'
import ToastService from '../../services/ToastService'
import {FilePickerContextProps, FilePickerFileInfo, FilePickerPreviewsProps} from '../../types/FilePicker'
import Collapse from '../Collapse'
import Icon from '../Icon'
import {mdiPlus} from '@mdi/js'

// Блок со списком предпросмотров прикрепленных картинок.
function FilePickerPreviews(props: FilePickerPreviewsProps) {

    const {
        existingFiles,
        onExistingFileDelete,
        onExistingFileRestore,
        files,
        onFileDelete,
        isDisabled,
        translations,
        getNextFilePosition,
        canAttachMoreFiles,
        pickFile,
        maxFiles,
    } = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        className,
        itemClassName,
        pickerButtonClassName,
        previewSize = 100,
        alwaysVisible,
        showDeletedFiles,
        animatePreviews,
        children,
        ...otherProps
    } = props

    const cssClasses = clsx(
        'file-picker-previews-container d-grid grid-columns-1 grid-columns-lg-2 grid-columns-gap-3 grid-rows-gap-3',
        className
    )

    const previews = []
    for (let i = 0; i < existingFiles.length; i++) {
        previews.push(
            <FilePickerFilePreview
                key={'existing-file-preview-' + existingFiles[i].UID}
                file={existingFiles[i]}
                animate={animatePreviews}
                previewSize={previewSize}
                onDelete={file => {
                    if (!isDisabled) {
                        onExistingFileDelete(file, animatePreviews ? 210 : undefined)
                    }
                }}
                showIfDeleted={showDeletedFiles}
                onRestore={onExistingFileRestore || undefined}
            />
        )
    }
    for (let i = 0; i < files.length; i++) {
        previews.push(
            <FilePickerFilePreview
                key={'file-preview-' + files[i].UID}
                file={files[i]}
                animate={animatePreviews}
                className={itemClassName}
                previewSize={previewSize}
                onDelete={(file: FilePickerFileInfo) => {
                    if (!isDisabled) {
                        onFileDelete(file, animatePreviews ? 210 : undefined)
                    }
                }}
            />
        )
    }

    const adderPosition: number = getNextFilePosition() + 100000

    return (
        <Collapse
            show={alwaysVisible || files.length > 0 || existingFiles.length > 0}
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
                        !canAttachMoreFiles() || isDisabled ? 'disabled' : null,
                        pickerButtonClassName
                    )}
                    style={{
                        minHeight: 128,
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
                        path={mdiPlus}
                        size={Math.round(previewSize / 2)}
                    />
                    <div className="fs-5 ms-2">
                        {translations.attach_file}
                    </div>
                </a>
                {/* Заполнитель пустого пространства в конце */}
                {(files.length + existingFiles.length) % 2 === 0 && (
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
