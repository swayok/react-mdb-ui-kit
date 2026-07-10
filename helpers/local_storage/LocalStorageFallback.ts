// Доступ и управление данными в локальном хранилище
// на случай недоступности window.localStorage.
export class LocalStorageFallback implements Storage {

    // eslint-disable-next-line
    [name: string]: string | any;

    // Количество элементов в хранилище.
    length: number = 0

    // Хранилище данных в виде массива пар ключ-значение.
    private storage: Array<{
        key: string
        value: string
    }> = []

    // Очистить хранилище.
    clear(): void {
        this.storage = []
        this.length = 0
    }

    // Получить значение по ключу.
    getItem(key: string): string | null {
        return this.storage.find(entry => entry.key === key)?.value ?? null
    }

    // Получить ключ по индексу.
    key(index: number): string | null {
        return this.storage[index]?.key ?? null
    }

    // Удалить значение по ключу.
    removeItem(key: string): void {
        this.storage = this.storage.filter(entry => entry.key !== key)
        this.length = this.storage.length
    }

    // Установить значение по ключу.
    setItem(key: string, value: string): void {
        const existing = this.storage.find(entry => entry.key === key)
        if (existing) {
            existing.value = value
        } else {
            this.storage.push({key, value})
            this.length = this.storage.length
        }
    }
}
