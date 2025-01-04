// Выбор перевода в зависимости от числа (1 предмет, 2 предмета, 5 предметов)
export function transPlural(number: number, one: string, two: string, five: string): string {
    number = Math.abs(number) % 100
    if (number >= 11 && number <= 19) {
        return five
    } else {
        const i = number % 10
        switch (i) {
            case 1:
                return one
            case 2:
            case 3:
            case 4:
                return two
            default:
                return five
        }
    }
}
