import clsx from 'clsx'
import {DropdownMenuScrollableContainerProps} from './DropdownTypes'

// Контейнер с полосой прокрутки для выпадающего меню
export function DropdownMenuScrollableContainer(
    props: DropdownMenuScrollableContainerProps
) {
    const {
        className,
        tabIndex = -1,
        children,
        ...otherProps
    } = props

    return (
        <div
            {...otherProps}
            tabIndex={tabIndex}
            className={clsx(
                'dropdown-menu-scrollable',
                className
            )}
        >
            {children}
        </div>
    )
}
