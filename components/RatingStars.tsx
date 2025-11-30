import React from 'react'
import {IconProps} from './MDIIcon'
import {Icon} from './Icon'
import clsx from 'clsx'
import {mdiStar, mdiStarHalfFull, mdiStarOutline} from '@mdi/js'

interface Props {
    rating: number
    className?: string
    starSize?: number
    onClick?: (value: number) => void
    inactiveIconColor?: IconProps['color']
    inactiveIconClassName?: string
}

// Отображает рейтинг в виде набора из 5 иконок-звезд.
export function RatingStars(props: Props) {

    const {
        rating,
        className,
        starSize,
        onClick,
        inactiveIconColor,
        inactiveIconClassName,
    } = props

    const stars = []
    const ratingRounded: number = Math.round(rating * 2) / 2
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
                    rating >= i ? 'active' : '',
                    i === 1 ? '' : 'ms-1'
                )}
                onClick={() => onClick?.(i)}
            >
                <Icon
                    path={icon}
                    size={starSize}
                    color={isActive ? undefined : inactiveIconColor}
                    className={!isActive ? '' : inactiveIconClassName}
                />
            </div>
        )
    }

    return (
        <div
            className={clsx(
                'rating-stars flex-row-center-vertical',
                className,
                onClick ? 'interactive' : null
            )}
        >
            {stars}
        </div>
    )
}

/** @deprecated */
export default RatingStars
