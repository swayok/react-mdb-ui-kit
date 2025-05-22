import React, {CSSProperties, useContext, useEffect, useRef, useState} from 'react'
import FilePickerContext from './FilePickerContext'
import clsx from 'clsx'
import FileApiImageManipulation from '../../helpers/FileAPI/FileApiImageManipulation'
import ToastService from '../../services/ToastService'
import {CSSTransition} from 'react-transition-group'
import Card from '../Card/Card'
import CardBody from '../Card/CardBody'
import Loading from '../Loading'
import Icon from '../Icon'
import {mdiAlertCircle, mdiBackupRestore, mdiCloseCircleOutline, mdiImageBroken, mdiImageFrame} from '@mdi/js'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFilePreviewProps,
    FilePickerPreviewSizes,
    FilePickerWithUploaderFileInfo,
} from '../../types/FilePicker'
import withStable from '../../helpers/withStable'
import ReorderableListItem from '../ReorderableList/ReorderableListItem'
import FilePickerHelpers from './FilePickerHelpers'

// Компонент предпросмотра прикрепленного файла.
function FilePickerFilePreview(
    props: FilePickerFilePreviewProps<FilePickerFileInfo | FilePickerWithUploaderFileInfo>
) {

    const imagePreviewContainer = useRef<HTMLDivElement>(null)
    const {
        previews,
        fallbackPreview,
        translations,
        isDisabled,
    } = useContext<FilePickerContextProps>(FilePickerContext)
    const [
        canvas,
        setCanvas,
    ] = useState<HTMLCanvasElement | null>(null)
    const [
        isImagePreviewError,
        setImagePreviewError,
    ] = useState<boolean>(false)

    const transitionRef = useRef<HTMLElement>(null)

    const {
        className,
        previewSize,
        file,
        onDelete,
        style,
        animate = true,
        onRestore,
        showIfDeleted = false,
        ...containerProps
    } = props

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

    // Создание предпросмотра картинки.
    useEffect(() => {
        if (!imagePreviewContainer.current) {
            return
        }
        if (!canvas) {
            const longestSide = previewSizes.width > previewSizes.height ? previewSizes.width : previewSizes.height
            new FileApiImageManipulation(file.file)
                .setMaxSize(longestSide * 1.5)
                .getCanvas()
                .then((img: HTMLCanvasElement) => {
                    if (imagePreviewContainer.current) {
                        setCanvas(img)
                        imagePreviewContainer.current.innerHTML = ''
                        imagePreviewContainer.current.append(img)
                    }
                })
                .catch((error: unknown) => {
                    console.log('[FilePickerFilePreview] preview error: ', error)
                    setImagePreviewError(true)
                })
        } else {
            imagePreviewContainer.current.innerHTML = ''
            imagePreviewContainer.current.append(canvas)
        }
    }, [imagePreviewContainer.current])

    // Не продолжаем, если файл удалён при определенном наборе значений других свойств.
    if (!animate && !showIfDeleted && file.isDeleted) {
        return null
    }

    // Заполнитель предпросмотра файла.
    const getPreviewPlaceholder = (
        previewSizes: FilePickerPreviewSizes,
        isError: boolean,
        style?: CSSProperties
    ) => (
        <div
            className="file-picker-preview-image-placeholder d-flex align-items-center justify-content-center"
            style={{
                ...previewSizes,
                ...style,
            }}
        >
            <Icon
                path={isError ? mdiImageBroken : mdiImageFrame}
                size={32}
                className={isError ? 'text-error' : 'text-muted'}
            />
        </div>
    )

    const renderUploadingStatus = (file: FilePickerWithUploaderFileInfo) => {
        if (file.uploading.isUploading) {
            return (
                <div className="mt-1 text-primary">
                    {translations.status.uploading(file.uploading.uploadedPercent)}
                </div>
            )
        } else if (file.uploading.isUploaded) {
            return (
                <div className="mt-1 text-success">
                    {translations.status.uploaded}
                </div>
            )
        } else {
            return (
                <div className="mt-1 text-orange">
                    {translations.status.not_uploaded}
                </div>
            )
        }
    }

    const previewInfo: FilePickerContextMimeTypeInfo = previews[file.file.type] || {
        type: 'file',
        extensions: [],
        preview: fallbackPreview,
    } as FilePickerContextMimeTypeInfo

    let preview
    if (previewInfo.preview === 'image') {
        preview = (
            <div className="file-picker-preview-image d-flex flex-row align-items-stretch" ref={imagePreviewContainer}>
                {getPreviewPlaceholder(previewSizes, isImagePreviewError, style)}
            </div>
        )
    } else {
        preview = (
            <div
                className={clsx('file-picker-preview-file d-flex align-items-center justify-content-center', className)}
                style={{
                    ...previewSizes,
                    ...style,
                }}
                {...containerProps}
            >
                {previewInfo.preview(previewSizes.width, file.file.name)}
            </div>
        )
    }

    const renderFileInfo = () => (
        <div className="text-start">
            <div className="fw-600 mb-1 text-break">{file.file.name}</div>
            <div>{translations.file_size}: {FilePickerHelpers.getFileSizeMb(file)}Mb</div>
            {'uploading' in file && renderUploadingStatus(file)}
            {!!file.error && (
                <div className="text-danger mt-1 d-flex flex-row">
                    {translations.error_label}: {file.error}
                </div>
            )}
        </div>
    )

    const actionIconStyle: CSSProperties = {
        position: 'absolute',
        width: 36,
        height: 36,
        top: -6,
        right: -6,
        zIndex: 2,
    }

    const content = (
        <ReorderableListItem
            tag={Card}
            position={file.position}
            payload={file}
            className="file-picker-preview-wrapper shadow-0 border border-1"
            style={{
                order: file.position,
            }}
            wrapperRef={transitionRef}
        >
            <CardBody
                className={clsx('position-relative p-3 pe-4 full-height', className)}
                style={{
                    minHeight: previewSizes.height,
                    ...style,
                }}
                {...containerProps}
            >
                <div
                    className={clsx(
                        'file-picker-preview-container position-relative z-index-1',
                        'd-flex flex-row align-items-start justify-content-start',
                        (file.isDeleted && showIfDeleted) ? 'opacity-30' : null
                    )}
                >
                    <div className="file-picker-preview me-4">
                        {preview}
                    </div>
                    <div className="pt-2">
                        {renderFileInfo()}
                        <div className="file-picker-preview-uploading-indicator">
                            {'uploading' in file && (
                                <Loading
                                    loading={!!file.uploading.isUploading}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        minHeight: 'auto',
                                        minWidth: 'auto',
                                        ...previewSizes,
                                    }}
                                />
                            )}
                        </div>
                        {!!file.error && (
                            <div
                                className="file-picker-preview-error-indicator d-flex align-items-center justify-content-center"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 101,
                                    ...previewSizes,
                                }}
                                onClick={() => ToastService.error(file.error!)}
                            >
                                <Icon
                                    path={mdiAlertCircle}
                                    size={iconSize}
                                    className="bg-white text-red"
                                    style={{borderRadius: '50%'}}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {!file.isDeleted && (
                    <a
                        className={clsx(
                            'file-picker-preview-delete',
                            'd-flex flex-row align-items-center justify-content-center',
                            !FilePickerHelpers.canDeleteFile(file) || isDisabled ? 'disabled' : null
                        )}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (FilePickerHelpers.canDeleteFile(file)) {
                                onDelete(file)
                            }
                        }}
                        style={actionIconStyle}
                    >
                        <Icon
                            path={mdiCloseCircleOutline}
                            size={24}
                            className="text-red"
                        />
                    </a>
                )}
                {file.isDeleted && onRestore && (
                    <a
                        className={clsx(
                            'file-picker-preview-restore',
                            'd-flex flex-row align-items-center justify-content-center'
                        )}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            onRestore(file)
                        }}
                        style={actionIconStyle}
                    >
                        <Icon
                            path={mdiBackupRestore}
                            size={24}
                            className="text-blue"
                        />
                    </a>
                )}
            </CardBody>
        </ReorderableListItem>
    )

    if (animate) {
        return (
            <CSSTransition
                in={!file.isDeleted}
                classNames="scale-and-fade"
                timeout={300}
                appear
                nodeRef={transitionRef}
            >
                {content}
            </CSSTransition>
        )
    }

    return content
}

export default withStable(['onDelete'], FilePickerFilePreview)


