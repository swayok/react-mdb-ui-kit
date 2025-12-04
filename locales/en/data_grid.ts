import {DataGridTranslations} from '../../components/DataGrid/DataGridTypes'

const translations: DataGridTranslations = {
    filters: {
        header: 'Filters',
        apply: 'Apply',
        reset: 'Reset',
    },
    ordering: {
        header: 'Sorting',
        ascending: 'Ascending',
        descending: 'Descending',
    },
    items_count: {
        items_total: (totalCount: number): string =>
            `Total: ${totalCount}`,
        items_filtered: (totalCount: number, filteredCount: number): string =>
            `Filtered: ${filteredCount} from ${totalCount}`,
        items_shown: (min: number, max: number): string =>
            `Shown: from ${min} to ${max}`,
        items_per_page: (value: number): string =>
            `${value} per page`,
    },
    no_items: 'No data',
    loading: 'Loading data...',
    loading_error: 'Error happened when loading data.',
    retry_loading: 'Reload',
    actions: {
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        clone: 'Duplicate',
    },
}

export default translations
