import {FilePickerTranslations} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'

const translations: FilePickerTranslations = {
    file_size: 'Kích thước',
    error_label: 'Lỗi',
    error: {
        mime_type_forbidden: (extension: string) => `Loại tệp ${extension} bị cấm.`,
        mime_type_and_extension_mismatch: (extension: string, type: string) => `Phần mở rộng tệp (${extension}) không khớp với loại tệp (${type}).`,
        already_attached: (name: string) => `Tệp ${name} đã được đính kèm.`,
        too_many_files: (limit: number) => `Đã đạt đến số lượng tệp tối đa: ${limit}.`,
        file_too_large: (maxSizeMb: number) => `Kích thước tệp vượt quá kích thước tối đa cho phép (${maxSizeMb} MB).`,
        server_error: 'Đã xảy ra lỗi không xác định trong quá trình lưu tệp.',
        unexpected_error: 'Không thể xử lý và lưu tệp.',
        non_json_validation_error: 'Tệp không vượt qua kiểm tra trên máy chủ.',
        invalid_response: 'Phản hồi từ máy chủ không hợp lệ.',
        invalid_file: (fileName: string, error: string) => `Lỗi đính kèm tệp ${fileName}: ${error}`,
        internal_error_during_upload: 'Đã xảy ra lỗi không mong muốn trong quá trình xử lý tệp. Có thể tệp bị hỏng.',
        internal_error_in_xhr: 'Đã xảy ra lỗi không mong muốn trong quá trình gửi tệp.',
        timed_out: 'Quá thời gian cho phép để gửi tệp lên máy chủ. Có thể kết nối Internet của bạn quá chậm.',
        failed_to_get_file_blob: 'Không thể lấy dữ liệu từ tệp để gửi lên máy chủ.',
        failed_to_resize_image: 'Không thể xử lý hình ảnh trước khi gửi lên máy chủ.',
        http401: 'Đã xảy ra lỗi xác thực. Vui lòng đăng nhập vào tài khoản cá nhân lại.',
    },
    status: {
        uploaded: 'Tệp đã được tải lên máy chủ',
        not_uploaded: 'Tệp chưa được tải lên máy chủ',
        uploading: (uploadedPercent: number) => `Đang tải tệp lên máy chủ: ${uploadedPercent}%`,
    },
    attach_file: 'Đính kèm tệp',
    replace_file: 'Thay thế tệp',
    not_all_valid_files_uploaded: 'Không thể gửi một số tệp đã đính kèm. Vui lòng kiểm tra lỗi và thay thế hoặc xóa các tệp gặp vấn đề.',
    internal_error_during_files_uploading: 'Đã xảy ra lỗi không mong muốn khi gửi các tệp đã đính kèm. Có thể một số tệp bị hỏng và không thể được gửi.',
    file_will_be_deleted: 'Tệp sẽ bị xóa sau khi biểu mẫu được lưu.',
    restore: 'Khôi phục',
}

export default translations
