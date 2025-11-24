import {BasicLanguageConfig} from '../types/Locale'
import {AnyObject, FormSelectOption, FormSelectOptionsList} from '../types/Common'
import {DateTimeService} from '../services/DateTimeService'
import NumbersService from '../services/NumbersService'

// Автоматически определенная локаль.
let detectedLanguage: BasicLanguageConfig | undefined

// Менеджер локализаций (определение, хранение, загрузка, изменение).
export default class LanguagesManager<
    LanguageConfigType extends BasicLanguageConfig = BasicLanguageConfig,
    DictionaryType extends object = AnyObject,
    LanguageCode extends string = string,
> {
    // Имя URL Query аргумента для задания новой локали.
    private static readonly defaultUrlQueryArgName: string = 'lang'
    // Список доступных локалей.
    private readonly languages: AnyObject<LanguageConfigType, LanguageCode>
    // Локаль по умолчанию.
    private readonly defaultLanguage: LanguageConfigType

    // Загруженные локали (строки).
    private loadedTranslations: AnyObject<DictionaryType, LanguageCode> = {}

    // Основная локаль.
    private primaryLanguage: LanguageConfigType
    // Строки для основной локали.
    private translations?: DictionaryType

    // Список обработчиков изменения строк локали (Hot Module Reload).
    private languageReloadCallbacks: AnyObject<() => void> = {}

    // Имя URL Query аргумента для изменения языка интерфейса.
    static getUrlQueryArgName(): string {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.languageUrlQueryArgName ?? this.defaultUrlQueryArgName
    }

    // Конструктор.
    constructor(
        languages: AnyObject<LanguageConfigType, LanguageCode>,
        defaultLanguage: LanguageConfigType
    ) {
        this.languages = languages
        this.defaultLanguage = defaultLanguage
        this.primaryLanguage = defaultLanguage
    }

    // Список локалей.
    getLanguages(): AnyObject<LanguageConfigType, LanguageCode> {
        return this.languages
    }

    // Локаль по умолчанию.
    getDefaultLanguage(): LanguageConfigType {
        return this.defaultLanguage
    }

    // Список загруженных словарей.
    getLoadedTranslations(): AnyObject<DictionaryType, LanguageCode> {
        return this.loadedTranslations
    }

    // Текущая локаль.
    getPrimaryLanguage(): LanguageConfigType {
        return this.primaryLanguage
    }

    // Словарь для текущей локали.
    getTranslations(): DictionaryType {
        return this.translations!
    }

    // Получить список опций для компонентов смены локализации
    getLanguagesListAsOptions(): FormSelectOptionsList<LanguageCode, LanguageConfigType> {
        const ret: FormSelectOption<LanguageCode, LanguageConfigType>[] = []
        for (const key in this.languages) {
            const config: LanguageConfigType = this.languages[key]
            ret.push({
                value: config.language as LanguageCode,
                label: config.label,
                extra: config,
            })
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
            this.getLanguageFromGlobalConfig()
        )
        if (globalConfigLanguage) {
            detectedLanguage = globalConfigLanguage
            return globalConfigLanguage
        }
        // Поискать подходящую локаль среди языков браузера.
        const languages = this.getLanguagesFromUserAgent()
        for (const item of languages) {
            const language: LanguageConfigType | null = this.findLanguage(item)
            if (language) {
                return detectedLanguage = language
            }
        }
        // Локали не найдено - используем локаль по умолчанию.
        return detectedLanguage = this.defaultLanguage
    }

    // Поиск поддерживаемой локали по коду или языку.
    findLanguage(languageOrLocale: string | null): LanguageConfigType | null {
        if (!languageOrLocale) {
            return null
        }
        for (const key in this.languages) {
            const language = this.languages[key]
            if (this.languages[key].variations.includes(languageOrLocale.toLowerCase())) {
                return language
            }
        }
        return null
    }

    // Поиск поддерживаемой локали по коду или языку или возврат локали по умолчанию.
    findLanguageOrDefault(languageOrLocale: string | null): LanguageConfigType {
        if (languageOrLocale) {
            for (const key in this.languages) {
                const language = this.languages[key]
                if (this.languages[key].variations.includes(languageOrLocale.toLowerCase())) {
                    return language
                }
            }
        }
        return this.getDefaultLanguage()
    }

    // Установка и настройка основной локали. Использовать только через loadTranslations!
    private setPrimaryLanguage(config: LanguageConfigType): void {
        this.primaryLanguage = config
        this.translations = this.loadedTranslations[config.language]
        window.document.documentElement.lang = config.language
        // Меняем язык форматирования чисел.
        NumbersService.setLanguage(config.language)
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
        for (const item of updatedFiles) {
            const language = item.replace(/^.*\/([a-z]{2})\.(tsx?|jsx?)$/, '$1')
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

    // Достать локаль из URL.
    private getLanguageFromGlobalConfig(): string | null {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.language ?? null
    }

    // Достать предпочтительные локали из User-Agent.
    private getLanguagesFromUserAgent(): string[] {
        if ('languages' in window.navigator) {
            return navigator.languages.slice()
        }
        if ('language' in window.navigator) {
            return [(window.navigator as Navigator).language]
        }
        return []
    }
}
