import clsx from 'clsx'
import type {DataGridNoItemsProps} from './DataGridTypes'

// Сообщение о том, что в таблице нет строк.
export function DataGridNoItems(props: DataGridNoItemsProps) {

    const {
        children,
        className = 'fs-6 py-5 px-4',
        flexFill,
        ...otherProps
    } = props

    return (
        <div
            {...otherProps}
            className={clsx(
                'data-grid-no-items',
                flexFill ? 'flex-1 d-flex flex-column justify-content-center align-items-center' : 'text-center',
                className
            )}
        >
            <span>
                {children}
            </span>
        </div>
    )
}
