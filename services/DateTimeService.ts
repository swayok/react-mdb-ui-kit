import dayjs from 'dayjs'
import {BasicLanguageConfig} from '../types/Common'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// Тип объекта для манипуляций с датой и временем.
export type DateTimeInstance = dayjs.Dayjs
// Тип значения, передаваемого в parse.
export type DateTimeParsable = dayjs.ConfigType
// Тип формата даты, передаваемого в parse.
export type DateTimeFormatConfig = dayjs.OptionType
// Настройки локализации.
export type DateTimeLocalization = ILocale

// Формат отображения даты-времени по умолчанию.
let defaultFormat: string = 'L'

// Плагины.
dayjs.extend(utc)
dayjs.extend(localizedFormat)
// Формат отображения даты-времени по умолчанию.
dayjs.extend(function (
    _option,
    dayjsClass: typeof dayjs.Dayjs
): void {
    // Непонятно чего он ругается.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const oldFormat = dayjsClass.prototype.format

    dayjsClass.prototype.format = function (formatString) {
        return oldFormat.bind(this)(formatString ?? defaultFormat)
    }
})

/**
 * Сервис для работы с датой и временем, совместимый с большинством библиотек,
 * которые используют API, похожий на moment.js.
 */
export default class DateTimeService {

    // Установка локали пакета (глобально).
    static setDefaultLocale(
        localeNameOrConfig?: string | DateTimeLocalization,
        config?: Partial<DateTimeLocalization>,
        isLocal?: boolean
    ): void {
        dayjs.locale(localeNameOrConfig, config, isLocal)
    }

    // Установка локали пакета (глобально) из настроек локализации.
    static setDefaultLanguageFromConfig(config: BasicLanguageConfig): void {
        dayjs.locale(config.language.toLowerCase())
        if (config.dateTime.dateFormat) {
            this.setDefaultFormat(config.dateTime.dateFormat)
        }
    }

    // Задать формат даты-времени по умолчанию (для вызова format() без аргументов).
    static setDefaultFormat(format: string): void {
        defaultFormat = format
    }

    // Формат отображения даты-времени по умолчанию (для вызова format() без аргументов).
    static get defaultFormat(): string {
        return defaultFormat
    }

    // Текущая дата и время.
    static now(): DateTimeInstance {
        return dayjs()
    }

    // Для манипуляций с конкретной датой и временем.
    static parse(
        date?: DateTimeParsable,
        format?: DateTimeFormatConfig,
        strict?: boolean
    ): DateTimeInstance {
        return dayjs(date, format, strict)
    }

    // Для манипуляций с конкретной датой и временем в конкретной локали.
    static parseWithLocale(
        date?: DateTimeParsable,
        format?: DateTimeFormatConfig,
        locale?: string,
        strict?: boolean
    ): DateTimeInstance {
        return dayjs(date, format, locale, strict)
    }

    // Для манипуляций с конкретной датой и временем из UNIX timestamp (t в секундах).
    static unix(t: number): DateTimeInstance {
        return this.unixSeconds(t)
    }

    // Для манипуляций с конкретной датой и временем из UNIX timestamp (t в секундах).
    static unixSeconds(t: number): DateTimeInstance {
        return dayjs.unix(t)
    }

    // Для манипуляций с конкретной датой и временем из UNIX timestamp (t в миллисекундах).
    static unixMs(t: number): DateTimeInstance {
        return dayjs.unix(t / 1000)
    }

    // Время в UTC.
    static utc(
        date?: DateTimeParsable,
        format?: DateTimeFormatConfig,
        strict?: boolean
    ): DateTimeInstance {
        return dayjs.utc(date, format as string, strict)
    }

    // Проверка, является ли переданное значение экземпляром используемой библиотеки?
    static isInstance(value: unknown): boolean {
        return dayjs.isDayjs(value)
    }
}
