import {
    mdiAlertCircle, mdiBackupRestore, mdiCloseCircleOutline,
} from '@mdi/js'
import clsx from 'clsx'
import React, {
    useContext, useRef,
} from 'react'
import {CSSTransition} from 'react-transition-group'
import {withStable} from '../../helpers/withStable'
import {ToastService} from '../../services/ToastService'
import {
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFilePreviewProps,
    FilePickerPreviewSizes,
    FilePickerWithUploaderFileInfo,
} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'
import {Card} from '../Card/Card'
import {CardBody} from '../Card/CardBody'
import {Icon} from '../Icon'
import {Loading} from '../Loading'
import ReorderableListItem from '../ReorderableList/ReorderableListItem'
import FilePickerContext from './FilePickerContext'
import {FilePickerFilePreviewContent} from './FilePickerFilePreviewContent'
import {FilePickerFilePreviewContentScaler} from './FilePickerFilePreviewContentScaler'
import FilePickerHelpers from './FilePickerHelpers'

// Компонент предпросмотра прикрепленного файла (только картинка или иконка).
function FilePickerFilePreviewWithoutInfo(
    props: FilePickerFilePreviewProps<FilePickerFileInfo | FilePickerWithUploaderFileInfo>
) {

    const {
        translations,
        isDisabled,
    } = useContext<FilePickerContextProps>(FilePickerContext)

    const transitionRef = useRef<HTMLElement>(null)

    const {
        className,
        imageClassName,
        fileClassName,
        previewSize = 100,
        imagePreviewSize = previewSize,
        animate = true,
        scaleImageOnHover = true,
        file,
        style,
        showIfDeleted = false,
        onDelete,
        onRestore,
        onClick,
        onFocus,
        onBlur,
        onMouseLeave,
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

    // Не продолжаем, если файл удалён при определенном наборе значений других свойств.
    if (!animate && !showIfDeleted && file.isDeleted) {
        return null
    }

    const content = (
        <ReorderableListItem
            tag={Card}
            position={file.position}
            payload={file}
            className={clsx(
                'file-picker-preview-wrapper rounded-6 shadow-0',
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
                <FilePickerFilePreviewContentScaler
                    file={file.file}
                    scaleImageOnHover={scaleImageOnHover}
                    className={clsx(
                        'file-picker-preview-container',
                        (file.isDeleted && showIfDeleted) ? 'opacity-30' : null
                    )}
                >
                    <FilePickerFilePreviewContent
                        file={file}
                        previewSizes={previewSizes}
                        imagePreviewSize={imagePreviewSize}
                        imageClassName={imageClassName}
                        fileClassName={fileClassName}
                        allowFileNameTooltip={true}
                        style={style}
                    />
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
                                        ...previewSizes,
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
                                    zIndex: 101,
                                    ...previewSizes,
                                }}
                                onClick={() => ToastService.error(file.error!)}
                            >
                                <Icon
                                    path={mdiAlertCircle}
                                    size={iconSize}
                                    color="red"
                                    className="bg-white rounded-circle"
                                />
                            </div>
                        )}
                    </div>
                </FilePickerFilePreviewContentScaler>
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
                            color="red"
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
                            color="blue"
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
