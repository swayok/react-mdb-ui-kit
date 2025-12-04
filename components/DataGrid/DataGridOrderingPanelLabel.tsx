import {useDataGridContext} from './DataGridContext'
import {DataGridOrderingPanelLabelProps} from './DataGridTypes'

// Заголовок панели фильтрации.
export function DataGridOrderingPanelLabel(props: DataGridOrderingPanelLabelProps) {

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

/** @deprecated */
export default DataGridOrderingPanelLabel
