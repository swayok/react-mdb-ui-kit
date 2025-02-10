import {
    AnyObject,
    BasicLanguageConfig,
    BasicRegionConfig,
    FormSelectOption,
    FormSelectOptionsList,
} from '../types/Common'
import LanguagesManager from '../helpers/LanguagesManager'
import RegionsManager from '../helpers/RegionsManager'
import NumbersService from '../services/NumbersService'

// Сервис для работы с языками и регионами приложения.
export class LocaleService<
    LanguageCode extends string = string,
    RegionCode extends string = string,
    LanguageConfig extends BasicLanguageConfig<LanguageCode, RegionCode> = BasicLanguageConfig<LanguageCode, RegionCode>,
    Translations extends object = AnyObject,
    RegionConfig extends BasicRegionConfig<RegionCode, LanguageCode> = BasicRegionConfig<RegionCode, LanguageCode>,
> {

    // Менеджер языков.
    readonly languagesManager: LanguagesManager<LanguageConfig, Translations, LanguageCode>
    // Менеджер регионов.
    readonly regionsManager: RegionsManager<RegionConfig, RegionCode>

    // Конструктор.
    constructor(
        languages: AnyObject<LanguageConfig, LanguageCode>,
        defaultLanguage: LanguageConfig,
        regions: AnyObject<RegionConfig, RegionCode>,
        defaultRegion: RegionConfig
    ) {
        this.languagesManager = new LanguagesManager<LanguageConfig, Translations, LanguageCode>(
            languages,
            defaultLanguage
        )
        this.regionsManager = new RegionsManager<RegionConfig, RegionCode>(
            regions,
            defaultRegion
        )

        // Регистрируем локали в NumbersService.
        NumbersService.registerLocales(
            languages,
            defaultLanguage,
            regions,
            defaultRegion
        )
    }

    // Локаль по умолчанию.
    get defaultLanguage(): LanguageConfig {
        return this.languagesManager.getDefaultLanguage()
    }

    // Регион по умолчанию.
    get defaultRegion(): RegionConfig {
        return this.regionsManager.getDefaultRegion()
    }

    // Получить список опций для компонентов смены региона и языка.
    getLanguagesListAsOptions(): FormSelectOptionsList<LanguageCode, LanguageConfig> {
        return this.languagesManager.getLanguagesListAsOptions() as FormSelectOption<LanguageCode, LanguageConfig>[]
    }

    // Получить список опций для компонентов смены региона и языка.
    getRegionsListAsOptions(): FormSelectOptionsList<RegionCode, RegionConfig> {
        return this.regionsManager.getRegionsListAsOptions() as FormSelectOption<RegionCode, RegionConfig>[]
    }

    // Определение локали разными способами.
    detectLanguage(): LanguageConfig {
        return this.languagesManager.detectLanguage()
    }

    // Определение региона разными способами.
    detectRegion(): RegionConfig {
        return this.regionsManager.detectRegion()
    }

    // Установка и настройка основного региона.
    setPrimaryRegion(region: RegionConfig): void {
        return this.regionsManager.setPrimaryRegion(region)
    }

    // Текущая локаль.
    get primaryRegion(): RegionConfig {
        return this.regionsManager.getPrimaryRegion()
    }

    // Поиск поддерживаемого региона.
    normalizeRegion(regionOrLocale: string | null): RegionConfig | null {
        return this.regionsManager.findRegion(regionOrLocale)
    }

    // Поиск поддерживаемого языка.
    normalizeLanguage(languageOrLocale: string | null): LanguageConfig | null {
        return this.languagesManager.findLanguage(languageOrLocale)
    }

    // Загрузка словаря для локали (асинхронная).
    async loadTranslations(
        languageConfig: LanguageConfig,
        useAsPrimary: boolean,
        reload: boolean = false
    ): Promise<Translations> {
        return this.languagesManager.loadTranslations(languageConfig, useAsPrimary, reload)
    }

    // Словарь для текущей локали.
    get translations() {
        return this.languagesManager.getTranslations()
    }

    // Имя URL Query аргумента для задания новой локали.
    get urlQueryArgName(): string {
        return LanguagesManager.getUrlQueryArgName()
    }

    // Текущая локаль.
    get primaryLanguage(): LanguageConfig {
        return this.languagesManager.getPrimaryLanguage()
    }

    // Сменить текущую локаль.
    switchLanguage(languageConfig: LanguageConfig): Promise<Translations> {
        return this.languagesManager.loadTranslations(languageConfig, true)
    }

    // Регистрация обработчика обновления строк локали (только в режиме dev hot/watch).
    onLanguageReload(name: string, callback: () => void): void {
        this.languagesManager.onLanguageReload(name, callback)
    }
}
