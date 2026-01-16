import {AsyncDataGridStateForUrlQuery} from '../../components/AsyncDataGrid/AsyncDataGridTypes'
import {DataGridOrderingDirection} from '../../components/DataGrid/DataGridTypes'
import {
    normalizeAsyncDataGridState,
    NormalizedAsyncDataGridState,
} from './normalizeAsyncDataGridState'

// Конвертирует строку из URL query в параметры выборки.
export function decodeAsyncDataGridState<FiltersDataType extends object = object>(
    value: string | null,
    defaultLimit: number,
    defaultOrderBy: string | null,
    defaultOrderDirection: DataGridOrderingDirection
): NormalizedAsyncDataGridState<FiltersDataType> | null {
    if (!value || value.trim() === '') {
        return null
    }
    try {
        const data: AsyncDataGridStateForUrlQuery<FiltersDataType> = JSON.parse(value)
        if (typeof data !== 'object') {
            return null
        }
        return normalizeAsyncDataGridState<FiltersDataType>(
            data,
            defaultLimit,
            defaultOrderBy,
            defaultOrderDirection
        )
    } catch (_e) {
        return null
    }
}
