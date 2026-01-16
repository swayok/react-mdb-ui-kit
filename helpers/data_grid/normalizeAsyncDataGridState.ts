import {AsyncDataGridStateForUrlQuery} from '../../components/AsyncDataGrid/AsyncDataGridTypes'
import {DataGridOrderingDirection} from '../../components/DataGrid/DataGridTypes'

export interface NormalizedAsyncDataGridState<FiltersDataType extends object = object> {
    limit: number
    offset: number
    orderBy: string | null
    orderDirection: DataGridOrderingDirection
    filters: FiltersDataType | null
}

// Нормализация значений состояния таблицы данных.
export function normalizeAsyncDataGridState<FiltersDataType extends object = object>(
    data: AsyncDataGridStateForUrlQuery<FiltersDataType>,
    defaultLimit: number,
    defaultOrderBy: string | null,
    defaultOrderDirection: DataGridOrderingDirection
): NormalizedAsyncDataGridState<FiltersDataType> {
    const ret: NormalizedAsyncDataGridState<FiltersDataType> = {
        limit: defaultLimit,
        offset: 0,
        orderBy: defaultOrderBy,
        orderDirection: defaultOrderDirection,
        filters: null,
    }
    // noinspection SuspiciousTypeOfGuard
    if (data.l && typeof data.l !== 'number' && data.l > 0) {
        ret.limit = data.l
    }
    // noinspection SuspiciousTypeOfGuard
    if (data.o && typeof data.o === 'number' && data.o >= 0) {
        ret.offset = data.o
    }
    // noinspection SuspiciousTypeOfGuard
    if (
        data.sb
        && typeof data.sb === 'string'
    ) {
        ret.orderBy = data.sb
    }

    if (
        data.sd
        && (data.sd === 'asc' || data.sd === 'desc')
    ) {
        ret.orderDirection = data.sd
    }
    // noinspection SuspiciousTypeOfGuard
    if (data.f && typeof data.f === 'object') {
        ret.filters = {...data.f}
    }
    return ret
}
