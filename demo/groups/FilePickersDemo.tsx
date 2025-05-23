import React, {useState} from 'react'
import FilePickerHelpers from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerHelpers'
import FilePickerInput from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerInput'
import FilePickerPreviews from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerPreviews'
import FilePickerPreviewsWithoutInfo from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerPreviewsWithoutInfo'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import file_picker from 'swayok-react-mdb-ui-kit/locales/en/file_picker'
import {FilePickerFileInfo} from 'swayok-react-mdb-ui-kit/types/FilePicker'

export default function FilePickersDemo() {

    const [
        files,
        setFiles,
    ] = useState<FilePickerFileInfo[]>([])

    const [
        files2,
        setFiles2,
    ] = useState<FilePickerFileInfo[]>(() => FilePickerHelpers.normalizeValueFromDB([
        {
            // ID файла в БД.
            id: 1,
            // MIME-тип файла.
            mimeType: 'image/jpeg',
            // Оригинальное имя файла.
            uploadName: 'image1.jpg',
            // URL к файлу.
            url: 'https://picsum.photos/200/200?random=1',
            // Позиция в списке.
            position: 1,
        },
        {
            // ID файла в БД.
            id: 2,
            // MIME-тип файла.
            mimeType: 'image/jpeg',
            // Оригинальное имя файла.
            uploadName: 'image2.jpg',
            // URL к файлу.
            url: 'https://picsum.photos/200/200?random=2',
            // Позиция в списке.
            position: 2,
        },
    ]))

    return (
        <>
            <FilePickerInput
                translations={file_picker}
                value={files}
                maxFiles={10}
                onChange={setFiles}
                reorderable
            >
                <SectionDivider label="Detailed Previews"/>
                <FilePickerPreviews
                    previewSize={100}
                    alwaysVisible
                    className="mb-4"
                    columns={{
                        xs: 1,
                    }}
                />
                <SectionDivider label="Small Previews"/>
                <FilePickerPreviewsWithoutInfo
                    previewSize={100}
                    alwaysVisible
                    scaleImageOnHover
                />
            </FilePickerInput>

            <FilePickerInput
                translations={file_picker}
                value={files}
                maxFiles={10}
                onChange={setFiles}
                disabled
            >
                <SectionDivider label="Detailed Previews Disabled"/>
                <FilePickerPreviews
                    previewSize={100}
                    alwaysVisible
                    className="mb-4"
                    columns={{
                        xs: 1,
                    }}
                />
                <SectionDivider label="Small Previews Disabled"/>
                <FilePickerPreviewsWithoutInfo
                    previewSize={100}
                    alwaysVisible
                />
            </FilePickerInput>

            <FilePickerInput
                translations={file_picker}
                value={files2}
                maxFiles={10}
                onChange={setFiles2}
                reorderable
            >
                <SectionDivider label="Detailed Previews With Preset Files"/>
                <FilePickerPreviews
                    previewSize={100}
                    alwaysVisible
                    showDeletedFiles
                    className="mb-4"
                    columns={{
                        xs: 1,
                    }}
                />
                <SectionDivider label="Small Previews With Preset Files"/>
                <FilePickerPreviewsWithoutInfo
                    previewSize={100}
                    alwaysVisible
                    showDeletedFiles
                />
            </FilePickerInput>
        </>
    )
}
