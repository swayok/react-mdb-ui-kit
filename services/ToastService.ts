import {INotyfOptions} from 'notyf/notyf.options'
import Notyf from 'notyf/notyf.d'

export type ToastType = 'info' | 'success' | 'error';

export const defaultToastServiceConfig: Partial<INotyfOptions> = {
    position: {
        x: 'right',
        y: 'bottom',
    },
    dismissible: true,
    duration: 3000,
    types: [
        {
            type: 'info',
            background: 'blue',
        },
    ],
}

export interface ToastServiceToastDurations {
    error: number
    info: number
    success: number
}

// Сервис отображения всплывающих уведомлений.
abstract class ToastService {

    // Длительность отображения в зависимости от типа.
    private static duration: ToastServiceToastDurations = {
        error: 4000,
        info: 3000,
        success: 3000,
    }

    // Экземпляр библиотеки отображения уведомлений.
    private static toast: Notyf

    // Настройки.
    private static config: Partial<INotyfOptions> = defaultToastServiceConfig

    // Настройка библиотеки отображения уведомлений.
    static configure(config: Partial<INotyfOptions>): void {
        this.config = {...defaultToastServiceConfig, ...config}
    }

    // Настройка стандартного времени отображения уведомлений.
    static setDurations(durations: ToastServiceToastDurations): void {
        this.duration = durations
    }

    // Показать уведомление.
    static show(type: ToastType, message: string, duration?: number): void {
        void this.getToast()
            .then(toast => toast.open({
                type,
                message,
                duration: duration || this.duration[type],
            }))
    }

    // Показать уведомление об ошибке.
    static error(message: string, duration?: number): void {
        this.show('error', message, duration)
    }

    // Показать информационное уведомление.
    static info(message: string, duration?: number): void {
        this.show('info', message, duration)
    }

    // Показать уведомление об успешном действии.
    static success(message: string, duration?: number): void {
        this.show('success', message, duration)
    }

    // Получить экземпляр библиотеки отображения уведомлений.
    private static async getToast(): Promise<Notyf> {
        if (!this.toast) {
            const notyf: typeof Notyf = (await import('notyf')).Notyf
            this.toast = new notyf(this.config)
        }
        return this.toast
    }
}

export default ToastService
