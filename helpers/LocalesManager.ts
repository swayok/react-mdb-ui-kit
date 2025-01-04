import {AnyObject, BasicLocaleConfig, FormSelectOption, FormSelectOptionsList} from '../types/Common'
import numeral from 'numeral'
import DateTimeService from '../services/DateTimeService'

type LocalStorage = {
    getLocale: () => null | string,
    setLocale: (locale: string | null) => void,
}

// Автоматически определенная локаль.
let detectedLocale: BasicLocaleConfig | undefined

// Менеджер локализаций (определение, хранение, загрузка, изменение).
export default class LocalesManager<
    LocaleConfigType extends BasicLocaleConfig = BasicLocaleConfig,
    DictionaryType = AnyObject
> {
    // Имя URL Query аргумента для задания новой локали.
    static readonly urlQueryArgName: string = 'site-locale'
    // Список доступных локалей.
    private readonly locales: AnyObject<LocaleConfigType>
    // Локаль по умолчанию.
    private readonly defaultLocale: LocaleConfigType
    // Локальное хранилище данных.
    private readonly localStorage: LocalStorage

    // Загруженные локали (строки).
    private loadedTranslations: AnyObject<DictionaryType> = {}

    // Основная локаль.
    private primaryLocale?: LocaleConfigType
    // Строки для основной локали.
    private translations?: DictionaryType

    // Список обработчиков изменения строк локали (Hot Module Reload).
    private localeReloadCallbacks: AnyObject<() => void> = {}

    // Конструктор.
    constructor(
        locales: AnyObject<LocaleConfigType>,
        defaultLocale: LocaleConfigType,
        localStorage: LocalStorage
    ) {
        this.locales = locales
        this.defaultLocale = defaultLocale
        this.localStorage = localStorage

        // Регистрация локалей для numeral.
        for (const key in locales) {
            if (locales[key].language in numeral.locales) {
                // Если не удалять, то ругается в режиме dev hot/watch
                delete numeral.locales[locales[key].language]
            }
            numeral.register(
                'locale',
                locales[key].language,
                locales[key].numeral.localeConfig
            )
        }
    }

    // Список локалей.
    getLocales(): AnyObject<LocaleConfigType> {
        return this.locales
    }

    // Локаль по умолчанию.
    getDefaultLocale(): LocaleConfigType {
        return this.defaultLocale
    }

    // Список загруженных словарей.
    getLoadedTranslations(): AnyObject<DictionaryType> {
        return this.loadedTranslations
    }

    // Текущая локаль.
    getPrimaryLocale(): LocaleConfigType {
        return this.primaryLocale as LocaleConfigType
    }

    // Словарь для текущей локали.
    getTranslations(): DictionaryType {
        return this.translations as DictionaryType
    }

    // Получить список опций для компонентов смены локализации
    getLocalesListAsOptions(): FormSelectOptionsList<string, LocaleConfigType> {
        const ret: FormSelectOption<string, LocaleConfigType>[] = []
        for (const key in this.locales) {
            const locale: LocaleConfigType = this.locales[key]
            ret.push({
                value: locale.full,
                label: locale.label,
                extra: locale,
            })
        }
        return ret
    }

    // Получить список опций для компонентов смены языка в пределах текущей локали.
    getLanguagesListForPrimaryLocaleRegionAsOptions(): FormSelectOptionsList<string, LocaleConfigType> {
        const ret: FormSelectOption<string, LocaleConfigType>[] = []
        for (const key in this.locales) {
            const locale: LocaleConfigType = this.locales[key]
            if (locale.region === this.primaryLocale?.region) {
                ret.push({
                    value: locale.language,
                    label: locale.languageLabel,
                    extra: locale,
                })
            }
        }
        return ret
    }

    // Определение локали разными способами.
    async detectLocale(): Promise<LocaleConfigType> {
        if (detectedLocale) {
            return detectedLocale as LocaleConfigType
        }
        // Поиск по URL.
        const urlLocale = this.findLocale(getLocaleFromUrl())
        if (urlLocale) {
            return detectedLocale = urlLocale
        }
        // Поискать локаль в LocalStorage.
        const localeFromStorage = this.findLocale(this.localStorage.getLocale())
        if (localeFromStorage) {
            return detectedLocale = localeFromStorage
        }
        // Поискать подходящую локаль среди языков браузера.
        const languages = getLanguagesFromUserAgent()
        for (let i = 0; i < languages.length; i++) {
            const locale: LocaleConfigType | null = this.findLocale(languages[i])
            if (locale) {
                return detectedLocale = locale
            }
        }
        // Поиск по IP.
        const countryLocale = this.findLocale(await getLocaleByIp())
        if (countryLocale) {
            return detectedLocale = countryLocale
        }
        // Локали не найдено - используем локаль по умолчанию.
        return detectedLocale = this.defaultLocale
    }

    // Поиск поддерживаемой локали по коду или языку.
    findLocale<T extends BasicLocaleConfig = LocaleConfigType>(
        languageOrLocale: string | null
    ): T | null {
        if (!languageOrLocale) {
            return null
        }
        for (const key in this.locales) {
            const locale = this.locales[key]
            if (this.locales[key].variations.includes(languageOrLocale.toLowerCase())) {
                return locale as unknown as T
            }
        }
        return null
    }

    // Поиск поддерживаемой локали по коду или языку или возврат локали по умолчанию.
    findLocaleOrDefault<T extends BasicLocaleConfig = LocaleConfigType>(
        languageOrLocale: string | null
    ): T {
        if (languageOrLocale) {
            for (const key in this.locales) {
                const locale = this.locales[key]
                if (this.locales[key].variations.includes(languageOrLocale.toLowerCase())) {
                    return locale as unknown as T
                }
            }
        }
        return this.getDefaultLocale() as unknown as T
    }

    // Сохранить локаль в local storage.
    rememberLocale(locale: LocaleConfigType): void {
        this.localStorage.setLocale(locale.full)
    }

    // Установка и настройка основной локали. Использовать только через loadTranslations!
    private setPrimaryLocale(locale: LocaleConfigType): void {
        this.primaryLocale = locale
        this.translations = this.loadedTranslations[locale.language]
        window.document.documentElement.lang = locale.language
        // Настройка форматирования чисел для локали
        numeral.reset()
        numeral.defaultFormat(locale.numeral.defaultFormat)
        numeral.locale(locale.language)
        // Настройка локали для сервиса работы с датой и временем.
        DateTimeService.setDefaultLocaleFromConfig(locale)
    }

    // Загрузка строк для локали (асинхронная).
    async loadTranslations(
        locale: LocaleConfigType,
        useAsPrimary: boolean,
        reload: boolean = false
    ): Promise<DictionaryType> {
        console.log('[LocaleService] Load translations => ' + locale.language)
        if (!this.loadedTranslations[locale.language] || reload) {
            this.loadedTranslations[locale.language] = await locale.loader() as DictionaryType
        }
        if (useAsPrimary) {
            this.setPrimaryLocale(locale)
        }
        return this.loadedTranslations[locale.language]
    }

    // Удалить словарь локали.
    forgetTranslations(locale: string): void {
        delete this.loadedTranslations[locale]
    }

    // Регистрация обработчика обновления строк локали (только в режиме dev hot/watch).
    onLocaleReload(name: string, callback: () => void): void {
        this.localeReloadCallbacks[name] = callback
    }

    // Обрабатываем все обновленные через Hto Module Reload файлы локализаций
    // и, при необходимости, перезагружаем их.
    handleHotModuleReload(updatedFiles: string[]): void {
        for (let i = 0; i < updatedFiles.length; i++) {
            const locale = updatedFiles[i].replace(/^.*\/([a-z]{2})\.(tsx?|jsx?)$/, '$1')
            if (locale.length === 2) {
                if (this.getPrimaryLocale()?.language === locale) {
                    // Текущую локализацию бесшовно перезагружаем.
                    void this.loadTranslations(this.getPrimaryLocale(), true, true)
                        .then(() => {
                            // Вызываем все подписки на изменение локализаций.
                            for (const name in this.localeReloadCallbacks) {
                                this.localeReloadCallbacks[name]?.()
                            }
                        })
                } else {
                    // Остальные локализации чистим, чтобы потом перезагрузить, когда потребуются.
                    this.forgetTranslations(locale)
                }
            }
        }
    }
}

// Достать локаль из URL.
function getLocaleFromUrl(): string | null {
    return window?.config?.locale || null
}

// Достать предпочтительные локали из User-Agent.
function getLanguagesFromUserAgent(): string[] {
    if ('languages' in window.navigator) {
        return navigator.languages.slice()
    }
    if ('language' in window.navigator) {
        return [(window.navigator as Navigator).language]
    }
    return []
}

// Достать локаль по IP.
function getLocaleByIp(): Promise<string | null> {
    return new Promise(resolve => {
        const abortController: AbortController = new AbortController()
        const timeout: number = window.setTimeout(() => {
            // Отменяем запрос, если ответ не получен за 2 секунды.
            abortController.abort()
        }, 2000)
        fetch('https://api.country.is/', {
            signal: abortController.signal,
        })
            .then(async (response: Response) => {
                clearTimeout(timeout)
                if (response.status >= 200 && response.status < 400) {
                    const responseData: { country?: string } = await response.json()
                    resolve(responseData.country?.toLowerCase() || null)
                    return
                }
                resolve(null)
            })
            .catch(() => resolve(null))
    })
}
