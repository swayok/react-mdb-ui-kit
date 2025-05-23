import React from 'react'
import FilePickerHelpers from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerHelpers'
import {
    FilePickerFileInfo,
    FilePickerTranslations,
    FilePickerWithUploaderFileInfo,
} from 'swayok-react-mdb-ui-kit/types/FilePicker'

interface Props {
    file: FilePickerWithUploaderFileInfo | FilePickerFileInfo
    translations: FilePickerTranslations
}

// Информация о прикрепленном файле.
export const FilePickerFilePreviewFileInfo = React.memo(function FilePickerFilePreviewFileInfo(props: Props) {

    const {
        file,
        translations,
    } = props

    const renderUploadingStatus = () => {
        if ('uploading' in file) {
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
        return null
    }

    return (
        <div className="text-start">
            <div className="fw-600 mb-1 text-break">{file.file.name}</div>
            <div>{translations.file_size}: {FilePickerHelpers.getFileSizeMb(file)}Mb</div>
            {renderUploadingStatus()}
            {!!file.error && (
                <div className="text-danger mt-1 d-flex flex-row">
                    {translations.error_label}: {file.error}
                </div>
            )}
        </div>
    )
})
