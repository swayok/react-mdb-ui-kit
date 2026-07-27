import {type ImageBlobReduce} from 'image-blob-reduce'

type CanvasToBlobMime = 'image/jpeg' | 'image/png' | 'image/webp' | string

let attachedImageResizer: ImageBlobReduce | null = null
let imageResizer: pica.Pica | null = null

// Получить объект Pica (через загрузку чанка).
export const getPica = async (): Promise<pica.Pica> => {
    if (!imageResizer) {
        const pica = await import('pica')
        imageResizer = pica.default()
    }
    return imageResizer
}

// Получить ресайзер изображений (через загрузку чанка).
export const getImageResizer = async (): Promise<ImageBlobReduce> => {
    if (!attachedImageResizer) {
        const imageBlobReduce = await import('image-blob-reduce')
        const pica: pica.Pica = await getPica()
        attachedImageResizer = new (imageBlobReduce.default)({
            pica,
        })
    }
    return attachedImageResizer
}

// Изменение размера прикрепляемых картинок.
// Манипуляции выполняются библиотеками:
// - https://github.com/nodeca/pica
// - https://github.com/nodeca/image-blob-reduce (обертка поверх pica для input[type=file])
export class FileApiImageManipulation<FileType extends File = File> {

    // Прикрепленный файл.
    private readonly file: File

    // Максимальный размер любой из сторон.
    private maxSize: number = 1920

    // Создание манипулятора.
    constructor(file: FileType | FileApiImageManipulation, maxSize?: number) {
        if (file instanceof FileApiImageManipulation) {
            this.file = file.getFile()
        } else {
            this.file = file
        }
        if (maxSize && maxSize > 0) {
            this.maxSize = maxSize
        }
    }

    // Максимальный размер стороны картинки.
    setMaxSize(maxSize?: number): FileApiImageManipulation {
        if (maxSize && maxSize > 0) {
            this.maxSize = maxSize
        }
        return this
    }

    // Получить исходный файл.
    getFile(): FileType {
        return this.file as FileType
    }

    // Уменьшить размер картинки и вернуть ее в виде <canvas> элемента.
    async getCanvas(): Promise<HTMLCanvasElement> {
        return (await getImageResizer()).toCanvas(this.file, {
            max: this.maxSize,
        })
    }

    // Уменьшить размер картинки и вернуть ее в виде Blob объекта для отправки на сервер.
    async getBlob(): Promise<Blob> {
        return (await getImageResizer()).toBlob(this.file, {
            max: this.maxSize,
        })
    }
}

// Является ли файл HEIC/HEIF изображением?
export function isHeicOrHeifFile(file: File): boolean {
    const mimeType: string = (file as File & {mimeType?: string;}).mimeType ?? file.type
    return mimeType === 'image/heic' || mimeType === 'image/heif'
}

// Конвертировать HEIC/HEIF файл в JPEG или PNG.
// Используется пакет heic-to: https://www.npmjs.com/package/heic-to
// Загружается как отдельный чанк (lazy import) т.к. библиотека heic-to довольно большая.
export async function convertHeicFileToBlob(
    file: File,
    targetType: 'image/jpeg' | 'image/png',
    quality: number = 0.92
): Promise<Blob> {
    // noinspection TypeScriptCheckImport
    // @ts-ignore
    const heicToModule = await import('heic-to')
    const heicToFn = (heicToModule.default ?? (heicToModule as {heicTo?: unknown;}).heicTo) as (
        params: {blob: File | Blob; type: string; quality?: number;}
    ) => Promise<Blob>
    return heicToFn({
        blob: file,
        type: targetType,
        quality,
    })
}

// Конвертировать <canvas> в Blob.
export async function canvasToBlob(
    canvas: HTMLCanvasElement,
    mimeType: CanvasToBlobMime,
    quality?: number
): Promise<Blob> {
    return (await getPica()).toBlob(canvas, mimeType, quality)
}

// Конвертировать <canvas> в Blob (jpeg).
export function canvasToJpegBlob(
    canvas: HTMLCanvasElement,
    quality: number = 0.9
): Promise<Blob> {
    return canvasToBlob(canvas, 'image/jpeg', quality)
}
