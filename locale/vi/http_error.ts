import {HttpErrorsTranslations} from '../../types/Common'

const translations: HttpErrorsTranslations = {
    go_back: 'Quay lại',
    code401: {
        toast: 'Đã xảy ra lỗi xác thực. Vui lòng đăng nhập vào tài khoản cá nhân lại.',
    },
    code403: {
        title: 'Truy cập bị từ chối',
        message: 'Truy cập bị từ chối',
        toast: 'Truy cập đến dữ liệu yêu cầu bị từ chối.',
    },
    code404: {
        title: 'Không tìm thấy trang',
        message: 'Không tìm thấy trang',
        toast: 'Dữ liệu yêu cầu không được tìm thấy trong cơ sở dữ liệu.',
    },
    code408: {
        toast: 'Quá thời gian chờ phản hồi từ máy chủ. Vui lòng thử lại hành động.',
    },
    code419: {
        toast: 'Trang đã lỗi thời. Vui lòng tải lại trang.',
    },
    code422: {
        toast: 'Dữ liệu nhận được không chính xác.',
    },
    code426: {
        toast: 'Phát hiện phiên bản cá nhân lỗi thời. Trang sẽ được tải lại để cập nhật.',
    },
    code429: {
        toast: 'Số lượng yêu cầu vượt quá giới hạn cho phép trong 1 phút. Vui lòng thử lại hành động sau một phút.',
    },
    code4xx: {
        toast: 'Yêu cầu bị từ chối bởi máy chủ. Vui lòng tải lại trang và thực hiện hành động lại.',
    },
    code500: {
        title: 'Đã xảy ra lỗi nội bộ',
        message: 'Đã xảy ra lỗi nội bộ.<br>Quản trị viên đã được thông báo.<br>Vui lòng thử lại hành động sau.',
        toast: 'Đã xảy ra lỗi nội bộ. Quản trị viên đã được thông báo. Vui lòng thử lại hành động sau.',
    },
    unknown: {
        toast: 'Đã xảy ra lỗi không xác định trong quá trình xử lý yêu cầu.',
    },
    js_error: {
        title: 'Đã xảy ra lỗi khi hiển thị dữ liệu.',
        message: 'Đã xảy ra lỗi khi hiển thị dữ liệu.<br>Quản trị viên đã được thông báo.<br>Vui lòng thử lại hành động sau.',
        toast: 'Đã xảy ra lỗi khi hiển thị dữ liệu. Quản trị viên đã được thông báo. Vui lòng thử lại hành động sau.',
    },
    code503: {
        title: 'Đang tiến hành bảo trì',
        message: 'Đang tiến hành bảo trì',
        toast: 'Đang tiến hành bảo trì. Vui lòng thử lại hành động sau.',
    },
    code501: {
        toast: 'Không thể thực hiện hành động: máy chủ từ chối yêu cầu. Vui lòng tải lại trang và thực hiện hành động lại.',
    },
    code502: {
        toast: 'Máy chủ không phản hồi yêu cầu. Vui lòng thử lại hành động sau.',
    },
    code504: {
        toast: 'Máy chủ không phản hồi yêu cầu. Vui lòng thử lại hành động sau.',
    },
    code5xx: {
        toast: 'Đã xảy ra lỗi không xác định khi thực hiện yêu cầu đến máy chủ. Vui lòng thử lại hành động sau.',
    },
    axios: {
        toast: 'Không thể gửi yêu cầu: đã xảy ra lỗi không mong đợi khi chuẩn bị gửi yêu cầu. Vui lòng tải lại trang và thực hiện hành động lại.',
    },
    response_parsing: {
        toast: 'Không thể xử lý phản hồi từ máy chủ: định dạng dữ liệu nhận được không chính xác. Vui lòng tải lại trang và thực hiện hành động lại.',
    },
}

export default translations
