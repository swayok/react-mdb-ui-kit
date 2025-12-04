import {DataGridTranslations} from '../../components/DataGrid/DataGridTypes'

const translations: DataGridTranslations = {
    filters: {
        header: 'bộ lọc',
        apply: 'Áp dụng',
        reset: 'Cài lại',
    },
    ordering: {
        header: 'Thứ tự sắp xếp',
        ascending: 'Sắp xếp tăng dần',
        descending: 'Sắp xếp giảm dần',
    },
    items_count: {
        items_total: (totalCount: number): string =>
            `Tổng số: ${totalCount}`,
        items_filtered: (totalCount: number, filteredCount: number): string =>
            `Đã lọc: ${filteredCount} trên ${totalCount}`,
        items_shown: (min: number, max: number): string =>
            `Được hiển thị: ${min} đến ${max}`,
        items_per_page: (value: number): string =>
            `${value} mỗi trang`,
    },
    no_items: 'Không có bản ghi',
    loading: 'Đang lấy dữ liệu...',
    loading_error: 'Đã xảy ra lỗi khi tải dữ liệu.',
    retry_loading: 'Thử lại',
    actions: {
        add: 'Tạo nên',
        edit: 'Chỉnh sửa',
        delete: 'Xóa bỏ',
        clone: 'Bản sao',
    },
}

export default translations
