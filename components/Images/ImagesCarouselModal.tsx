import {useState} from 'react'
import {FadeSwitch} from '../FadeSwitch'
import {Modal} from '../Modal/Modal'
import {ModalContent} from '../Modal/ModalContent'
import {ModalHeaderCloseButton} from '../Modal/ModalHeaderCloseButton'
import {ImagesCarouselModalProps} from './ImagesPreviewerTypes'

// Модальное окно просмотра списка картинок.
export function ImagesCarouselModal(props: ImagesCarouselModalProps) {

    const {
        images,
        show,
        id,
        depth,
        currentIndex = 0,
        onClose,
        onIndexChange,
        onClosed,
    } = props

    // Индекс отображаемой фотографии.
    const [
        index,
        setIndex,
    ] = useState<number>(currentIndex)

    // Не нужно сохранять эти данные в state т.к. нам не нужны постоянные перерисовки.
    // При этом значения будут храниться до следующей перерисовки, которая произойдет
    // только при изменении вне компонента или при изменении картинки.
    // Свайп при этом должен произойти между перерисовками, а это нам и нужно.
    let touchStartX: number | null = null
    let touchEndX: number | null = null

    // Показать следующую картинку.
    const nextImage = () => {
        touchEndX = null
        touchEndX = null
        const nextIndex: number = (index + 1) % images.length
        setIndex(nextIndex)
        onIndexChange?.(nextIndex)
    }

    // Показать предыдущую картинку.
    const prevImage = () => {
        touchEndX = null
        touchEndX = null
        const prevIndex: number = index === 0 ? images.length - 1 : index - 1
        setIndex(prevIndex)
        onIndexChange?.(prevIndex)
    }

    return (
        <Modal
            show={show}
            size="fullscreen"
            closeOnEsc
            depth={depth}
            staticBackdrop
            onClose={onClose}
            onClosed={onClosed}
            onShow={() => {
                setIndex(currentIndex)
            }}
            dialogId={id}
            dialogClassName="images-carousel-modal"
            render={() => (
                <ModalContent>
                    <ModalHeaderCloseButton
                        onClose={onClose}
                    />
                    <FadeSwitch
                        transitionKey={'modal-image-' + index}
                        animationTimeout={100}
                    >
                        <div
                            className="container-md p-0 images-carousel-modal-image-container cursor flex-center"
                            onClick={nextImage}
                            onTouchStart={event => {
                                if (event.targetTouches.length === 1) {
                                    touchStartX = event.targetTouches[0].clientX
                                }
                            }}
                            onTouchMove={event => {
                                if (event.targetTouches.length > 0) {
                                    touchEndX = event.targetTouches[0].clientX
                                }
                            }}
                            onTouchEnd={() => {
                                if (touchStartX !== null && touchEndX !== null) {
                                    if (touchStartX < touchEndX) {
                                        prevImage()
                                    } else {
                                        nextImage()
                                    }
                                }
                            }}
                            onTouchCancel={() => {
                                touchStartX = null
                                touchEndX = null
                            }}
                        >
                            <div className="images-carousel-modal-image">
                                <img
                                    src={images[index]}
                                    alt=""
                                />
                            </div>
                        </div>
                    </FadeSwitch>
                </ModalContent>
            )}
        />
    )
}
