import React from 'react'
import {useDataGridContext} from './DataGridContext'
import {DataGridOrderingPanelLabelProps} from '../../types/DataGrid'

// Заголовок панели фильтрации.
function DataGridOrderingPanelLabel(props: DataGridOrderingPanelLabelProps) {

    const {translations} = useDataGridContext()

    const {
        label,
        className,
        ...otherProps
    } = props

    return (
        <div
            {...otherProps}
            className={className || 'me-2 my-1 fs-6 text-muted fw600'}
        >
            {label || translations.ordering.header}:
        </div>
    )
}

export default React.memo(DataGridOrderingPanelLabel)
