import React from 'react'
import Icon from './Icon'
import clsx from 'clsx'
import {mdiStar, mdiStarHalfFull, mdiStarOutline} from '@mdi/js'
import withStable from '../helpers/withStable'

type Props = {
    rating: number,
    className?: string,
    starSize?: number,
    onClick?: (value: number) => void,
    inactiveIconClassName?: string
}

// Отображает рейтинг в виде набора из 5 иконок-звезд.
function RatingStars(props: Props) {

    const stars = []
    const ratingRounded: number = Math.round(props.rating * 2) / 2
    for (let i = 1; i <= 5; i++) {
        let icon: string = mdiStar
        let isActive: boolean = true
        if (ratingRounded < i) {
            if (ratingRounded > i - 0.99) {
                icon = mdiStarHalfFull
            } else {
                icon = mdiStarOutline
                isActive = false
            }
        } else {
            isActive = true
        }
        stars.push(
            <div
                key={'star-' + i}
                className={clsx(
                    'rating-stars-star',
                    props.rating >= i ? 'active' : '',
                    i === 1 ? '' : 'ms-1'
                )}
                onClick={() => props.onClick?.(i)}
            >
                <Icon
                    path={icon}
                    size={props.starSize}
                    className={
                        (!isActive && props.inactiveIconClassName) || undefined
                    }
                />
            </div>
        )
    }

    return (
        <div
            className={clsx(
                'rating-stars flex-row-center-vertical',
                props.className,
                props.onClick ? 'interactive' : null
            )}
        >
            {stars}
        </div>
    )
}

export default withStable<Props>(['onClick'], RatingStars)
