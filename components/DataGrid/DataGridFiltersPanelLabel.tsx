import React from 'react'
import {useDataGridContext} from './DataGridContext'
import {DataGridFiltersPanelLabelProps} from '../../types/DataGrid'

// Заголовок панели фильтрации.
function DataGridFiltersPanelLabel(props: DataGridFiltersPanelLabelProps) {

    const {translations} = useDataGridContext()

    const {
        label,
        className,
        ...otherProps
    } = props

    return (
        <div
            className={className || 'mt-2 mb-2 me-2 ms-2 fs-6 text-muted fw600'}
            {...otherProps}
        >
            {label || translations.filters.header}:
        </div>
    )
}

export default React.memo(DataGridFiltersPanelLabel)
