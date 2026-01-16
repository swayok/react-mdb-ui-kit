import {AsyncDataGridStateForUrlQuery} from '../../components/AsyncDataGrid/AsyncDataGridTypes'
import {DataGridOrderingDirection} from '../../components/DataGrid/DataGridTypes'

// Конвертирует параметры выборки в строку.
export function encodeAsyncDataGridState(
    limit: number | null,
    offset: number | null,
    orderBy: string | null,
    orderDirection: DataGridOrderingDirection | null,
    filters: object | null
): string {
    const data: AsyncDataGridStateForUrlQuery = {}
    if (limit) {
        data.l = limit
    }
    if (offset) {
        data.o = offset
    }
    if (orderBy) {
        data.sb = orderBy
        data.sd = orderDirection ?? 'asc'
    }
    if (filters && Object.keys(filters).length > 0) {
        data.f = filters
    }
    return JSON.stringify(data)
}
