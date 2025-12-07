import BaseDropdown from '@restart/ui/Dropdown'
import clsx from 'clsx'
import React, {
    useImperativeHandle,
    useMemo,
    useState,
} from 'react'
import {useUncontrolled} from 'uncontrollable'
import {useEventCallback} from '../../helpers/useEventCallback'
import {DropdownContext} from './DropdownContext'
import {
    DropdownApi,
    DropdownContextProps,
    DropdownMenuOffset,
    DropdownProps,
    DropdownToggleEventMetadata,
} from './DropdownTypes'
import {getDropdownMenuPlacement} from './getDropdownMenuPlacement'

const directionClasses = {
    down: 'dropdown',
    'down-centered': 'dropdown-center',
    up: 'dropup',
    'up-centered': 'dropup-center dropup',
    end: 'dropend',
    start: 'dropstart',
} as const

// Обёртка и контекст выпадающего меню.
export function Dropdown(props: DropdownProps) {
    const {
        defaultShow,
        show,
        drop = 'down',
        align = 'start',
        className,
        onSelect,
        onToggle,
        focusFirstItemOnShow,
        tag: Tag = 'div',
        autoClose = true,
        ref,
        isRTL,
        offset,
        ...otherProps
    } = useUncontrolled(props, {show: 'onToggle'})

    const [
        disableAllItems,
        setDisableAllItems,
    ] = useState<boolean>(false)

    // Обработка переключения состояния Dropdown.
    const handleToggle = useEventCallback(
        (nextShow: boolean, meta: DropdownToggleEventMetadata = {}) => {
            /**
             * Является ли элемент события компонентом DropdownToggle.
             */
            const isToggleButton = (
                meta.originalEvent?.target as HTMLElement
            )?.classList.contains('dropdown-toggle')

            // Если элемент события - DropdownToggle, и meta.source === 'mousedown',
            // то нужно прекратить выполнение, чтобы метод не выполнялся дважды при срабатывании
            // события "click outside" при нажатии на DropdownToggle.
            if (isToggleButton && meta.source === 'mousedown') {
                return
            }

            if (
                meta.originalEvent?.currentTarget === document
                && (
                    meta.source !== 'keydown'
                    || (meta.originalEvent as KeyboardEvent)?.key === 'Escape'
                )
            ) {
                meta.source = 'rootClose'
            }

            if (isClosingPermitted(meta.source!, autoClose)) {
                onToggle?.(nextShow, meta)
            }
        }
    )

    // API компонента для использования во внешних компонентах.
    useImperativeHandle(ref, (): DropdownApi => ({
        toggle: handleToggle,
    }))

    // Вычисление расположения выпадающего меню относительно DropdownToggle.
    // Не работает, если нет компонента DropdownToggle внутри Dropdown.
    const placement = useMemo(
        () => getDropdownMenuPlacement(
            align === 'end',
            drop,
            isRTL
        ),
        [align, drop, isRTL]
    )

    // Контекст.
    const contextProps: DropdownContextProps = useMemo(
        (): DropdownContextProps => ({
            align,
            drop,
            isRTL,
            // Смещение выпадающего меню относительно DropdownToggle или контейнера.
            offset: typeof offset === 'number'
                ? [0, offset] as DropdownMenuOffset
                : offset,
            disableAllItems,
            setDisableAllItems,
        }),
        [
            align,
            drop,
            isRTL,
            (Array.isArray(offset) ? offset.join(',') : offset),
            disableAllItems,
        ]
    )

    return (
        <DropdownContext.Provider value={contextProps}>
            <BaseDropdown
                placement={placement}
                show={show}
                defaultShow={defaultShow}
                onSelect={onSelect}
                onToggle={handleToggle}
                focusFirstItemOnShow={focusFirstItemOnShow}
                itemSelector=".dropdown-item:not(.disabled):not(:disabled)"
            >
                <Tag
                    {...otherProps}
                    ref={ref}
                    className={clsx(
                        className,
                        show && 'show',
                        directionClasses[drop]
                    )}
                />
            </BaseDropdown>
        </DropdownContext.Provider>
    )
}

// Проверить, разрешено ли закрытие Dropdown?
function isClosingPermitted(source: string, autoClose: DropdownProps['autoClose']): boolean {
    // autoClose === false разрешает закрытие только при нажатии на DropdownToggle.
    // Такое событие помечается source === 'click'.
    if (!autoClose) {
        return source === 'click'
    }

    // autoClose === inside разрешает закрытие при клике внутри DropdownMenu,
    // но не при клике вне DropdownMenu.
    if (autoClose === 'inside') {
        return source !== 'rootClose'
    }

    // autoClose === outside разрешает закрытие при клике вне DropdownMenu,
    // но не при клике внутри DropdownMenu.
    if (autoClose === 'outside') {
        return source !== 'select'
    }

    // Закрытие разрешено при любом source.
    return true
}
