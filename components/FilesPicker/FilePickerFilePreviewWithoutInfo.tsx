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
import {
    mdiAlertCircle,
    mdiBackupRestore,
    mdiCloseCircleOutline,
    mdiImageBroken,
    mdiImageFrame,
} from '@mdi/js'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFilePreviewProps,
    FilePickerWithUploaderFileInfo,
} from '../../types/FilePicker'
import withStable from '../../helpers/withStable'
import ReorderableListItem from '../ReorderableList/ReorderableListItem'
import FilePickerHelpers from './FilePickerHelpers'

// Компонент предпросмотра прикрепленного файла (только картинка или иконка).
function FilePickerFilePreviewWithoutInfo(
    props: FilePickerFilePreviewProps<FilePickerFileInfo | FilePickerWithUploaderFileInfo>
) {

    const imagePreviewContainer = useRef<HTMLDivElement>(null)
    const {
        previews,
        translations,
        fallbackPreview,
        isDisabled,
    } = useContext<FilePickerContextProps>(FilePickerContext)
    const [
        isImagePreviewError,
        setImagePreviewError,
    ] = useState<boolean>(false)

    const transitionRef = useRef<HTMLElement>(null)

    const {
        className,
        imageClassName,
        fileClassName,
        previewSize,
        imagePreviewSize = previewSize,
        animate = true,
        file,
        style,
        onDelete,
        onRestore,
        showIfDeleted = false,
        onClick,
        onFocus,
        onBlur,
        onMouseLeave,
        ...containerProps
    } = props

    // Создание предпросмотра картинки.
    useEffect(() => {
        if (!imagePreviewContainer.current) {
            return
        }
        if (!file.file.previewDataUrl) {
            new FileApiImageManipulation(file.file)
                // *1.5 для нормального качества широких или высоких картинок
                .setMaxSize(previewSize * 1.5)
                .getCanvas()
                .then((img: HTMLCanvasElement) => {
                    if (imagePreviewContainer.current) {
                        file.file.previewDataUrl = img.toDataURL()
                        imagePreviewContainer.current.innerHTML = ''
                        imagePreviewContainer.current.style.backgroundImage = `url("${file.file.previewDataUrl}")`
                    }
                })
                .catch((error: unknown) => {
                    console.log('[FilePickerFilePreview] preview error: ', error)
                    setImagePreviewError(true)
                })
        } else {
            imagePreviewContainer.current.innerHTML = ''
            imagePreviewContainer.current.style.backgroundImage = `url("${file.file.previewDataUrl}")`
        }
    }, [imagePreviewContainer.current, file.file.previewDataUrl])

    // Не продолжаем, если файл удалён при определенном наборе значений других свойств.
    if (!animate && !showIfDeleted && file.isDeleted) {
        return null
    }

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

    const previewInfo: FilePickerContextMimeTypeInfo = previews[file.file.type] || {
        type: 'file',
        extensions: [],
        preview: fallbackPreview,
    } as FilePickerContextMimeTypeInfo

    const previewSizes: CSSProperties = {
        width: previewSize,
        height: previewSize,
    }

    let preview
    if (previewInfo.preview === 'image') {
        preview = (
            <div
                className="file-picker-preview-image rounded-6 d-flex flex-row align-items-stretch"
                ref={imagePreviewContainer}
                style={{
                    width: imagePreviewSize,
                    height: imagePreviewSize,
                }}
            >
                {getPreviewPlaceholder(imagePreviewSize, isImagePreviewError, style)}
            </div>
        )
    } else {
        preview = (
            <div
                className={clsx(
                    'file-picker-preview-file rounded-6 d-flex align-items-center justify-content-center',
                    fileClassName
                )}
                style={previewSizes}
            >
                {previewInfo.preview(previewSize, file.file.name)}
            </div>
        )
    }

    const content = (
        <ReorderableListItem
            tag={Card}
            position={file.position}
            payload={file}
            className={clsx(
                'file-picker-preview-wrapper rounded-6 shadow-0',
                previewInfo.preview === 'image'
                    ? 'file-picker-preview-for-image'
                    : 'file-picker-preview-for-file',
                className
            )}
            style={{
                ...previewSizes,
                order: file.position,
            }}
            wrapperRef={transitionRef}
        >
            <CardBody
                className="position-relative p-0"
                style={{
                    ...previewSizes,
                    ...style,
                }}
                {...containerProps}
            >
                <a
                    className={clsx(
                        'file-picker-preview-container position-relative z-index-1',
                        'd-flex flex-row align-items-start justify-content-start',
                        (file.isDeleted && showIfDeleted) ? 'opacity-30' : null
                    )}
                    href="#"
                    onClick={e => {
                        e.preventDefault()
                        // Scale toggle картинки для touch-устройств.
                        if (e.currentTarget.parentElement?.parentElement?.classList.contains('active')) {
                            e.currentTarget.blur()
                        } else {
                            e.currentTarget.focus()
                        }

                        onClick?.(e)
                    }}
                    onFocus={e => {
                        // Scale up картинки для touch-устройств.
                        e.currentTarget.parentElement?.parentElement?.classList.add('active')
                        onFocus?.(e)
                    }}
                    onBlur={e => {
                        // Scale down картинки для touch-устройств.
                        e.currentTarget.parentElement?.parentElement?.classList.remove('active')
                        onBlur?.(e)
                    }}
                    onMouseLeave={e => {
                        // Scale down картинки для touch-устройств.
                        e.currentTarget.parentElement?.parentElement?.classList.remove('active')
                        onMouseLeave?.(e)
                    }}
                >
                    <div
                        className={clsx(
                            'file-picker-preview d-flex align-items-center justify-content-center',
                            previewInfo.preview === 'image' ? imageClassName : null
                        )}
                        style={previewSizes}
                    >
                        {preview}
                    </div>
                    <div className="pt-2">
                        {'uploading' in file && (
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
                        )}
                        {file.error && (
                            <div
                                className="file-picker-preview-error-indicator cursor d-flex align-items-center justify-content-center"
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
                                    size={Math.max(50, Math.round(previewSize / 3))}
                                    className="bg-white text-red"
                                    style={{borderRadius: '50%'}}
                                />
                            </div>
                        )}
                    </div>
                </a>
                {!file.isDeleted && (
                    <a
                        className={clsx(
                            'file-picker-preview-delete z-index-2',
                            'd-flex flex-row align-items-center justify-content-center',
                            (!FilePickerHelpers.canDeleteFile(file) || isDisabled)
                                ? 'disabled'
                                : null
                        )}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (FilePickerHelpers.canDeleteFile(file)) {
                                onDelete(file)
                            }
                        }}
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
                            'file-picker-preview-restore z-index-2',
                            'd-flex flex-row align-items-center justify-content-center'
                        )}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            onRestore(file)
                        }}
                        title={translations.restore}
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
                in={!file.isDeleted || showIfDeleted}
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

export default withStable(['onDelete'], FilePickerFilePreviewWithoutInfo)
