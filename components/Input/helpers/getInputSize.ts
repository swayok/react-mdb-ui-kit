import {InputSize} from '../InputTypes'

// Вычислить размер поля ввода.
export function getInputSize(
    small?: boolean,
    large?: boolean
): InputSize {
    if (small && !large) {
        return 'small'
    } else if (large && !small) {
        return 'large'
    }
    return 'normal'
}
