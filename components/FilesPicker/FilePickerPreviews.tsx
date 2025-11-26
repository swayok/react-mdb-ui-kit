import React, {useContext} from 'react'
import clsx from 'clsx'
import {getResponsiveCssGridClassNames} from '../../helpers/getResponsiveCssGridClassNames'
import FilePickerContext from './FilePickerContext'
import FilePickerFilePreview from './FilePickerFilePreview'
import {ToastService} from '../../services/ToastService'
import {FilePickerContextProps, FilePickerFileInfo, FilePickerPreviewsProps} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
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
        scaleImageOnHover = true,
        columns = {
            xs: 1,
            lg: 2,
        },
        children,
        attachFileButtonLabel = maxFiles === 1 && files.length > 0
            ? translations.replace_file
            : translations.attach_file,
        ...otherProps
    } = props

    const cssClasses = clsx(
        'file-picker-previews-container with-info',
        // Настройка количества колонок в списке миниатюр для каждого размера экрана.
        getResponsiveCssGridClassNames(columns ?? {}, 3, 3),
        scaleImageOnHover ? 'file-picker-previews-scale-on-hover' : null,
        className
    )

    const previews = []
    for (const existingFile of existingFiles) {
        previews.push(
            <FilePickerFilePreview
                key={'existing-file-preview-' + existingFile.UID}
                file={existingFile}
                animate={animatePreviews}
                scaleImageOnHover={scaleImageOnHover}
                previewSize={previewSize}
                onDelete={file => {
                    if (!isDisabled) {
                        onExistingFileDelete(file, animatePreviews ? 210 : undefined)
                    }
                }}
                showIfDeleted={showDeletedFiles}
                onRestore={onExistingFileRestore ?? undefined}
            />
        )
    }
    for (const file of files) {
        previews.push(
            <FilePickerFilePreview
                key={'file-preview-' + file.UID}
                file={file}
                animate={animatePreviews}
                scaleImageOnHover={scaleImageOnHover}
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
            show={!!alwaysVisible || files.length > 0 || existingFiles.length > 0}
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
                                translations.error.too_many_files(maxFiles!)
                            )
                        }
                    }}
                >
                    <Icon
                        path={mdiPlus}
                        size={Math.round(previewSize / 2)}
                    />
                    <div className="fs-5 ms-2">
                        {attachFileButtonLabel}
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
