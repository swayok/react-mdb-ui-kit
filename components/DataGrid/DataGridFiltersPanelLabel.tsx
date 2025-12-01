import React from 'react'
import {useDataGridContext} from './DataGridContext'
import {DataGridFiltersPanelLabelProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

// Заголовок панели фильтрации.
export function DataGridFiltersPanelLabel(props: DataGridFiltersPanelLabelProps) {

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
