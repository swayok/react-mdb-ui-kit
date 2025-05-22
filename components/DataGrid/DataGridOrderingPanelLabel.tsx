import React from 'react'
import {useDataGridContext} from './DataGridContext'
import {DataGridOrderingPanelLabelProps} from '../../types/DataGrid'

// Заголовок панели фильтрации.
function DataGridOrderingPanelLabel(props: DataGridOrderingPanelLabelProps) {

    const {translations} = useDataGridContext()

    const {
        label = translations.ordering.header,
        className = 'me-2 my-1 fs-6 text-muted fw-600',
        ...otherProps
    } = props

    return (
        <div
            {...otherProps}
            className={className}
        >
            {label}:
        </div>
    )
}

export default React.memo(DataGridOrderingPanelLabel)
