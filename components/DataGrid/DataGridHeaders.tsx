import React from 'react'
import clsx from 'clsx'
import {DataGridHeadersProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

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

/** @deprecated */
export default DataGridHeaders
