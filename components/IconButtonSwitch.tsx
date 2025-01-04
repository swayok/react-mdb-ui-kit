import React from 'react'
import IconButton, {IconButtonProps} from './IconButton'
import clsx from 'clsx'
import {mdiCheckboxBlankCircleOutline, mdiCheckboxMarkedCircle} from '@mdi/js'

interface IconButtonSwitchProps extends Omit<IconButtonProps, 'path'> {
    active: boolean,
    activeIcon?: string,
    inactiveIcon?: string,
    activeClassName?: string
    inactiveClassName?: string
}

// Иконка-кнопка, работающая по аналогии с <checkbox> (вкл/выкл)
function IconButtonSwitch(props: IconButtonSwitchProps) {
    const {
        active,
        activeIcon = mdiCheckboxMarkedCircle,
        activeClassName = 'text-green',
        inactiveIcon = mdiCheckboxBlankCircleOutline,
        inactiveClassName = 'text-muted',
        className,
        ...otherProps
    } = props

    return (
        <IconButton
            path={active ? activeIcon : inactiveIcon}
            className={clsx(
                className,
                active ? activeClassName : inactiveClassName
            )}
            {...otherProps}
        />
    )
}

export default React.memo(IconButtonSwitch)
