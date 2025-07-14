import React from 'react'
import {useDataGridContext} from './DataGridContext'
import {DataGridFiltersPanelLabelProps} from '../../types/DataGrid'

// Заголовок панели фильтрации.
function DataGridFiltersPanelLabel(props: DataGridFiltersPanelLabelProps) {

    const {translations} = useDataGridContext()

    const {
        label = translations.filters.header,
        className = 'fs-6 text-muted fw-600',
        ...otherProps
    } = props

    return (
        <div
            className={className}
            {...otherProps}
        >
            {label}:
        </div>
    )
}

export default React.memo(DataGridFiltersPanelLabel)
