import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFileInfoFromDB,
    FilePickerProps,
    FilePickerUploadInfo, FilePickerWithUploaderFileInfo,
} from '../../types/FilePicker'
import {FileAPISelectedFileInfo} from '../../helpers/FileAPI/FileAPI'
import {MinMax} from '../../types/Common'
import FileApiImageManipulation from '../../helpers/FileAPI/FileApiImageManipulation'

// Функции-помощники для FilePicker и FilePickerWithUploader.
export default {

    // Преобразование FilePickerFileInfoFromDB в FilePickerFileInfo.
    normalizeValueFromDB(
        value: Array<FilePickerFileInfoFromDB | FilePickerFileInfo>
    ): FilePickerFileInfo[] {
        const normalized: FilePickerFileInfo[] = []
        for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== 'object' || !('UID' in value[i]) || !('id' in value[i])) {
                // Значение не является объектом с UID и id, пропускаем его.
                continue
            }
            if ('id' in value[i]) {
                const file = value[i] as FilePickerFileInfoFromDB
                normalized.push({
                    UID: String(file.id),
                    file: {
                        type: file.mimeType,
                        name: file.uploadName,
                        size: 0,
                        isImage: file.mimeType.startsWith('image/'),
                        previewDataUrl: file.url,
                    } as FileAPISelectedFileInfo,
                    error: null,
                    info: null,
                    position: file.position || 0,
                    isNew: false,
                    isDeleted: false,
                })
            } else {
                normalized.push(value[i] as FilePickerFileInfo)
            }
        }
        return normalized
    },

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
    async getFileInfoForUpload<T extends FilePickerFileInfo = FilePickerFileInfo>(
        file: T,
        useUidAsFileName: boolean = false,
        maxImageSize?: number,
        convertImagesToJpeg?: boolean,
        imagesCompression?: number
    ): Promise<FilePickerUploadInfo<T>> {
        return {
            file,
            data: await this.compressFile(file, maxImageSize, convertImagesToJpeg, imagesCompression),
            fileName: this.getNormalizedFileName(file, useUidAsFileName, convertImagesToJpeg),
        }
    },

    // Получить имя файла, которое нужно отправить на сервер.
    getNormalizedFileName(
        file: FilePickerFileInfo,
        useUidAsFileName: boolean = false,
        convertImageToJpeg?: boolean
    ): string {
        const fileName: string = useUidAsFileName ? file.UID : file.file.name
        if (file.file.isImage && convertImageToJpeg) {
            // Заменяем расширение файла на .jpg.
            return fileName.replace(/\.[a-zA-Z0-9]{1,6}$/, '.jpg')
        }
        return fileName
    },

    // Сжатие файла.
    // Если файл - изображение, то сжимаем его до указанного размера.
    // Если не изображение - возвращаем оригинальный файл.
    compressFile(
        file: FilePickerFileInfo,
        maxImageSize?: number,
        convertImageToJpeg?: boolean,
        imagesCompression?: number
    ): Promise<Blob> {
        if (!file.file.isImage) {
            return Promise.resolve(file.file as Blob)
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
                                    resolve(data)
                                }
                            },
                            convertImageToJpeg ? 'image/jpeg' : undefined,
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

    // Может ли пользователь удалить этот файл?
    canDeleteFile(file: FilePickerFileInfo | FilePickerWithUploaderFileInfo): boolean {
        if (file.error) {
            return true
        }
        if ('uploading' in file) {
            if (file.uploading.uploadedFileInfo) {
                return true
            } else if (!file.uploading.isUploading) {
                return true
            }
        }
        return false
    },

    // Размер файла в мегабайтах.
    getFileSizeMb(file: FilePickerFileInfo): number {
        return Math.round(file.file.size / 1024 / 1024 * 100) / 100
    },
}
