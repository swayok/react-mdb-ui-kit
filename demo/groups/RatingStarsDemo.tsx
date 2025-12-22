import {useState} from 'react'
import {RatingStars} from '../../components/Icon/RatingStars'

export function RatingStarsDemo() {

    const [
        rating,
        setRating,
    ] = useState<number>(0)

    return (
        <>
            <div className="d-grid grid-columns-2 grid-columns-gap-3 grid-columns-gap-3">
                {values.map(value => (
                    <div key={value}>
                        Rating {value}:
                        <RatingStars rating={value} />
                    </div>
                ))}
            </div>
            <div className="mt-3">
                Interactive Rating:
                <RatingStars
                    rating={rating}
                    onClick={setRating}
                />
            </div>
        </>
    )
}

const values: number[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
