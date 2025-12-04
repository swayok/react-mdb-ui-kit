import clsx from 'clsx'
import {DropdownItemTextProps} from './DropdownTypes'

export function DropdownItemText(props: DropdownItemTextProps) {

    const {
        className,
        tag: Component = 'span',
        ref,
        ...otherProps
    } = props

    return (
        <Component
            ref={ref}
            className={clsx(className, 'dropdown-item-text')}
            {...otherProps}
        />
    )
}
