import {
    FileAPISelectedFileInfo,
} from '../../helpers/file_api/FileAPI'
import {FileApiImageManipulation} from '../../helpers/file_api/FileApiImageManipulation'
import {MinMax} from '../../types'
import {
    FilePickerContextMimeTypeInfo,
    FilePickerContextProps,
    FilePickerFileInfo,
    FilePickerFileInfoFromDB,
    FilePickerUploadInfo,
    FilePickerWithUploaderFileInfo,
    ManagedFilePickerProps,
} from './FilePickerTypes'

// Функции-помощники для FilePicker и FilePickerWithUploader.
export abstract class FilePickerHelpers {

    // Преобразование FilePickerFileInfoFromDB в FilePickerFileInfo.
    static normalizeValueFromDB(
        value: (FilePickerFileInfoFromDB | FilePickerFileInfo)[]
    ): FilePickerFileInfo[] {
        const normalized: FilePickerFileInfo[] = []
        for (const item of value) {
            if (
                !item
                || typeof item !== 'object'
                || (!('UID' in item) && !('id' in item))
            ) {
                // Значение не является объектом с UID или id, пропускаем его.
                continue
            }
            if ('id' in item) {
                normalized.push({
                    UID: String(item.id),
                    file: {
                        type: item.mimeType,
                        mimeType: item.mimeType,
                        name: item.uploadName,
                        size: 0,
                        isImage: item.mimeType.startsWith('image/'),
                        previewDataUrl: item.url,
                    } as FileAPISelectedFileInfo,
                    error: null,
                    info: null,
                    position: item.position ?? 0,
                    isNew: false,
                    isDeleted: false,
                })
            } else {
                normalized.push(item)
            }
        }
        return normalized
    }

    // Получить минимальное и максимальное значения позиций файлов.
    static getMinMaxFilePositions(
        oldFiles: FilePickerFileInfo[],
        newFiles: FilePickerFileInfo[]
    ): MinMax {
        let min: number | null = null
        let max: number | null = null
        const files = oldFiles.concat(newFiles)
        for (const file of files) {
            if (max === null || file.position > max) {
                max = file.position
            }
            if (min === null || file.position < min) {
                min = file.position
            }
        }

        return {
            min: min ?? 0,
            max: max ?? 0,
        }
    }

    // Файл валидный?
    static isValidFile(file: FilePickerFileInfo): boolean {
        return !file.error && !file.isDeleted
    }

    // Создание ID файла для проверки прикрепления дубликата.
    static makeFileID(file: FileAPISelectedFileInfo): string {
        return String(file.size) + '_' + file.name
    }

    // Получение информации о файле для отправки на сервер.
    static async getFileInfoForUpload<T extends FilePickerFileInfo = FilePickerFileInfo>(
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
    }

    // Получить имя файла, которое нужно отправить на сервер.
    static getNormalizedFileName(
        file: FilePickerFileInfo,
        useUidAsFileName: boolean = false,
        convertImageToJpeg?: boolean
    ): string {
        const fileName: string = useUidAsFileName ? file.UID : file.file.name
        if (file.file.isImage) {
            let extension: string | null = null
            switch (this.getImageMimeTypeForConversion(file, convertImageToJpeg)) {
                case 'image/jpeg':
                    extension = '.jpg'
                    break
                case 'image/png':
                    extension = '.png'
                    break
            }
            if (extension) {
                // Заменяем расширение файла на extension.
                return fileName.replace(/\.[a-zA-Z0-9]{1,6}$/, extension)
            }
        }
        return fileName
    }

    // Сжатие файла.
    // Если файл - изображение, то сжимаем его до указанного размера.
    // Если не изображение - возвращаем оригинальный файл.
    static compressFile(
        file: FilePickerFileInfo,
        maxImageSize?: number,
        convertImageToJpeg?: boolean,
        imagesCompression?: number
    ): Promise<Blob | File> {
        if (
            !file.file.isImage
            || (file.file.mimeType ?? file.file.type) === 'image/svg+xml'
        ) {
            return Promise.resolve(file.file)
        }
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
                        this.getImageMimeTypeForConversion(file, convertImageToJpeg),
                        imagesCompression
                    )
                })
                .catch(error => {
                    console.error('[FileApiImageManipulation] error', error)
                    reject(new Error('failed_to_resize_file'))
                })
        }))
    }

    // Валидация типа и размера файла.
    static validateFileTypeAndSize(
        file: FileAPISelectedFileInfo,
        mimes: FilePickerContextProps['previews'],
        translations: ManagedFilePickerProps['translations'],
        maxFileSizeKb?: number
    ): string | FilePickerContextMimeTypeInfo {
        const mimeType: string = file.mimeType ?? file.type
        if (!mimes[mimeType]) {
            console.log('[FilePicker] No preview config for mime type: ' + mimeType)
            return translations.error.mime_type_forbidden(file.extension ?? mimeType)
        }
        const mimesForType: FilePickerContextMimeTypeInfo = mimes[mimeType]
        if (
            (
                mimesForType.extensions
                && !(mimesForType.extensions).includes(file.extension ?? '')
            )
            || file.name.toLowerCase() === file.extension
        ) {
            return translations.error.mime_type_and_extension_mismatch(
                file.extension ?? '',
                mimeType
            )
        }
        if (
            mimesForType.preview !== 'image'
            && maxFileSizeKb
            && file.size / 1024 > maxFileSizeKb
        ) {
            return translations.error.file_too_large(
                Math.round(maxFileSizeKb / 1024 * 100) / 100
            )
        }
        return mimesForType
    }

    // Может ли пользователь удалить этот файл?
    static canDeleteFile(file: FilePickerFileInfo | FilePickerWithUploaderFileInfo): boolean {
        if (!file.error || !('uploading' in file)) {
            return true
        }
        if (file.uploading.uploadedFileInfo) {
            return true
        } else if (!file.uploading.isUploading) {
            return true
        }
        return false
    }

    // Размер файла в мегабайтах.
    static getFileSizeMb(file: FilePickerFileInfo): number {
        return Math.round(file.file.size / 1024 / 1024 * 100) / 100
    }

    // Получить измененный MIME-тип картинки, который нужно отправить на сервер.
    static getImageMimeTypeForConversion(
        file: FilePickerFileInfo,
        convertImageToJpeg?: boolean
    ): 'image/jpeg' | 'image/png' | undefined {
        if (convertImageToJpeg) {
            return 'image/jpeg'
        }
        const srcMimeType = file.file.mimeType ?? file.file.type
        if (
            srcMimeType === 'image/heic'
            || srcMimeType === 'image/heif'
            || srcMimeType === 'image/avif'
        ) {
            return 'image/png'
        }
        // Не нужно менять тип.
        return undefined
    }
}
