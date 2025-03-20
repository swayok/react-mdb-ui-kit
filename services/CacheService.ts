import DateTimeService from './DateTimeService'
import {AnyObject} from '../types/Common'

// Сервис кэширования данных в window.localStorage или this.sessionStorage.
export class CacheServiceClass<NameT extends string = string> {

    // Префикс для имени ключа в window.localStorage.
    private readonly keyNamePrefix: string = ''
    // Регион или язык по умолчанию.
    private readonly defaultRegionOrLang: () => string = () => 'any'
    // Предпочитать использование this.sessionStorage, если явно не указано хранилище.
    private readonly preferSessionStorage: boolean = false
    // Срок жизни кэша по умолчанию (в минутах).
    private readonly defaultLifetimeMinutes: number = 60

    // Хранилище кэша текущей сессии (перезагрузка страницы сбрасывает кэш).
    private sessionStorage: AnyObject<CacheItem<unknown>, NameT> = {}

    // Конструктор.
    constructor(
        keyNamePrefix: string = '',
        preferSessionStorage: boolean = false,
        defaultLifetimeMinutes: number = 60,
        defaultRegionOrLang: string | (() => string) = 'any'
    ) {
        this.keyNamePrefix = keyNamePrefix
        this.preferSessionStorage = preferSessionStorage
        this.defaultLifetimeMinutes = defaultLifetimeMinutes
        this.defaultRegionOrLang = typeof defaultRegionOrLang === 'string'
            ? (): string => defaultRegionOrLang
            : defaultRegionOrLang
    }

    // Получить актуальные данные из кэша.
    get<Type = unknown>(
        name: NameT,
        regionOrLang?: string
    ): null | Type {
        if (regionOrLang === undefined) {
            regionOrLang = this.defaultRegionOrLang()
        }
        if (name in this.sessionStorage) {
            const data: CacheItem<unknown> = this.sessionStorage[name]
            if (this.isValidCachedData(data, regionOrLang)) {
                return data.data as Type
            } else {
                this.forget(name)
                return null
            }
        }
        const json: null | string = window.localStorage.getItem(this.getLocalStorageName(name))
        if (!json) {
            return null
        }
        try {
            const data: CacheItem<Type> = JSON.parse(json) as CacheItem<Type>
            if (this.isValidCachedData(data, regionOrLang)) {
                return data.data
            }
        } catch (_e) {
            /* Испорченный json: игнорируем */
        }
        // Некорректные данные в кэше: удаляем.
        this.forget(name)
        return null
    }

    // Сохранить данные в кэш.
    set<Type = unknown>(
        name: NameT,
        data: null | Type,
        // Срок жизни кеша в минутах. Минимум: 1 минута. По умолчанию: this.defaultLifetimeMinutes.
        lifetimeMinutes?: number,
        // Регион или язык, для которого актуален кэш. При несовпадении, кеш сбрасывается.
        regionOrLang?: string,
        // Если true, то нужно сохранить данные в this.sessionStorage, а не в window.localStorage.
        useSessionStorage?: boolean
    ): void {
        if (lifetimeMinutes === undefined) {
            lifetimeMinutes = this.defaultLifetimeMinutes
        } else if (lifetimeMinutes <= 0) {
            lifetimeMinutes = 1
        }
        if (regionOrLang === undefined) {
            regionOrLang = this.defaultRegionOrLang()
        }
        if (useSessionStorage === undefined) {
            useSessionStorage = this.preferSessionStorage
        }
        if (data) {
            const cacheItem: CacheItem<Type> = {
                uid: regionOrLang,
                data,
                exp: DateTimeService.now().add(lifetimeMinutes, 'minutes').unix(),
            }
            if (useSessionStorage) {
                this.sessionStorage[name] = cacheItem
            } else {
                window.localStorage.setItem(
                    this.getLocalStorageName(name),
                    JSON.stringify(cacheItem)
                )
            }
        } else {
            this.forget(name)
        }
    }

    /**
     * Получить актуальные данные из кеша, загрузив их через loader(), если потребуется.
     * @param {string} name Имя ключа в кэше.
     * @param {function} loader Загрузчик данных для кеширования.
     * @param {number} lifetimeMinutes Срок жизни кеша в минутах. Минимум: 1 минута. По умолчанию: this.defaultLifetimeMinutes.
     * @param {string} regionOrLang Регион или язык, для которого актуален кэш. При несовпадении, кеш сбрасывается.
     * @param {boolean} useSessionStorage Если true, то нужно сохранить данные в this.sessionStorage, а не в window.localStorage.
     * @param {boolean} refresh Если true, то нужно обновить данные в кеше (вызвать loader() и сохранить результат).
     * @returns {Promise<Type>} Актуальные данные из кеша.
     */
    async remember<Type = unknown>(
        name: NameT,
        loader: () => Promise<Type>,
        lifetimeMinutes?: number,
        regionOrLang?: string,
        useSessionStorage?: boolean,
        refresh: boolean = false
    ): Promise<Type> {
        let data: Type | null = refresh ? null : this.get<Type>(name, regionOrLang)
        if (!data) {
            data = await loader()
            this.set(name, data, lifetimeMinutes, regionOrLang, useSessionStorage)
        }
        return data
    }

    /**
     * Получить актуальные данные из кеша в window.localStorage,
     * загрузив их через loader(), если потребуется.
     *
     * @param {string} name Имя ключа в кэше.
     * @param {function} loader Загрузчик данных для кеширования.
     * @param {number} lifetimeMinutes Срок жизни кеша в минутах. Минимум: 1 минута. По умолчанию: this.defaultLifetimeMinutes.
     * @param {string} regionOrLang Регион или язык, для которого актуален кэш. При несовпадении, кеш сбрасывается.
     * @param {boolean} refresh Если true, то нужно обновить данные в кеше (вызвать loader() и сохранить результат).
     * @returns {Promise<Type>} Актуальные данные из кеша.
     */
    async rememberToStorage<Type = unknown>(
        name: NameT,
        loader: () => Promise<Type>,
        lifetimeMinutes?: number,
        regionOrLang?: string,
        refresh: boolean = false
    ): Promise<Type> {
        let data: Type | null = refresh ? null : this.get<Type>(name, regionOrLang)
        if (!data) {
            data = await loader()
            this.set(name, data, lifetimeMinutes, regionOrLang, false)
        }
        return data
    }

    /**
     * Получить актуальные данные из кеша в this.sessionStorage,
     * загрузив их через loader(), если потребуется.
     *
     * @param {string} name Имя ключа в кэше.
     * @param {function} loader Загрузчик данных для кеширования.
     * @param {number} lifetimeMinutes Срок жизни кеша в минутах. Минимум: 1 минута. По умолчанию: this.defaultLifetimeMinutes.
     * @param {string} regionOrLang Регион или язык, для которого актуален кэш. При несовпадении, кеш сбрасывается.
     * @param {boolean} refresh Если true, то нужно обновить данные в кеше (вызвать loader() и сохранить результат).
     * @returns {Promise<Type>} Актуальные данные из кеша.
     */
    async rememberToSession<Type = unknown>(
        name: NameT,
        loader: () => Promise<Type>,
        lifetimeMinutes?: number,
        regionOrLang?: string,
        refresh: boolean = false
    ): Promise<Type> {
        let data: Type | null = refresh ? null : this.get<Type>(name, regionOrLang)
        if (!data) {
            data = await loader()
            this.set(name, data, lifetimeMinutes, regionOrLang, true)
        }
        return data
    }

    // Удалить данные из кэша.
    forget(name: string): void {
        delete this.sessionStorage[name]
        window.localStorage.removeItem(this.getLocalStorageName(name))
    }

    // Модификация имени ключа в window.localStorage.
    private getLocalStorageName(name: string): string {
        return this.keyNamePrefix + name
    }

    // Проверка валидности и актуальности кэшированных данных.
    private isValidCachedData(
        cacheItem: CacheItem<unknown>,
        regionOrLang: string
    ): boolean {
        return (
            typeof cacheItem === 'object'
            && 'uid' in cacheItem
            && 'data' in cacheItem
            && 'exp' in cacheItem
            && cacheItem.uid === regionOrLang
            && DateTimeService.unixSeconds(cacheItem.exp).isAfter()
        )
    }
}

interface CacheItem<Type> {
    uid: string;
    data: Type;
    exp: number;
}

export default (new CacheServiceClass())
