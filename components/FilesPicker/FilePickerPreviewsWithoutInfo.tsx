import React, {useContext} from 'react'
import clsx from 'clsx'
import FilePickerContext from './FilePickerContext'
import {
    FilePickerContextProps,
    FilePickerPreviewSizes,
    FilePickerPreviewsWithoutInfoProps,
} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
import Collapse from '../Collapse'
import Icon from '../Icon'
import {mdiFolderOpenOutline, mdiPlus} from '@mdi/js'
import FilePickerFilePreviewWithoutInfo from './FilePickerFilePreviewWithoutInfo'
import {ToastService} from '../../services/ToastService'

// Блок со списком предпросмотров прикрепленных картинок.
function FilePickerPreviewsWithoutInfo(props: FilePickerPreviewsWithoutInfoProps) {

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
        onExistingFileRestore,
        onFileDelete,
    } = useContext<FilePickerContextProps>(FilePickerContext)

    const {
        children,
        className,
        itemClassName,
        pickerButtonClassName,
        imagePreviewClassName,
        previewSize = 100,
        imagePreviewSize = previewSize,
        alwaysVisible,
        scaleImageOnHover = true,
        adderIcon,
        showDeletedFiles = false,
        animatePreviews,
        ...otherProps
    } = props

    const previews = []
    for (const item of existingFiles) {
        previews.push(
            <FilePickerFilePreviewWithoutInfo
                key={'existing-file-preview-' + item.UID}
                file={item}
                animate={animatePreviews}
                scaleImageOnHover={scaleImageOnHover}
                className={itemClassName}
                imageClassName={imagePreviewClassName}
                previewSize={previewSize}
                imagePreviewSize={imagePreviewSize}
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
    for (const item of files) {
        previews.push(
            <FilePickerFilePreviewWithoutInfo
                key={'file-preview-' + item.UID}
                file={item}
                animate={animatePreviews}
                scaleImageOnHover={scaleImageOnHover}
                className={itemClassName}
                imageClassName={imagePreviewClassName}
                previewSize={previewSize}
                imagePreviewSize={imagePreviewSize}
                onDelete={file => {
                    if (!isDisabled) {
                        onFileDelete(file, animatePreviews ? 210 : undefined)
                    }
                }}
            />
        )
    }

    const adderPosition: number = getNextFilePosition() + 100000

    // noinspection SuspiciousTypeOfGuard
    const previewSizes: FilePickerPreviewSizes = typeof previewSize === 'number'
        ? {width: previewSize, height: previewSize}
        : previewSize
    const iconSize: number = Math.max(
        50,
        Math.round(
            (previewSizes.width < previewSizes.height ? previewSizes.width : previewSizes.height) / 2
        )
    )

    const content = (
        <div
            className={clsx(
                'file-picker-previews-container without-info',
                ' d-flex flex-row flex-wrap align-items-stretch justify-content-around',
                'justify-content-sm-start',
                scaleImageOnHover ? 'file-picker-previews-scale-on-hover' : null,
                className
            )}
            {...otherProps}
        >
            {children}
            {previews}
            <a
                className={clsx(
                    'file-picker-previews-adder rounded-6 p-3 cursor',
                    'd-flex flex-row justify-content-center align-items-center',
                    reorderable ? 'file-picker-previews-reorderable' : null,
                    !canAttachMoreFiles() || isDisabled ? 'disabled' : null,
                    pickerButtonClassName
                )}
                style={{
                    ...previewSizes,
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
                    path={adderIcon ?? (maxFiles === 1 ? mdiFolderOpenOutline : mdiPlus)}
                    size={iconSize}
                />
            </a>
            {/* Заполнитель пустого пространства в конце */}
            {(files.length + existingFiles.length) % 2 === 0 && (
                <div
                    className="flex-1 d-none d-sm-block"
                    style={{
                        order: adderPosition + 100,
                    }}
                />
            )}
        </div>
    )

    if (alwaysVisible) {
        return content
    }

    const hasFiles: boolean = files.length > 0 || existingFiles.length > 0

    return (
        <Collapse
            show={hasFiles}
            showImmediately={hasFiles}
        >
            {content}
        </Collapse>
    )
}

export default React.memo(FilePickerPreviewsWithoutInfo)
