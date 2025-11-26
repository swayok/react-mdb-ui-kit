import {BasicLanguageConfig} from 'swayok-react-mdb-ui-kit/types/Locale'
import {AnyObject, FormSelectOption, FormSelectOptionsList, PartialRecord} from 'swayok-react-mdb-ui-kit/types/Common'
import {DateTimeService} from '../services/DateTimeService'
import NumbersService from '../services/NumbersService'

// Автоматически определенный язык.
let detectedLanguage: BasicLanguageConfig | undefined

// Менеджер локализаций (определение, хранение, загрузка словарей, изменение).
export default class LanguagesManager<
    LanguageCode extends string = string,
    LanguageConfigType extends BasicLanguageConfig<LanguageCode> = BasicLanguageConfig<LanguageCode>,
    DictionaryType extends object = AnyObject,
> {
    // Имя URL Query аргумента для задания нового языка.
    private static readonly defaultUrlQueryArgName: string = 'lang'
    // Список доступных языков.
    private readonly languages: PartialRecord<LanguageCode, LanguageConfigType>
    // Язык по умолчанию.
    private readonly defaultLanguage: LanguageConfigType

    // Загруженные языки (строки).
    private loadedTranslations: PartialRecord<LanguageCode, DictionaryType> = {}

    // Основной язык.
    private primaryLanguage: LanguageConfigType
    // Словарь для основного языка.
    private translations?: DictionaryType

    // Список обработчиков изменения словаря для языка (Hot Module Reload).
    private languageReloadCallbacks: AnyObject<() => void> = {}

    // Имя URL Query аргумента для изменения языка интерфейса.
    static getUrlQueryArgName(): string {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.languageUrlQueryArgName ?? this.defaultUrlQueryArgName
    }

    // Конструктор.
    constructor(
        languages: PartialRecord<LanguageCode, LanguageConfigType>,
        defaultLanguage: LanguageConfigType
    ) {
        this.languages = languages
        this.defaultLanguage = defaultLanguage
        this.primaryLanguage = defaultLanguage
    }

    // Список языков.
    getLanguages(): PartialRecord<LanguageCode, LanguageConfigType> {
        return this.languages
    }

    // Язык по умолчанию.
    getDefaultLanguage(): LanguageConfigType {
        return this.defaultLanguage
    }

    // Список загруженных словарей.
    getLoadedTranslations(): PartialRecord<LanguageCode, DictionaryType> {
        return this.loadedTranslations
    }

    // Текущий язык.
    getPrimaryLanguage(): LanguageConfigType {
        return this.primaryLanguage
    }

    // Словарь для текущего языка.
    getTranslations(): DictionaryType {
        return this.translations!
    }

    // Получить список опций для компонентов смены локализации
    getLanguagesListAsOptions(): FormSelectOptionsList<LanguageCode, LanguageConfigType> {
        const ret: FormSelectOption<LanguageCode, LanguageConfigType>[] = []
        for (const key in this.languages) {
            const config: LanguageConfigType = this.languages[key]!
            ret.push({
                value: config.language as LanguageCode,
                label: config.label,
                extra: config,
            })
        }
        return ret
    }

    // Определение языка разными способами.
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
        // Поискать подходящий язык среди языков браузера.
        const languages = this.getLanguagesFromUserAgent()
        for (const item of languages) {
            const language: LanguageConfigType | null = this.findLanguage(item)
            if (language) {
                return detectedLanguage = language
            }
        }
        // Язык не найден - используем язык по умолчанию.
        return detectedLanguage = this.defaultLanguage
    }

    // Поиск поддерживаемого языка по коду или языку.
    findLanguage(languageOrLocale: string | null): LanguageConfigType | null {
        if (!languageOrLocale) {
            return null
        }
        for (const key in this.languages) {
            const language = this.languages[key]!
            if (language.variations.includes(languageOrLocale.toLowerCase())) {
                return language
            }
        }
        return null
    }

    // Поиск поддерживаемого язык по коду или языку или возврат языка по умолчанию.
    findLanguageOrDefault(languageOrLocale: string | null): LanguageConfigType {
        if (languageOrLocale) {
            for (const key in this.languages) {
                const language = this.languages[key]!
                if (language.variations.includes(languageOrLocale.toLowerCase())) {
                    return language
                }
            }
        }
        return this.getDefaultLanguage()
    }

    // Установка и настройка основного языка. Использовать только через loadTranslations!
    private setPrimaryLanguage(config: LanguageConfigType): void {
        this.primaryLanguage = config
        this.translations = this.loadedTranslations[config.language as LanguageCode]
        window.document.documentElement.lang = config.language
        // Меняем язык форматирования чисел.
        NumbersService.setLanguage(config.language)
        // Настройка языка для сервиса работы с датой и временем.
        DateTimeService.setDefaultLanguageFromConfig(config)
    }

    // Загрузка строк для языка (асинхронная).
    async loadTranslations(
        config: LanguageConfigType,
        useAsPrimary: boolean,
        reload: boolean = false
    ): Promise<DictionaryType> {
        console.log('[LanguagesManager] Load translations => ' + config.language)
        if (reload || !this.loadedTranslations[config.language]) {
            this.loadedTranslations[config.language] = await config.loader() as DictionaryType
        }
        if (useAsPrimary) {
            this.setPrimaryLanguage(config)
        }
        return this.loadedTranslations[config.language]!
    }

    // Удалить словарь языка.
    forgetTranslations(language: LanguageCode | string): void {
        delete this.loadedTranslations[language as LanguageCode]
    }

    // Регистрация обработчика обновления словаря для языка (только в режиме dev hot/watch).
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
