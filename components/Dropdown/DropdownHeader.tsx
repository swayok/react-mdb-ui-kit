import clsx from 'clsx'
import {DropdownHeaderProps} from './DropdownTypes'

// Заголовок группы элементов в выпадающем меню.
export function DropdownHeader(props: DropdownHeaderProps) {

    const {
        className,
        role = 'heading',
        ...otherProps
    } = props

    return (
        <div
            className={clsx(className, 'dropdown-header')}
            role={role}
            {...otherProps}
        />
    )
}
