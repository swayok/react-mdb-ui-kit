import {LocalStorageFallback} from './LocalStorageFallback'

let storage: Storage | null = null

// Проверяем доступность window.localStorage и возвращаем его или подмену (LocalStorageFallback).
export function getFailSafeLocalStorage(): Storage {
    if (storage) {
        return storage
    }
    try {
        // Проверка доступности window.localStorage и работы с ним.
        storage = window.localStorage
        storage.setItem('_______test', '1')
        storage.getItem('_______test')
        storage.removeItem('_______test')
    } catch (_e) {
        console.warn('[LocalStorage] Failed to access window.localStorage, using fallback.')
        storage = new LocalStorageFallback()
    }
    return storage
}
