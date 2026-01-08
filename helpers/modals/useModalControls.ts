import {
    Dispatch,
    SetStateAction,
    useState,
} from 'react'
import {ModalProps} from '../../components/Modal/ModalTypes'
import {useEventCallback} from '../useEventCallback'

// Возвращаемые данные и функции хука.
export interface UseModalControlsHookReturn {
    // Показать/скрыть модальное окно.
    isModalVisible: boolean | null
    // Установить значение showModal.
    setIsModalVisible: Dispatch<SetStateAction<boolean | null>>
    // Изменить значение showModal на true.
    openModal: () => void
    // Изменить значение showModal на false.
    closeModal: () => void
    // Изменить значение showModal на null.
    unmountModal: () => void
    // Объект событий для модального окна.
    modalProps: Pick<ModalProps, 'show' | 'onClose' | 'onClosed'>
}

// Контроль открытия модального окна.
export function useModalControls(
    initialState: boolean | null = null
): UseModalControlsHookReturn {
    const [
        isModalVisible,
        setIsModalVisible,
    ] = useState<boolean | null>(initialState)

    const closeModal = useEventCallback(() => setIsModalVisible(false))
    const unmountModal = useEventCallback(() => setIsModalVisible(null))

    return {
        isModalVisible,
        setIsModalVisible,
        openModal: useEventCallback(() => setIsModalVisible(true)),
        closeModal,
        unmountModal,
        modalProps: {
            show: isModalVisible,
            onClose: closeModal,
            onClosed: unmountModal,
        },
    }
}
