export type ScrollBehavior = 'auto' | 'smooth' | 'instant'

// Скроллинг страницы в начало.
export default function scrollToTop(
    behavior: ScrollBehavior = 'smooth',
    container?: HTMLElement | null
) {
    // "document.documentElement.scrollTo" is the magic for React Router Dom v6.
    (container || document.documentElement).scrollTo({
        top: 0,
        left: 0,
        behavior: behavior as never,
    })
}
