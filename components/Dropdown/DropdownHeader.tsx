import clsx from 'clsx'
import {DropdownHeaderProps} from './DropdownTypes'

// Заголовок группы элементов в выпадающем меню.
export function DropdownHeader(props: DropdownHeaderProps) {

    const {
        className,
        tag: Component = 'div',
        role = 'heading',
        ref,
        ...otherProps
    } = props

    return (
        <Component
            ref={ref}
            className={clsx(className, 'dropdown-header')}
            role={role}
            {...otherProps}
        />
    )
}
