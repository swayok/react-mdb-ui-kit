import clsx from 'clsx'
import {DataGridHeadersProps} from './DataGridTypes'

// Заголовки колонок таблицы (<thead> -> <tr> -> <DataGridHeader>+).
export function DataGridHeaders(props: DataGridHeadersProps) {

    return (
        <thead
            className={clsx(
                props.hidden ? 'data-grid-headers-hidden' : null,
                props.sticky ? 'data-grid-headers-sticky' : null
            )}
        >
            <tr>
                {props.children}
            </tr>
        </thead>
    )
}
