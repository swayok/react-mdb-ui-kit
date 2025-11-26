import {DataGridTranslations} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'

const translations: DataGridTranslations = {
    filters: {
        header: 'Фильтры',
        apply: 'Применить',
        reset: 'Сбросить',
    },
    ordering: {
        header: 'Сортировка',
        ascending: 'По возрастанию',
        descending: 'По убыванию',
    },
    items_count: {
        items_total: (totalCount: number): string =>
            `Всего: ${totalCount}`,
        items_filtered: (totalCount: number, filteredCount: number): string =>
            `Отфильтровано: ${filteredCount} из ${totalCount}`,
        items_shown: (min: number, max: number): string =>
            `Показано: с ${min} по ${max}`,
        items_per_page: (value: number): string =>
            `По ${value} на страницу`,
    },
    no_items: 'Нет данных',
    loading: 'Получение данных...',
    loading_error: 'Произошла ошибка при загрузке данных.',
    retry_loading: 'Перезагрузить',
    actions: {
        add: 'Добавить',
        edit: 'Редактировать',
        delete: 'Удалить',
        clone: 'Дублировать',
    },
}

export default translations
