import React, {useState} from 'react'
import clsx from 'clsx'
import ImagesCarouselModal from 'swayok-react-mdb-ui-kit/components/Images/ImagesCarouselModal'
import FadeSwitch from 'swayok-react-mdb-ui-kit/components/FadeSwitch'
import {getResponsiveCssGridClassNames} from 'swayok-react-mdb-ui-kit/helpers/getResponsiveCssGridClassNames'
import {ImagesPreviewerProps} from 'swayok-react-mdb-ui-kit/types/ImagesPreviewer'

// Отображение фотографий с просмотром "на весь экран" по клику.
function ImagesPreviewer(props: ImagesPreviewerProps) {

    const {
        className,
        images,
        alt = '',
        previewsColumns = {
            xs: 3,
            sm: 4,
            md: 3,
            lg: 4,
        },
        ...otherProps
    } = props

    // Индекс выбранного фото.
    const [
        currentPhotoIndex,
        setCurrentPhotoIndex,
    ] = useState<number>(0)

    // Видимость модального окна просмотра фото в полном размере.
    const [
        isModalVisible,
        setIsModalVisible,
    ] = useState<boolean | null>(null)



    return (
        <div
            {...otherProps}
            className={clsx(
                'images-previewer',
                className
            )}
        >
            <FadeSwitch
                transitionKey={'photo-' + currentPhotoIndex}
                animationTimeout={200}
            >
                <div
                    className="images-previewer-current-image rounded-6"
                    style={{
                        backgroundImage: `url(${images[currentPhotoIndex]})`,
                    }}
                    onClick={() => {
                        setIsModalVisible(true)
                    }}
                >
                    {/* <img> нужны для SEO */}
                    <img
                        src={images[currentPhotoIndex]}
                        alt={alt}
                    />
                </div>
            </FadeSwitch>

            {images.length > 1 && (
                <div
                    className={clsx(
                        'images-previewer-previews-list mt-3',
                        // Настройка количества колонок в списке миниатюр для каждого размера экрана.
                        getResponsiveCssGridClassNames(previewsColumns ?? {}, 3, 3)
                    )}
                >
                    {images.map((photo: string, index: number) => (
                        <div
                            key={'photo-' + index}
                            className={clsx(
                                'images-previewer-preview',
                                index === currentPhotoIndex ? 'active' : null
                            )}
                            style={{
                                backgroundImage: `url(${photo})`,
                            }}
                            onClick={() => {
                                setCurrentPhotoIndex(index)
                            }}
                        >
                            {/* <img> нужны для SEO */}
                            <img
                                src={photo}
                                alt={alt}
                            />
                        </div>
                    ))}
                </div>
            )}
            <ImagesCarouselModal
                images={images}
                currentIndex={currentPhotoIndex}
                show={isModalVisible}
                depth={2}
                onClose={() => {
                    setIsModalVisible(false)
                }}
                onClosed={() => {
                    setIsModalVisible(null)
                }}
            />
        </div>
    )
}

export default React.memo(ImagesPreviewer)
