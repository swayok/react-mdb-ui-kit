import type {UILayout} from '../types'

const map: Record<UILayout['bootstrapSize'], number> = {
    xxs: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 6,
}

// Получить порядковый номер Bootstrap брейкпоинта.
export function getBootstrapSizeIndex(bootstrapSize: UILayout['bootstrapSize']): number {
    return map[bootstrapSize]
}
