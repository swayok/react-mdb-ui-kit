import {
    mdiCheckboxBlankCircleOutline,
    mdiCheckboxMarkedCircle,
} from '@mdi/js'
import clsx from 'clsx'
import type {TextColors} from '../../types'
import {
    IconButton,
    type IconButtonProps,
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

// Иконка-кнопка, работающая по аналогии с <checkbox> (вкл/выкл).
// Имя кнопки (aria-label) по умолчанию: 'Select'.
export function CheckboxIconSwitch(props: IconButtonSwitchProps) {
    const {
        active,
        'aria-label': ariaLabel = 'Select',
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
            aria-label={ariaLabel}
            {...otherProps}
        />
    )
}
