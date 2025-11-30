import {KeyboardEvent} from 'react'

// Обработчики по умолчанию.
export interface UserBehaviorHandlers {
    onFocus: (
        input: HTMLInputElement | HTMLTextAreaElement,
        id: string,
        value?: string | number | null
    ) => void;
    onBlur: (value?: string | null) => void;
    onPaste: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCheckboxOrRadioChange: (input: HTMLInputElement, id: string) => void;
}

// Сервис отслеживания поведения пользователя при заполнении полей ввода.
export abstract class UserBehaviorService {

    // Обработчики взаимодействий с полями ввода.
    private static handlers: UserBehaviorHandlers = getDefaultHandlers()

    // Задание обработчиков взаимодействий с полями ввода.
    static setHandlers(handlers: UserBehaviorHandlers) {
        this.handlers = handlers
    }

    // Очистка обработчиков взаимодействий с полями ввода.
    static unsetHandlers(): void {
        this.handlers = getDefaultHandlers()
    }

    // Обработка события: начало взаимодействия с полем ввода.
    static onFocus(
        input: HTMLInputElement | HTMLTextAreaElement,
        id: string,
        value?: string | number | null
    ): void {
        this.handlers.onFocus(input, id, value)
    }

    // Обработка события: завершение взаимодействия с полем ввода.
    static onBlur(value?: string | null): void {
        this.handlers.onBlur(value)
    }

    // Обработка события: вставка текста в поле ввода.
    static onPaste(): void {
        this.handlers.onPaste()
    }

    // Обработка события: нажатие на клавишу в поле ввода.
    static onKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.handlers.onKeyDown(event)
    }

    // Обработка изменения значения в <input type="checkbox"/> и <input type="radio"/>
    static onCheckboxOrRadioChange(input: HTMLInputElement, id: string): void {
        this.handlers.onCheckboxOrRadioChange(input, id)
    }
}

// Обработчики по умолчанию.
function getDefaultHandlers(): UserBehaviorHandlers {
    return {
        onFocus() {
        },
        onBlur() {
        },
        onPaste() {
        },
        onKeyDown() {
        },
        onCheckboxOrRadioChange() {
        },
    }
}
