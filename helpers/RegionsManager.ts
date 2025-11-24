import {BasicRegionConfig} from '../types/Locale'
import {AnyObject, FormSelectOption, FormSelectOptionsList} from '../types/Common'
import NumbersService from '../services/NumbersService'

// Автоматически определенная локаль.
let detectedRegion: BasicRegionConfig | undefined

// Менеджер регионов (определение, хранение, загрузка, изменение).
export default class RegionsManager<
    RegionConfigType extends BasicRegionConfig = BasicRegionConfig,
    RegionCode extends string = string
> {
    // Имя URL Query аргумента для задания новой локали.
    private static readonly defaultUrlQueryArgName: string = 'region'
    // Список доступных локалей.
    private readonly regions: AnyObject<RegionConfigType, RegionCode>
    // Локаль по умолчанию.
    private readonly defaultRegion: RegionConfigType

    // Основная локаль.
    private primaryRegion: RegionConfigType

    // Имя URL Query аргумента для изменения языка интерфейса.
    static getUrlQueryArgName(): string {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.regionUrlQueryArgName ?? this.defaultUrlQueryArgName
    }

    // Конструктор.
    constructor(
        regions: AnyObject<RegionConfigType, RegionCode>,
        defaultRegion: RegionConfigType
    ) {
        this.regions = regions
        this.defaultRegion = defaultRegion
        this.primaryRegion = defaultRegion
    }

    // Список локалей.
    getRegions(): AnyObject<RegionConfigType, RegionCode> {
        return this.regions
    }

    // Локаль по умолчанию.
    getDefaultRegion(): RegionConfigType {
        return this.defaultRegion
    }

    // Текущая локаль.
    getPrimaryRegion(): RegionConfigType {
        return this.primaryRegion
    }

    // Получить список опций для компонентов смены локализации
    getRegionsListAsOptions(): FormSelectOptionsList<RegionCode, RegionConfigType> {
        const ret: FormSelectOption<RegionCode, RegionConfigType>[] = []
        for (const key in this.regions) {
            const config: RegionConfigType = this.regions[key]
            ret.push({
                value: config.region as RegionCode,
                label: config.label,
                extra: config,
            })
        }
        return ret
    }

    // Определение локали разными способами.
    detectRegion(): RegionConfigType {
        if (detectedRegion) {
            return detectedRegion as RegionConfigType
        }
        // Поиск в глобальной конфигурации.
        const globalConfigLanguage = this.findRegion(
            this.getRegionFromGlobalConfig()
        )
        if (globalConfigLanguage) {
            detectedRegion = globalConfigLanguage
            return globalConfigLanguage
        }
        // Поискать подходящую локаль среди языков браузера.
        const languages = this.getLanguagesFromUserAgent()
        for (const item of languages) {
            const language: RegionConfigType | null = this.findRegion(item)
            if (language) {
                return detectedRegion = language
            }
        }
        // Локали не найдено - используем локаль по умолчанию.
        return detectedRegion = this.defaultRegion
    }

    // Поиск поддерживаемой локали по коду или языку.
    findRegion(
        languageOrLocale: string | null
    ): RegionConfigType | null {
        if (!languageOrLocale) {
            return null
        }
        for (const key in this.regions) {
            const language = this.regions[key]
            if (this.regions[key].variations.includes(languageOrLocale.toLowerCase())) {
                return language
            }
        }
        return null
    }

    // Поиск поддерживаемой локали по коду или языку или возврат локали по умолчанию.
    findRegionOrDefault(
        languageOrLocale: string | null
    ): RegionConfigType {
        if (languageOrLocale) {
            for (const key in this.regions) {
                const language = this.regions[key]
                if (this.regions[key].variations.includes(languageOrLocale.toLowerCase())) {
                    return language
                }
            }
        }
        return this.getDefaultRegion()
    }

    // Установка и настройка основного региона.
    setPrimaryRegion(config: RegionConfigType): void {
        this.primaryRegion = config
        // Меняем регион форматирования чисел.
        NumbersService.setRegion(config.region)
    }

    // Достать локаль из URL.
    private getRegionFromGlobalConfig(): string | null {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.region ?? null
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


