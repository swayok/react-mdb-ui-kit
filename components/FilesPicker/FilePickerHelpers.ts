import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerProps,
    FilePickerUploadInfo,
} from '../../types/FilePicker'
import {FileAPISelectedFileInfo} from '../../helpers/FileAPI/FileAPI'
import {MinMax} from '../../types/Common'
import FileApiImageManipulation from '../../helpers/FileAPI/FileApiImageManipulation'

// Функции-помощники для FilePicker и FilePickerWithUploader.
export default {
    // Получить минимальное и максимальное значения позиций файлов.
    getMinMaxFilePositions(
        oldFiles: FilePickerFileInfo[],
        newFiles: FilePickerFileInfo[]
    ): MinMax {
        let min: number | null = null
        let max: number | null = null
        const files = oldFiles.concat(newFiles)
        for (let i = 0; i < files.length; i++) {
            if (max === null || files[i].position > max) {
                max = files[i].position
            }
            if (min === null || files[i].position < min) {
                min = files[i].position
            }
        }

        return {
            min: min || 0,
            max: max || 0,
        }
    },

    // Файл валидный?
    isValidFile(file: FilePickerFileInfo): boolean {
        return !file.error && !file.isDeleted
    },

    // Создание ID файла для проверки прикрепления дубликата.
    makeFileID(file: FileAPISelectedFileInfo): string {
        return String(file.size) + '_' + file.name
    },

    // Получение информации о файле для отправки на сервер.
    getFileInfoForUpload(
        file: FilePickerFileInfo,
        useUidAsFileName: boolean = false,
        maxImageSize?: number,
        convertImagesToJpeg?: boolean,
        imagesCompression?: number
    ): Promise<FilePickerUploadInfo> {
        const fileName: string = useUidAsFileName ? file.UID : file.file.name
        if (!file.file.isImage) {
            return Promise.resolve<FilePickerUploadInfo>({
                file,
                data: file.file as Blob,
                fileName,
            })
        } else {
            return new Promise(((resolve, reject) => {
                new FileApiImageManipulation(file.file)
                    .setMaxSize(maxImageSize)
                    .getCanvas()
                    .then((canvas: HTMLCanvasElement) => {
                        file.resizedCanvas = canvas
                        canvas.toBlob(
                            (data: Blob | null) => {
                                if (!data) {
                                    reject(new Error('failed_to_get_image_blob'))
                                } else {
                                    resolve({
                                        file,
                                        data,
                                        fileName: convertImagesToJpeg
                                            ? fileName.replace(/\.[a-zA-Z0-9]{1,6}$/, '.jpg')
                                            : fileName,
                                    })
                                }
                            },
                            convertImagesToJpeg ? 'image/jpeg' : undefined,
                            imagesCompression
                        )
                    })
                    .catch(() => reject(new Error('failed_to_resize_file')))
            }))
        }
    },

    // Валидация типа и размера файла.
    validateFileTypeAndSize(
        file: FileAPISelectedFileInfo,
        mimes: FilePickerContextProps['previews'],
        translations: FilePickerProps['translations'],
        maxFileSizeKb?: number
    ): string | FilePickerContextMimeTypeInfo {
        const extension = file.name.replace(/^.+\.([a-zA-Z0-9]{3,4})$/, '$1').toLowerCase()
        if (!mimes[file.type]) {
            return translations.error.mime_type_forbidden(extension || file.type)
        }
        const mimesForType: FilePickerContextMimeTypeInfo = mimes[file.type]
        if (
            (
                mimesForType.extensions
                && !(mimesForType.extensions).includes(extension)
            )
            || file.name.toLowerCase() === extension
        ) {
            return translations.error.mime_type_and_extension_mismatch(extension, file.type)
        }
        if (mimesForType.preview !== 'image' && maxFileSizeKb && file.size / 1024 > maxFileSizeKb) {
            return translations.error.file_too_large(Math.round(maxFileSizeKb / 1024 * 100) / 100)
        }
        return mimesForType
    },
}
