import {NumbersService} from '../services/NumbersService'
import {
    BasicRegionConfig,
    FormSelectOption,
    FormSelectOptionsList,
    PartialRecord,
} from '../types'

// Автоматически определенный регион.
let detectedRegion: BasicRegionConfig | undefined

// Менеджер регионов (определение, хранение, загрузка, изменение).
export class RegionsManager<
    RegionCode extends string = string,
    RegionConfigType extends BasicRegionConfig<RegionCode> = BasicRegionConfig<RegionCode>,
> {

    // Имя URL Query аргумента для задания нового региона.
    private static readonly defaultUrlQueryArgName: string = 'region'
    // Список доступных регионов.
    private readonly regions: PartialRecord<RegionCode, RegionConfigType>
    // Регион по умолчанию.
    private readonly defaultRegion: RegionConfigType

    // Основной регион.
    private primaryRegion: RegionConfigType

    // Имя URL Query аргумента для изменения региона.
    static getUrlQueryArgName(): string {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.regionUrlQueryArgName ?? this.defaultUrlQueryArgName
    }

    // Конструктор.
    constructor(
        regions: PartialRecord<RegionCode, RegionConfigType>,
        defaultRegion: RegionConfigType
    ) {
        this.regions = regions
        this.defaultRegion = defaultRegion
        this.primaryRegion = defaultRegion
    }

    // Список регионов.
    getRegions(): PartialRecord<RegionCode, RegionConfigType> {
        return this.regions
    }

    // Регион по умолчанию.
    getDefaultRegion(): RegionConfigType {
        return this.defaultRegion
    }

    // Текущий регион.
    getPrimaryRegion(): RegionConfigType {
        return this.primaryRegion
    }

    // Получить список опций для компонентов смены региона
    getRegionsListAsOptions(): FormSelectOptionsList<RegionCode, RegionConfigType> {
        const ret: FormSelectOption<RegionCode, RegionConfigType>[] = []
        for (const key in this.regions) {
            const config: RegionConfigType = this.regions[key]!
            ret.push({
                value: config.region,
                label: config.label,
                extra: config,
            })
        }
        return ret
    }

    // Определение региона разными способами.
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
        // Поискать подходящий регион среди языков браузера.
        const languages = this.getLanguagesFromUserAgent()
        for (const item of languages) {
            const language: RegionConfigType | null = this.findRegion(item)
            if (language) {
                return detectedRegion = language
            }
        }
        // Регион не найден - используем регион по умолчанию.
        return detectedRegion = this.defaultRegion
    }

    // Поиск поддерживаемого региона по коду или языку.
    findRegion(
        regionOrLocale: RegionCode | string | null
    ): RegionConfigType | null {
        if (!regionOrLocale) {
            return null
        }
        for (const key in this.regions) {
            const region = this.regions[key]!
            if (region.variations.includes(regionOrLocale.toLowerCase())) {
                return region
            }
        }
        return null
    }

    // Поиск поддерживаемого региона по коду или языку или возврат региона по умолчанию.
    findRegionOrDefault(
        languageOrLocale: RegionCode | string | null
    ): RegionConfigType {
        if (languageOrLocale) {
            for (const key in this.regions) {
                const region = this.regions[key]!
                if (region.variations.includes(languageOrLocale.toLowerCase())) {
                    return region
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

    // Достать регион из URL.
    private getRegionFromGlobalConfig(): string | null {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return window?.localeConfig?.region ?? null
    }

    // Достать предпочтительные регионы из User-Agent.
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
