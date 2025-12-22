import {
    mdiCheckboxBlankCircleOutline,
    mdiCheckboxMarkedCircle,
} from '@mdi/js'
import clsx from 'clsx'
import {TextColors} from '../types'
import {
    IconButton,
    IconButtonProps,
} from './IconButton'

interface IconButtonSwitchProps extends Omit<IconButtonProps, 'path'> {
    active: boolean
    activeIcon?: string
    inactiveIcon?: string
    activeColor?: TextColors
    activeClassName?: string
    inactiveColor?: TextColors
    inactiveClassName?: string
}

// Иконка-кнопка, работающая по аналогии с <checkbox> (вкл/выкл)
export function IconButtonSwitch(props: IconButtonSwitchProps) {
    const {
        active,
        activeIcon = mdiCheckboxMarkedCircle,
        activeColor = 'green',
        activeClassName,
        inactiveIcon = mdiCheckboxBlankCircleOutline,
        inactiveColor = 'muted',
        inactiveClassName,
        className,
        ...otherProps
    } = props

    return (
        <IconButton
            path={active ? activeIcon : inactiveIcon}
            color={active ? activeColor : inactiveColor}
            className={clsx(
                className,
                active ? activeClassName : inactiveClassName
            )}
            {...otherProps}
        />
    )
}
