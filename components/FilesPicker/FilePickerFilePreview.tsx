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
import {mdiAlertCircle, mdiCloseCircleOutline, mdiImageBroken, mdiImageFrame} from '@mdi/js'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFilePreviewProps,
} from '../../types/FilePicker'
import withStable from '../../helpers/withStable'
import ReorderableListItem from '../ReorderableList/ReorderableListItem'

// Компонент предпросмотра прикрепленного файла.
function FilePickerFilePreview(props: FilePickerFilePreviewProps) {

    const imagePreviewContainer = useRef<HTMLDivElement>(null)
    const context = useContext<FilePickerContextProps>(FilePickerContext)
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [isImagePreviewError, setImagePreviewError] = useState<boolean>(false)

    const transitionRef = useRef<HTMLElement>(null)

    const {
        className,
        previewSize,
        file,
        onDelete,
        style,
        ...containerProps
    } = props

    // Создание предпросмотра картинки.
    useEffect(() => {
        if (!imagePreviewContainer.current) {
            return
        }
        if (!canvas) {
            new FileApiImageManipulation(file.file)
                .setMaxSize(previewSize)
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

    // Заполнитель предпросмотра файла.
    const getPreviewPlaceholder = (
        previewSize: number,
        isError: boolean,
        style?: CSSProperties
    ) => (
        <div
            className="file-picker-preview-image-placeholder d-flex align-items-center justify-content-center"
            style={Object.assign({width: previewSize, height: previewSize}, style || {})}
        >
            <Icon
                path={isError ? mdiImageBroken : mdiImageFrame}
                size={32}
                className={isError ? 'text-error' : 'text-muted'}
            />
        </div>
    )

    const renderUploadingStatus = (file: FilePickerFileInfo) => {
        if (file.uploading.isUploading) {
            return (
                <div className="mt-1 text-primary">
                    {context.translations.status.uploading(file.uploading.uploadedPercent)}
                </div>
            )
        } else if (file.uploading.isUploaded) {
            return (
                <div className="mt-1 text-success">
                    {context.translations.status.uploaded}
                </div>
            )
        } else {
            return (
                <div className="mt-1 text-orange">
                    {context.translations.status.not_uploaded}
                </div>
            )
        }
    }

    const previewInfo: FilePickerContextMimeTypeInfo = context.previews[file.file.type] || {
        type: 'file',
        extensions: [],
        preview: context.fallbackPreview,
    } as FilePickerContextMimeTypeInfo

    let preview
    if (previewInfo.preview === 'image') {
        preview = (
            <div className="file-picker-preview-image d-flex flex-row align-items-stretch" ref={imagePreviewContainer}>
                {getPreviewPlaceholder(props.previewSize, isImagePreviewError, style)}
            </div>
        )
    } else {
        preview = (
            <div
                className={clsx('file-picker-preview-file d-flex align-items-center justify-content-center', className)}
                style={Object.assign({width: previewSize, height: previewSize}, style || {})}
                {...containerProps}
            >
                {previewInfo.preview(previewSize, file.file.name)}
            </div>
        )
    }

    const renderFileInfo = () => (
        <div className="text-start">
            <div className="fw600 mb-1 text-break">{file.file.name}</div>
            <div>{context.translations.file_size}: {getFileSizeMb(file)}Mb</div>
            {renderUploadingStatus(file)}
            {!!file.error && (
                <div className="text-danger mt-1 d-flex flex-row">
                    {context.translations.error_label}: {file.error}
                </div>
            )}
        </div>
    )

    return (
        <CSSTransition
            in={!file.isDeleted}
            classNames="scale-and-fade"
            timeout={300}
            appear
            nodeRef={transitionRef}
        >
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
                    style={Object.assign(
                        {
                            minHeight: previewSize,
                        },
                        style || {}
                    )}
                    {...containerProps}
                >
                    <div className="position-relative d-flex flex-row align-items-start justify-content-start">
                        <div className="file-picker-preview me-4">
                            {preview}
                        </div>
                        <div className="pt-2">
                            {renderFileInfo()}
                            <div className="file-picker-preview-uploading-indicator">
                                <Loading
                                    loading={!!file.uploading.isUploading}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        minHeight: 'auto',
                                        minWidth: 'auto',
                                        height: previewSize,
                                        width: previewSize,
                                    }}
                                />
                            </div>
                            {!!file.error && (
                                <div
                                    className="file-picker-preview-error-indicator d-flex align-items-center justify-content-center"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: previewSize,
                                        width: previewSize,
                                        zIndex: 101,
                                    }}
                                    onClick={() => ToastService.error(file.error as string)}
                                >
                                    <Icon
                                        path={mdiAlertCircle}
                                        size={Math.max(40, Math.round(previewSize / 3))}
                                        className="bg-white text-red"
                                        style={{borderRadius: '50%'}}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <a
                        className={clsx(
                            'file-picker-preview-delete d-block d-flex flex-row align-items-center justify-content-center',
                            !canDeleteFile(file) || context.isDisabled ? 'disabled' : null
                        )}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (canDeleteFile(file)) {
                                onDelete(file)
                            }
                        }}
                        style={{
                            position: 'absolute',
                            width: 36,
                            height: 36,
                            top: -6,
                            right: -6,
                            zIndex: 2,
                        }}
                    >
                        <Icon
                            path={mdiCloseCircleOutline}
                            size={24}
                            className="text-red"
                        />
                    </a>
                </CardBody>
            </ReorderableListItem>
        </CSSTransition>
    )
}

export default withStable(['onDelete'], FilePickerFilePreview)

// Размер файла в мегабайтах.
function getFileSizeMb(file: FilePickerFileInfo): number {
    return Math.round(file.file.size / 1024 / 1024 * 100) / 100
}

// Возможно ли удалить файл?
function canDeleteFile(file: FilePickerFileInfo): boolean {
    if (file.error) {
        return true
    } else if (file.uploading.uploadedFileInfo) {
        return true
    } else if (!file.uploading.isUploading) {
        return true
    }
    return false
}
