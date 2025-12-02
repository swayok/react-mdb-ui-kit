import React from 'react'
import {ImagesPreviewer} from '../../components/Images/ImagesPreviewer'

export function ImagesPreviewDemo() {

    return (
        <ImagesPreviewer
            images={images}
        />
    )
}

const images: string[] = [
    'https://picsum.photos/1000/700?random=1',
    'https://picsum.photos/1000/700?random=2',
    'https://picsum.photos/1000/700?random=3',
    'https://picsum.photos/1000/700?random=4',
    'https://picsum.photos/1000/700?random=5',
    'https://picsum.photos/1000/700?random=6',
    'https://picsum.photos/1000/700?random=7',
    'https://picsum.photos/1000/700?random=8',
    'https://picsum.photos/1000/700?random=9',
    'https://picsum.photos/1000/700?random=10',
]
