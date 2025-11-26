import {FilePickerTranslations} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'

const translations: FilePickerTranslations = {
    file_size: 'Размер',
    error_label: 'Ошибка',
    error: {
        mime_type_forbidden: (extension: string) => `Файлы типа ${extension} запрещены.`,
        mime_type_and_extension_mismatch: (extension: string, type: string) => `Расширение файла (${extension}) не соответствует его типу (${type}).`,
        already_attached: (name: string) => `Файл ${name} уже прикреплён.`,
        too_many_files: (limit: number) => `Достигнуто максимальное количество файлов: ${limit}.`,
        file_too_large: (maxSizeMb: number) => `Размер файла превышает максимально допустимый размер (${maxSizeMb} МБ).`,
        server_error: 'Произошла неопределенная ошибка при сохранении файла.',
        unexpected_error: 'Не удалось обработать и сохранить файл.',
        non_json_validation_error: 'Файл не прошёл проверку на стороне сервера.',
        invalid_response: 'Получен некорректный ответ от сервера.',
        invalid_file: (fileName: string, error: string) => `Ошибка прикрепления файла ${fileName}: ${error}`,
        internal_error_during_upload: 'Непредвиденная ошибка при обработке файла. Возможно файл поврежден.',
        internal_error_in_xhr: 'Непредвиденная ошибка при отправке файла.',
        timed_out: 'Превышено допустимое время отправки файла на сервер. Возможно у Вас слишком медленное соединение с интернетом.',
        failed_to_get_file_blob: 'Не удалось получить данные из файла для отправки на сервер.',
        failed_to_resize_image: 'Не удалось обработать фотографию перед отправкой на сервер.',
        http401: 'Произошла ошибка авторизации. Пожалуйста, войдите в личный кабинет снова.',
    },
    status: {
        uploaded: 'Файл загружен на сервер',
        not_uploaded: 'Файл еще не загружен на сервер',
        uploading: (uploadedPercent: number) => `Загрузка файла на сервер: ${uploadedPercent}%`,
    },
    attach_file: 'Прикрепить файл',
    replace_file: 'Заменить файл',
    not_all_valid_files_uploaded: 'Не удалось отправить часть прикреплённых файлов. Проверьте ошибки и замените или удалите проблемные файлы.',
    internal_error_during_files_uploading: 'Произошла непредвиденная ошибка при отправке прикреплённых файлов. Вероятно какой-то файл повреждён и не может быть отправлен.',
    file_will_be_deleted: 'Файл будет удалён после сохранения формы.',
    restore: 'Отменить удаление.',
}

export default translations
