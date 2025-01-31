import {AnyObject, BasicRegionConfig, FormSelectOption, FormSelectOptionsList} from '../types/Common'
import NumbersService from '../services/NumbersService'

// Автоматически определенная локаль.
let detectedRegion: BasicRegionConfig | undefined

// Менеджер регионов (определение, хранение, загрузка, изменение).
export default class RegionsManager<
    RegionConfigType extends BasicRegionConfig = BasicRegionConfig,
> {
    // Имя URL Query аргумента для задания новой локали.
    private static readonly defaultUrlQueryArgName: string = 'region'
    // Список доступных локалей.
    private readonly regions: AnyObject<RegionConfigType>
    // Локаль по умолчанию.
    private readonly defaultRegion: RegionConfigType

    // Основная локаль.
    private primaryRegion: RegionConfigType

    // Имя URL Query аргумента для изменения языка интерфейса.
    static getUrlQueryArgName(): string {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.config?.languageUrlQueryArgName || this.defaultUrlQueryArgName
    }

    // Конструктор.
    constructor(
        regions: AnyObject<RegionConfigType>,
        defaultRegion: RegionConfigType
    ) {
        this.regions = regions
        this.defaultRegion = defaultRegion
        this.primaryRegion = defaultRegion
    }

    // Список локалей.
    getRegions(): AnyObject<RegionConfigType> {
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
    getRegionsListAsOptions(): FormSelectOptionsList<string, RegionConfigType> {
        const ret: FormSelectOption<string, RegionConfigType>[] = []
        for (const key in this.regions) {
            const language: RegionConfigType = this.regions[key]
            ret.push({
                value: language.region,
                label: language.label,
                extra: language,
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
            getRegionFromGlobalConfig()
        )
        if (globalConfigLanguage) {
            detectedRegion = globalConfigLanguage
            return globalConfigLanguage
        }
        // Поискать подходящую локаль среди языков браузера.
        const languages = getLanguagesFromUserAgent()
        for (let i = 0; i < languages.length; i++) {
            const language: RegionConfigType | null = this.findRegion(languages[i])
            if (language) {
                return detectedRegion = language
            }
        }
        // Локали не найдено - используем локаль по умолчанию.
        return detectedRegion = this.defaultRegion
    }

    // Поиск поддерживаемой локали по коду или языку.
    findRegion<T extends BasicRegionConfig = RegionConfigType>(
        languageOrLocale: string | null
    ): T | null {
        if (!languageOrLocale) {
            return null
        }
        for (const key in this.regions) {
            const language = this.regions[key]
            if (this.regions[key].variations.includes(languageOrLocale.toLowerCase())) {
                return language as unknown as T
            }
        }
        return null
    }

    // Поиск поддерживаемой локали по коду или языку или возврат локали по умолчанию.
    findRegionOrDefault<T extends BasicRegionConfig = RegionConfigType>(
        languageOrLocale: string | null
    ): T {
        if (languageOrLocale) {
            for (const key in this.regions) {
                const language = this.regions[key]
                if (this.regions[key].variations.includes(languageOrLocale.toLowerCase())) {
                    return language as unknown as T
                }
            }
        }
        return this.getDefaultRegion() as unknown as T
    }

    // Установка и настройка основного региона.
    setPrimaryRegion(config: RegionConfigType): void {
        this.primaryRegion = config
        // Меняем регион форматирования чисел.
        NumbersService.setRegion(config.region)
    }
}

// Достать локаль из URL.
function getRegionFromGlobalConfig(): string | null {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return window?.config?.region || null
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
