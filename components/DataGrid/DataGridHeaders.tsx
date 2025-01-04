import React from 'react'
import clsx from 'clsx'
import {DataGridHeadersProps} from '../../types/DataGrid'

// Заголовки колонок таблицы (<thead> -> <tr> -> <DataGridHeader>+).
function DataGridHeaders(props: DataGridHeadersProps) {

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

export default React.memo(DataGridHeaders)
