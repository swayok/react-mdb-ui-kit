import {FilePickerTranslations} from 'swayok-react-mdb-ui-kit/components/FilesPicker/FilePickerTypes'

const translations: FilePickerTranslations = {
    file_size: 'Size',
    error_label: 'Error',
    error: {
        mime_type_forbidden: (extension: string) => `Files of type ${extension} are forbidden.`,
        mime_type_and_extension_mismatch: (extension: string, type: string) => `File's extension (${extension}) does not match its type (${type}).`,
        already_attached: (name: string) => `File ${name} already attached.`,
        too_many_files: (limit: number) => `Files count exceeds the limit of ${limit} files.`,
        file_too_large: (maxSizeMb: number) => `File size exceeds the limit of ${maxSizeMb} MB.`,
        server_error: 'Unknown error happened while saving files on server.',
        unexpected_error: 'Failed to process and save the file.',
        non_json_validation_error: 'File have failed the validation on server.',
        invalid_response: 'Invalid response from server.',
        invalid_file: (fileName: string, error: string) => `Failed to attach file ${fileName}: ${error}`,
        internal_error_during_upload: 'Unknown error happened during file processing. File may be corrupted.',
        internal_error_in_xhr: 'Unknown error happened during file uploading.',
        timed_out: 'The maximum time allowed for sending a file to the server has been exceeded. Maybe your internet connection is too slow or file is too big.',
        failed_to_get_file_blob: 'Failed to get file contents for uploading to server.',
        failed_to_resize_image: 'Failed to process the image before uploading to server.',
        http401: 'Not authorized. Please login to your account.',
    },
    status: {
        uploaded: 'File was uploaded successfully.',
        not_uploaded: 'File is not uploaded yet.',
        uploading: (uploadedPercent: number) => `Uploading: ${uploadedPercent}%`,
    },
    attach_file: 'Attach file',
    replace_file: 'Replace file',
    not_all_valid_files_uploaded: 'Failed to upload some of the attached files to server. Check errors and replace or detach invalid files.',
    internal_error_during_files_uploading: 'Unknown error happened during uploading of the attached files to server. Maybe some files are corrupted or cannot be uploaded.',
    file_will_be_deleted: 'File will be deleted after submitting the form.',
    restore: 'Restore file.',
}

export default translations
