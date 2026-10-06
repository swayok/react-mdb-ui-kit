import {
    mdiStar,
    mdiStarHalfFull,
    mdiStarOutline,
} from '@mdi/js'
import clsx from 'clsx'
import type {SvgIconInfo} from '../../types'
import {Icon} from './Icon'
import type {MdiIconProps} from './MDIIcon'

export interface RatingStarsProps {
    rating: number
    className?: string
    starSize?: number
    onClick?: (value: number) => void
    inactiveIconColor?: MdiIconProps['color']
    inactiveIconClassName?: string
    iconStarEmpty?: string | SvgIconInfo
    iconStarFilled?: string | SvgIconInfo
    iconStarHalfFull?: string | SvgIconInfo
}

// Отображает рейтинг в виде набора из 5 иконок-звезд.
export function RatingStars(props: RatingStarsProps) {

    const {
        rating,
        className = 'gap-1',
        starSize,
        onClick,
        inactiveIconColor,
        inactiveIconClassName,
        iconStarEmpty = mdiStarOutline,
        iconStarFilled = mdiStar,
        iconStarHalfFull = mdiStarHalfFull,
    } = props

    const stars = []
    const ratingRounded: number = Math.round(rating * 2) / 2
    for (let i = 1; i <= 5; i++) {
        let icon: string | SvgIconInfo = iconStarFilled
        let isActive: boolean = true
        if (ratingRounded < i) {
            if (ratingRounded > i - 0.99) {
                icon = iconStarHalfFull
            } else {
                icon = iconStarEmpty
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
                    rating >= i ? 'active' : ''
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
