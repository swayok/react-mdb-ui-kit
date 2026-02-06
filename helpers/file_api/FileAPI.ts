import ExifStatic from 'exif-js/exif.d'
import {AnyObject} from '../../types'

// Данные прикрепленного файла.
export type FileAPISelectedFileInfo = File & {
    isImage: boolean
    mimeType?: string
    extension?: string | null
    previewDataUrl?: string
}

// EXIF информация из прикрепленного файла-картинки.
type ExifInfo = AnyObject & {
    Orientation?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    DateTime?: string
}

// Информация о прикрепленном файле-картинке.
export interface FileAPIImageFileInfo {
    width: number
    height: number
    imageElement: HTMLImageElement
    exif: null | ExifInfo
}

let exif: typeof ExifStatic

/**
 * API для работы с файлами.
 */
export class FileAPI {

    /**
     * Достать прикрепленные файлы из поля ввода.
     */
    static getFiles(
        input: HTMLInputElement,
        resetInputValue: boolean = false
    ): Array<FileAPISelectedFileInfo> {
        const ret: Array<FileAPISelectedFileInfo> = []
        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                const file: File = input.files[i]
                const mimeType: string = this.getMimeType(file)
                ret.push(Object.assign(
                    input.files[i],
                    {
                        isImage: this.isImageMimeType(mimeType),
                        extension: this.getFileExtension(file),
                        mimeType,
                    }
                ))
            }
        }
        if (resetInputValue) {
            input.value = ''
        }
        return ret
    }

    /**
     * Получить информацию о прикрепленном файле-картинке.
     */
    static async getImageInfo(
        file: FileAPISelectedFileInfo,
        withExif: boolean = false
    ): Promise<FileAPIImageFileInfo | null> {
        if (this.isImage(file)) {
            if (withExif && !exif) {
                exif = (await import('exif-js')).default
            }
            return new Promise<FileAPIImageFileInfo | null>(resolve => {
                try {
                    const fileReader = new FileReader()
                    fileReader.addEventListener('load', () => {
                        try {
                            const dataUrl: string = fileReader.result as string
                            const image: HTMLImageElement = new Image()
                            image.addEventListener('load', () => {
                                try {
                                    if (withExif) {
                                        const success = exif.getData(
                                            image as unknown as string,
                                            (): void => {
                                                resolve({
                                                    width: image.width,
                                                    height: image.height,
                                                    imageElement: image,
                                                    // exif: exif.getAllTags(image),
                                                    exif: {
                                                        Orientation: exif.getTag(image, 'Orientation'),
                                                        DateTime: exif.getTag(image, 'DateTime'),
                                                    },
                                                })
                                            }
                                        )
                                        if (success) {
                                            return
                                        }
                                    }
                                    resolve({
                                        width: image.width,
                                        height: image.height,
                                        imageElement: image,
                                        exif: null,
                                    })
                                } catch (e) {
                                    console.error('[FileApi] getImageInfo: image.addEventListener(\'load\') error', e)
                                    resolve({
                                        width: image.width,
                                        height: image.height,
                                        imageElement: image,
                                        exif: null,
                                    })
                                }
                            })
                            image.src = dataUrl
                        } catch (e) {
                            console.error('[FileApi] getImageInfo: fileReader.addEventListener(\'load\') error', e)
                            resolve(null)
                        }
                    })
                    fileReader.addEventListener('error', e => {
                        console.error('[FileApi] getImageInfo: fileReader.addEventListener(\'error\')', e)
                        resolve(null)
                    })
                    fileReader.addEventListener('abort', e => {
                        console.error('[FileApi] getImageInfo: fileReader.addEventListener(\'abort\')', e)
                        resolve(null)
                    })
                    fileReader.readAsDataURL(file)
                } catch (e) {
                    console.error('[FileApi] getImageInfo: error inside Promise', e)
                    resolve(null)
                }
            })
        }
        return Promise.resolve(null)
    }

    /**
     * Является ли прикрепленный файл картинкой?
     */
    static isImage(file: FileAPISelectedFileInfo | File): boolean {
        return this.isImageMimeType(this.getMimeType(file))
    }

    /**
     * Является ли mimetype картинкой?
     */
    static isImageMimeType(mimeType?: string): boolean {
        return !!mimeType && mimeType.match(/^image/) !== null
    }

    /**
     * Определить mimetype файла.
     */
    static getMimeType(file: FileAPISelectedFileInfo | File): string {
        let mimeType: string | null = file.type === '' ? null : file.type
        if (!mimeType || mimeType === 'application/octet-stream') {
            const extension: string | null = this.getFileExtension(file)
            if (extension === 'heic' || extension === 'heif') {
                mimeType = 'image/heic'
            }
        }
        return mimeType ?? 'application/octet-stream'
    }

    /**
     * Получить расширение файла.
     * Возвращает null, если расширения нет.
     */
    static getFileExtension(file: FileAPISelectedFileInfo | File): string | null {
        const extension = file.name.replace(/^.+\.([a-zA-Z0-9]{3,4})$/, '$1')
            .toLowerCase()
        return extension === '' ? null : extension
    }
}
