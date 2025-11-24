import {AnyObject} from '../types/Common'
import {BasicLanguageConfig, BasicRegionConfig} from '../types/Locale'
import numeral from 'numeral'

interface CurrentLocale {
    language: string
    region: string | null
    code: string
    defaultFormat: string
}

// Сервис настройки пакета numeral.
class NumbersService {

    // Формат чисел по умолчанию.
    private defaultFormat: string = '0,0[.]00'

    // Текущая локаль.
    private currentLocale: CurrentLocale = {
        language: 'en',
        region: null,
        code: 'en',
        defaultFormat: this.defaultFormat,
    }

    // Стандартное форматирование чисел для каждого региона.
    private formatsByRegion: AnyObject<string> = {}

    // Стандартный формат чисел.
    get numberFormat(): string {
        return this.currentLocale.defaultFormat
    }

    // Символ валюты.
    get currencySymbol(): string {
        return numeral.locales[this.currentLocale.code].currency.symbol || ''
    }

    // Разделитель целой и дробной части числа.
    get decimalSeparator(): string {
        return numeral.locales[this.currentLocale.code].delimiters.decimal || '.'
    }

    // Разделитель тысяч.
    get thousandsSeparator(): string {
        return numeral.locales[this.currentLocale.code].delimiters.thousands || ''
    }

    // Регистрация локализаций в numeral.
    registerLocales(
        languages: AnyObject<BasicLanguageConfig>,
        defaultLanguage: BasicLanguageConfig,
        regions: AnyObject<BasicRegionConfig> | null = null,
        defaultRegion: BasicRegionConfig | null = null
    ): void {
        // Внимание: нельзя удалять numeral.locales полностью т.к. numeral ломается!

        // Собираем форматы чисел по умолчанию для каждого региона.
        this.formatsByRegion = {}
        for (const key in regions) {
            this.formatsByRegion[regions[key].region] = regions[key].numeral.defaultFormat
        }
        // Добавляем локали в numeral.
        for (const lang in languages) {
            const languageConfig = languages[lang]
            // Удаляем существующие локали в numeral.
            // Если не удалять, то ругается в режиме dev hot/watch.
            delete numeral.locales[languageConfig.language]
            // Локаль = язык.
            numeral.register(
                'locale',
                languageConfig.language,
                {
                    ...languageConfig.numeral.localeConfig,
                    currency: {
                        // Символ валюты относится к региону, а не к языку,
                        // поэтому тут мы залаем пустую строку.
                        symbol: '',
                    },
                }
            )
            // Локаль = язык + регион.
            for (const region in regions) {
                const regionConfig = regions[region]
                const localeCode: string = this.getLocaleCode(
                    languageConfig.language,
                    regionConfig.region
                )
                // Удаляем существующие локали в numeral.
                // Если не удалять, то ругается в режиме dev hot/watch.
                delete numeral.locales[localeCode]
                numeral.register(
                    'locale',
                    localeCode,
                    {
                        ...languageConfig.numeral.localeConfig,
                        ...regionConfig.numeral.localeConfig,
                    }
                )
            }
        }
        // Формируем текущую локаль из настроек по умолчанию.
        this.currentLocale = {
            language: defaultLanguage.language,
            region: defaultRegion?.region ?? null,
            defaultFormat: '', //< само установится.
            code: '', //< само установится.
        }
        // Применяем настройки для локали по умолчанию.
        this.onCurrentLocaleChange()
    }

    // Обновление настроек numeral при изменении языка.
    setLanguage(language: string): void {
        this.currentLocale.language = language
        this.onCurrentLocaleChange()
    }

    // Обновление настроек numeral при изменении региона.
    setRegion(region: string | null): void {
        this.currentLocale.region = region
        this.onCurrentLocaleChange()
    }

    // Применение настроек numeral при изменении текущего языка и/или региона.
    private onCurrentLocaleChange(): void {
        numeral.reset()
        this.currentLocale.defaultFormat = this.currentLocale.region
            ? (this.formatsByRegion[this.currentLocale.region] ?? this.defaultFormat)
            : this.defaultFormat
        numeral.defaultFormat(this.currentLocale.defaultFormat)
        this.currentLocale.code = this.getLocaleCode(
            this.currentLocale.language,
            this.currentLocale?.region ?? null
        )
        numeral.locale(this.currentLocale.code)
    }

    // Код локали для numeral.
    private getLocaleCode(language: string, region: string | null): string {
        return region ? language + '-' + region : language
    }
}

export default (new NumbersService())
