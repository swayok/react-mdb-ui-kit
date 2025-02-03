import DateTimeService from './DateTimeService'
import {AnyObject} from '../types/Common'

// Сервис кэширования данных в window.localStorage или this.sessionStorage.
export class CacheServiceClass<NameT extends string = string> {

    // Префикс для имени ключа в window.localStorage.
    private readonly keyNamePrefix: string = ''
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
        defaultLifetimeMinutes: number = 60
    ) {
        this.keyNamePrefix = keyNamePrefix
        this.preferSessionStorage = preferSessionStorage
        this.defaultLifetimeMinutes = defaultLifetimeMinutes
    }

    // Получить актуальные данные из кэша.
    get<Type = unknown>(
        name: NameT,
        regionOrLang: string
    ): null | Type {
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
        regionOrLang: string,
        data: null | Type,
        // Срок жизни кеша в минутах. Минимум: 1 минута. По умолчанию: this.defaultLifetimeMinutes.
        lifetimeMinutes?: number,
        // Если true, то нужно сохранить данные в this.sessionStorage, а не в window.localStorage.
        useSessionStorage?: boolean
    ): void {
        if (lifetimeMinutes === undefined) {
            lifetimeMinutes = this.defaultLifetimeMinutes
        } else if (lifetimeMinutes <= 0) {
            lifetimeMinutes = 1
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

    // Получить актуальные данные из кеша, загрузив их через loader(), если потребуется.
    async remember<Type = unknown>(
        name: NameT,
        regionOrLang: string,
        // Загрузчик данных для кеширования.
        loader: () => Promise<Type>,
        // Срок жизни кеша в минутах. Минимум: 1 минута. По умолчанию: this.defaultLifetimeMinutes.
        lifetimeMinutes?: number,
        // Если true, то нужно сохранить данные в this.sessionStorage, а не в window.localStorage.
        useSessionStorage?: boolean,
        // Если true, то нужно обновить данные в кеше (вызвать loader() и сохранить результат).
        refresh: boolean = false
    ): Promise<Type> {
        let data: Type | null = refresh ? null : this.get<Type>(name, regionOrLang)
        if (!data) {
            data = await loader()
            this.set(name, regionOrLang, data, lifetimeMinutes, useSessionStorage)
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
            && DateTimeService.unix(cacheItem.exp).isAfter()
        )
    }
}

interface CacheItem<Type> {
    uid: string;
    data: Type;
    exp: number;
}

export default (new CacheServiceClass())
