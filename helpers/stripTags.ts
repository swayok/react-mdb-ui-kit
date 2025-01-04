// Удалить все HTML теги из текста.
export function stripTags(text: string) {
    return text.replace(/<[^>]*>/g, '')
}
