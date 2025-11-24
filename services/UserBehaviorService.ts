import {KeyboardEvent} from 'react'

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

const defaultHandlers: UserBehaviorHandlers = {
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

// Сервис отслеживания поведения пользователя при заполнении полей ввода.
export class UserBehaviorServiceClass {
    // Обработчики взаимодействий с полями ввода.
    private handlers: UserBehaviorHandlers = defaultHandlers

    // Задание обработчиков взаимодействий с полями ввода.
    setHandlers(handlers: UserBehaviorHandlers) {
        this.handlers = handlers
    }

    // Очистка обработчиков взаимодействий с полями ввода.
    unsetHandlers(): void {
        this.handlers = defaultHandlers
    }

    // Обработка события: начало взаимодействия с полем ввода.
    onFocus(
        input: HTMLInputElement | HTMLTextAreaElement,
        id: string,
        value?: string | number | null
    ): void {
        this.handlers.onFocus(input, id, value)
    }

    // Обработка события: завершение взаимодействия с полем ввода.
    onBlur(value?: string | null): void {
        this.handlers.onBlur(value)
    }

    // Обработка события: вставка текста в поле ввода.
    onPaste(): void {
        this.handlers.onPaste()
    }

    // Обработка события: нажатие на клавишу в поле ввода.
    onKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.handlers.onKeyDown(event)
    }

    // Обработка изменения значения в <input type="checkbox"/> и <input type="radio"/>
    onCheckboxOrRadioChange(input: HTMLInputElement, id: string): void {
        this.handlers.onCheckboxOrRadioChange(input, id)
    }
}

export const UserBehaviorService: UserBehaviorServiceClass = new UserBehaviorServiceClass()

/**
 * @deprecated
 * Use import {UserBehaviorService} from '../../services/UserBehaviorService'
 */
export default UserBehaviorService
