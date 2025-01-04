// Получить значение cookie по ключу.
export default function getCookieValue(key: string): string | null {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
        return null
    }

    const cookies = document.cookie ? document.cookie.split('; ') : []
    for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split('=')
        const value = parts.slice(1).join('=')

        try {
            if (key === decodeURIComponent(parts[0])) {
                return decodeCookieValue(value)
            }
        } catch (_e) {
            // Игнорируем неправильный cookie.
        }
    }

    return null
}

// Декодирование значения из cookie.
function decodeCookieValue(value: string) {
    if (value[0] === '"') {
        value = value.slice(1, -1)
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
}
