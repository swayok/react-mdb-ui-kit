import type {
    ReactNode,
    RefObject,
} from 'react'
import type {
    AnyRef,
    HtmlComponentProps,
    MorphingHtmlComponentProps,
} from '../../types'
import type {ButtonProps} from '../Button'

// Стандартная структура:
// Modal
//      ModalDialog
//          ModalContent
//              ModalHeader
//                  ModalTitle
//                  ModalHeaderCloseButton
//              ModalBody
//                  содержимое
//              ModalFooter
//                  Button
//                  ModalFooterCloseButton
export interface ModalProps extends Omit<HtmlComponentProps<HTMLDivElement>, 'size'> {
    // Показать окно или нет. Когда null - окно демонтируется.
    // Полезно, чтобы не засорять страницу кучей закрытых окон.
    // Это так же позволяет использовать окна в таблицах данных без необходимости
    // выносить их куда-то для оптимизации.
    // Процесс закрытия и демонтажа окна 2х-этапный:
    // 1. onClose = () => this.setState({modalVisible: false}) - запуск анимации закрытия окна;
    // 2. onClosed = () => this.setState({modalVisible: null}) - демонтаж окна.
    show?: boolean | null
    // false: Не показывать.
    backdrop?: boolean
    // Z-index окна (можно открыть несколько окон поверх друг-друга).
    depth?: number
    // true: Закрыть окно нажатии на ESC.
    closeOnEsc?: boolean
    // false: Закрыть окно при клике вне окна.
    staticBackdrop?: boolean
    // Запуск закрытия окна
    onClose?: () => void
    // Окно закрыто (включая анимацию).
    onClosed?: () => void
    // Запуск отображения окна (анимация).
    // Здесь можно очистить состояние компонента, в котором настраивается окно,
    // и запустить загрузку данных извне.
    onShow?: () => void
    // Окно отображено и готово к использованию.
    onShown?: () => void
    // true: Не добавлять компонент ModalDialog автоматически.
    noDialog?: boolean
    // CSS классы для автоматически добавленного ModalDialog.
    dialogClassName?: string
    // CSS ID для автоматически добавленного ModalDialog.
    dialogId?: string
    // Другие свойства для автоматически добавленного ModalDialog.
    dialogProps?: ModalDialogProps
    // true (default): Отцентрировать модальное окно в окне браузера.
    centered?: ModalDialogProps['centered']
    // Размер окна.
    size?: ModalDialogProps['size']
    // true: Настроить ModalBody для включения скроллинга,
    // если содержимое больше размера окна браузера.
    scrollable?: ModalDialogProps['scrollable']
    // Если окно содержит вставку данных, которые нужно сначала получить извне,
    // то вместо использования children лучше использовать render,
    // чтобы не усложнять верстку проверками наличия данных.
    render?: ReactNode | (() => ReactNode)
    // Ожидается только 1 элемент внутри.
    // Обычно ModalContent.
    // Не используется, если задан render.
    children?: ReactNode
    // Ссылка на самый верхний элемент окна (содержит backdrop и само окно)
    modalRef?: RefObject<HTMLDivElement>
    // Контейнер модальных окон, по умолчанию: document.body.
    // Строка - CSS ID контейнера.
    container?: HTMLElement | string
}

export interface ModalDialogProps extends Omit<HtmlComponentProps<HTMLDivElement>, 'size'> {
    ref?: AnyRef<HTMLDivElement>
    // true (default): Отцентрировать модальное окно в окне браузера.
    centered?: boolean
    // Размер окна
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
        | 'fullscreen-sm-down' | 'fullscreen-md-down' | 'fullscreen-lg-down'
        | 'fullscreen-xl-down' | 'fullscreen-xxl-down'
    // true: Настроить ModalBody для включения скроллинга,
    // если содержимое больше размера окна браузера.
    scrollable?: boolean
}

export interface ModalContentProps extends HtmlComponentProps<HTMLDivElement> {
    ref?: AnyRef<HTMLDivElement>
}

export interface ModalHeaderProps extends Omit<HtmlComponentProps<HTMLDivElement>, 'title'> {
    ref?: AnyRef<HTMLDivElement>
    // Если задано, то автоматически добавляет компонент
    // ModalTitle с указанным title.
    title?: string | null
    // Свойства для автоматически добавленного ModalTitle.
    titleProps?: ModalTitleProps
    // Если задано, то автоматически добавляет компонент
    // ModalHeaderCloseButton с указанным onClose.
    onClose?: ModalProps['onClose']
    // Свойства для автоматически добавленного ModalHeaderCloseButton.
    closeButtonProps?: ButtonProps
    // true (default): Добавить нижний border.
    border?: boolean
}

export type ModalTitleProps = MorphingHtmlComponentProps

export interface ModalHeaderCloseButtonProps extends Omit<ButtonProps, 'onClick'> {
    // true: Кнопка находится вне <ModalHeader>.
    floating?: boolean
    // Запуск закрытия окна.
    onClose: () => void
    // Белая версия.
    white?: boolean
}

export interface ModalBodyProps extends HtmlComponentProps<HTMLDivElement> {
    ref?: AnyRef<HTMLDivElement>
}

export interface ModalFooterProps extends HtmlComponentProps<HTMLDivElement> {
    ref?: AnyRef<HTMLDivElement>
    // true (default): Добавить верхний border.
    border?: boolean
    // true: Добавить CSS класс justify-content-between flex-nowrap.
    flexBetween?: boolean
    // true: Добавить CSS класс justify-content-center.
    center?: boolean
}

export interface ModalFooterCloseButtonProps extends Omit<ButtonProps, 'color' | 'colorMod' | 'children' | 'onClick'> {
    // Замена текста кнопки. По умолчанию: trans().common.modal.close.
    title: string
    // Запуск закрытия окна.
    onClose: () => void
}
