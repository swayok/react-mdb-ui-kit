import type {NumeralJSLocale} from 'numeral'
import type {AnyObject} from './Common'

/**
 * Настройки региона и языка приложения в window.localeConfig.
 *
 * @see LanguagesManager
 * @see RegionsManager
 */
export interface LocaleGlobalConfigType {
    // Язык интерфейса.
    language?: string
    // URL Query параметр для смены языка.
    // Пример: 'lang'.
    // По умолчанию: 'lang'.
    languageUrlQueryArgName?: string
    // Регион приложения.
    region?: string
    // URL Query параметр для смены региона.
    // Пример: 'region'.
    // По умолчанию: 'region'.
    regionUrlQueryArgName?: string
}

/**
 * Базовый набор настроек языка для LanguagesManager.
 * @see LanguagesManager
 */
export interface BasicLanguageConfig<
    LanguageCode extends string = string,
    RegionCode extends string = string,
> {
    // Код языка локали: vi, ru, ...
    language: LanguageCode
    // Код региона локали: vn, ru, ...
    // todo: remove BasicLanguageConfig.region
    region: RegionCode
    // Полный код локали: vi-VN, ru-RU, ...
    full: string
    // Название локали для выпадающего меню смены локали.
    label: string
    // Вариации локали в нижнем регистре.
    variations: string[]
    // Загрузчик словаря для приложения и всех сторонних пакетов (datetime и т.п.).
    // Должен вернуть словарь для приложения.
    // Примеры:
    // () => (await import('../locales/vi')).default .
    // С загрузкой переводов из dayjs:
    // () => {
    //     await import('dayjs/locale/en.js')
    //     return (await import('../locales/en')).default
    // }
    loader: () => Promise<AnyObject>
    // Настройки форматирования чисел.
    numeral: {
        // Настройки currency относятся к региону, а не к языку.
        localeConfig: Pick<NumeralJSLocale, 'ordinal' | 'abbreviations' | 'delimiters'>
    }
    // Настройки форматирования даты и времени.
    dateTime: {
        /**
         * Формат даты для DateTimeService.
         * По умолчанию: L.
         *
         * @see DateTimeService
         * @see https://day.js.org/docs/en/display/format
         * @see https://day.js.org/docs/en/plugin/localized-format
         */
        dateFormat?: 'L' | string
    }
}

/**
 * Базовый набор настроек региона для RegionsManager.
 * @see RegionsManager
 */
export interface BasicRegionConfig<
    RegionCode extends string = string,
    LanguageCode extends string = string,
> {
    // Код региона: vn, ru, ...
    region: RegionCode
    // Языка региона по умолчанию: vi, ru, ...
    defaultLanguage: LanguageCode
    // Название локали для выпадающего меню смены локали.
    label: string
    // Вариации локали в нижнем регистре.
    variations: string[]
    // Настройки форматирования чисел.
    numeral: {
        // Остальные настройки относятся к языку, а не к региону.
        localeConfig: Pick<NumeralJSLocale, 'currency'>
        defaultFormat: string
    }
}
