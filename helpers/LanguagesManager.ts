import {AnyObject, BasicLanguageConfig, FormSelectOption, FormSelectOptionsList} from '../types/Common'
import numeral from 'numeral'
import DateTimeService from '../services/DateTimeService'

// Автоматически определенная локаль.
let detectedLanguage: BasicLanguageConfig | undefined

// Менеджер локализаций (определение, хранение, загрузка, изменение).
export default class LanguagesManager<
    LanguageConfigType extends BasicLanguageConfig = BasicLanguageConfig,
    DictionaryType = AnyObject
> {
    // Имя URL Query аргумента для задания новой локали.
    private static readonly defaultUrlQueryArgName: string = 'lang'
    // Список доступных локалей.
    private readonly languages: AnyObject<LanguageConfigType>
    // Локаль по умолчанию.
    private readonly defaultLanguage: LanguageConfigType

    // Загруженные локали (строки).
    private loadedTranslations: AnyObject<DictionaryType> = {}

    // Основная локаль.
    private primaryLanguage?: LanguageConfigType
    // Строки для основной локали.
    private translations?: DictionaryType

    // Список обработчиков изменения строк локали (Hot Module Reload).
    private languageReloadCallbacks: AnyObject<() => void> = {}

    // Имя URL Query аргумента для изменения языка интерфейса.
    static getUrlQueryArgName(): string {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.config?.languageUrlQueryArgName || this.defaultUrlQueryArgName
    }

    // Конструктор.
    constructor(
        languages: AnyObject<LanguageConfigType>,
        defaultLanguage: LanguageConfigType
    ) {
        this.languages = languages
        this.defaultLanguage = defaultLanguage

        // Регистрация локалей для numeral.
        for (const key in languages) {
            if (languages[key].language in numeral.locales) {
                // Если не удалять, то ругается в режиме dev hot/watch
                delete numeral.locales[languages[key].language]
            }
            numeral.register(
                'locale',
                languages[key].language,
                languages[key].numeral.localeConfig
            )
        }
    }

    // Список локалей.
    getLanguages(): AnyObject<LanguageConfigType> {
        return this.languages
    }

    // Локаль по умолчанию.
    getDefaultLanguage(): LanguageConfigType {
        return this.defaultLanguage
    }

    // Список загруженных словарей.
    getLoadedTranslations(): AnyObject<DictionaryType> {
        return this.loadedTranslations
    }

    // Текущая локаль.
    getPrimaryLanguage(): LanguageConfigType {
        return this.primaryLanguage as LanguageConfigType
    }

    // Словарь для текущей локали.
    getTranslations(): DictionaryType {
        return this.translations as DictionaryType
    }

    // Получить список опций для компонентов смены локализации
    getLanguagesListAsOptions(): FormSelectOptionsList<string, LanguageConfigType> {
        const ret: FormSelectOption<string, LanguageConfigType>[] = []
        for (const key in this.languages) {
            const language: LanguageConfigType = this.languages[key]
            ret.push({
                value: language.full,
                label: language.label,
                extra: language,
            })
        }
        return ret
    }

    // Получить список опций для компонентов смены языка в пределах текущей локали.
    // todo: вынести это
    getLanguagesListForPrimaryLocaleRegionAsOptions(): FormSelectOptionsList<string, LanguageConfigType> {
        const ret: FormSelectOption<string, LanguageConfigType>[] = []
        for (const key in this.languages) {
            const language: LanguageConfigType = this.languages[key]
            if (language.region === this.primaryLanguage?.region) {
                ret.push({
                    value: language.language,
                    label: language.label,
                    extra: language,
                })
            }
        }
        return ret
    }

    // Определение локали разными способами.
    detectLanguage(): LanguageConfigType {
        if (detectedLanguage) {
            return detectedLanguage as LanguageConfigType
        }
        // Поиск в глобальной конфигурации.
        const globalConfigLanguage = this.findLanguage(
            getLanguageFromGlobalConfig()
        )
        if (globalConfigLanguage) {
            detectedLanguage = globalConfigLanguage
            return globalConfigLanguage
        }
        // Поискать подходящую локаль среди языков браузера.
        const languages = getLanguagesFromUserAgent()
        for (let i = 0; i < languages.length; i++) {
            const language: LanguageConfigType | null = this.findLanguage(languages[i])
            if (language) {
                return detectedLanguage = language
            }
        }
        // Локали не найдено - используем локаль по умолчанию.
        return detectedLanguage = this.defaultLanguage
    }

    // Поиск поддерживаемой локали по коду или языку.
    findLanguage<T extends BasicLanguageConfig = LanguageConfigType>(
        languageOrLocale: string | null
    ): T | null {
        if (!languageOrLocale) {
            return null
        }
        for (const key in this.languages) {
            const language = this.languages[key]
            if (this.languages[key].variations.includes(languageOrLocale.toLowerCase())) {
                return language as unknown as T
            }
        }
        return null
    }

    // Поиск поддерживаемой локали по коду или языку или возврат локали по умолчанию.
    findLanguageOrDefault<T extends BasicLanguageConfig = LanguageConfigType>(
        languageOrLocale: string | null
    ): T {
        if (languageOrLocale) {
            for (const key in this.languages) {
                const language = this.languages[key]
                if (this.languages[key].variations.includes(languageOrLocale.toLowerCase())) {
                    return language as unknown as T
                }
            }
        }
        return this.getDefaultLanguage() as unknown as T
    }

    // Установка и настройка основной локали. Использовать только через loadTranslations!
    private setPrimaryLanguage(config: LanguageConfigType): void {
        this.primaryLanguage = config
        this.translations = this.loadedTranslations[config.language]
        window.document.documentElement.lang = config.language
        // Настройка форматирования чисел для локали
        numeral.reset()
        numeral.defaultFormat(config.numeral.defaultFormat)
        numeral.locale(config.language)
        // Настройка локали для сервиса работы с датой и временем.
        DateTimeService.setDefaultLanguageFromConfig(config)
    }

    // Загрузка строк для локали (асинхронная).
    async loadTranslations(
        config: LanguageConfigType,
        useAsPrimary: boolean,
        reload: boolean = false
    ): Promise<DictionaryType> {
        console.log('[LanguagesManager] Load translations => ' + config.language)
        if (!this.loadedTranslations[config.language] || reload) {
            this.loadedTranslations[config.language] = await config.loader() as DictionaryType
        }
        if (useAsPrimary) {
            this.setPrimaryLanguage(config)
        }
        return this.loadedTranslations[config.language]
    }

    // Удалить словарь локали.
    forgetTranslations(language: string): void {
        delete this.loadedTranslations[language]
    }

    // Регистрация обработчика обновления строк локали (только в режиме dev hot/watch).
    onLanguageReload(name: string, callback: () => void): void {
        this.languageReloadCallbacks[name] = callback
    }

    // Обрабатываем все обновленные через Hto Module Reload файлы локализаций
    // и, при необходимости, перезагружаем их.
    handleHotModuleReload(updatedFiles: string[]): void {
        for (let i = 0; i < updatedFiles.length; i++) {
            const language = updatedFiles[i].replace(/^.*\/([a-z]{2})\.(tsx?|jsx?)$/, '$1')
            if (language.length === 2) {
                if (this.getPrimaryLanguage()?.language === language) {
                    // Текущую локализацию бесшовно перезагружаем.
                    void this.loadTranslations(this.getPrimaryLanguage(), true, true)
                        .then(() => {
                            // Вызываем все подписки на изменение локализаций.
                            for (const name in this.languageReloadCallbacks) {
                                this.languageReloadCallbacks[name]?.()
                            }
                        })
                } else {
                    // Остальные локализации чистим, чтобы потом перезагрузить, когда потребуются.
                    this.forgetTranslations(language)
                }
            }
        }
    }
}

// Достать локаль из URL.
function getLanguageFromGlobalConfig(): string | null {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return window?.config?.language || null
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
