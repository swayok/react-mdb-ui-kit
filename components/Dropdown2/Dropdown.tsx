import useEventCallback from '@restart/hooks/useEventCallback'
import BaseDropdown, {ToggleMetadata} from '@restart/ui/Dropdown'
import clsx from 'clsx'
import React, {useMemo} from 'react'
import {DropdownContextValue} from './DropdownContext'
import {DropdownMenuOffset} from './DropdownTypes'
import {useUncontrolled} from 'uncontrollable'
import {DropdownContext} from './DropdownContext'
import {DropdownProps} from './DropdownTypes'
import {getDropdownMenuPlacement} from './getDropdownMenuPlacement'

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
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        tag: Component = 'div',
        autoClose = true,
        ref,
        isRTL,
        offset,
        ...otherProps
    } = useUncontrolled(props, {show: 'onToggle'})

    const isClosingPermitted = (source: string): boolean => {
        // autoClose=false only permits close on button click
        if (autoClose === false) {
            return source === 'click'
        }

        // autoClose=inside doesn't permit close on rootClose
        if (autoClose === 'inside') {
            return source !== 'rootClose'
        }

        // autoClose=outside doesn't permit close on select
        if (autoClose === 'outside') {
            return source !== 'select'
        }

        return true
    }

    const handleToggle = useEventCallback(
        (nextShow: boolean, meta: ToggleMetadata) => {
            /**
             * Checking if target of event is ToggleButton,
             * if it is then nullify mousedown event
             */
            const isToggleButton = (
                meta.originalEvent?.target as HTMLElement
            )?.classList.contains('dropdown-toggle')

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

            if (isClosingPermitted(meta.source!)) {
                onToggle?.(nextShow, meta)
            }
        }
    )

    const placement = getDropdownMenuPlacement(
        align === 'end',
        drop,
        isRTL
    )

    const normalizedOffset: DropdownMenuOffset | undefined = typeof offset === 'number'
        ? [0, offset] as DropdownMenuOffset
        : offset
    const contextValue: DropdownContextValue = useMemo(
        (): DropdownContextValue => ({
            align,
            drop,
            isRTL,
            offset: normalizedOffset,
        }),
        [
            align,
            drop,
            isRTL,
            (Array.isArray(normalizedOffset) ? normalizedOffset.join(',') : normalizedOffset),
        ]
    )

    const directionClasses = {
        down: 'dropdown',
        'down-centered': 'dropdown-center',
        up: 'dropup',
        'up-centered': 'dropup-center dropup',
        end: 'dropend',
        start: 'dropstart',
    }

    return (
        <DropdownContext.Provider value={contextValue}>
            <BaseDropdown
                placement={placement}
                show={show}
                defaultShow={defaultShow}
                onSelect={onSelect}
                onToggle={handleToggle}
                focusFirstItemOnShow={focusFirstItemOnShow}
                itemSelector=".dropdown-item:not(.disabled):not(:disabled)"
            >
                <Component
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
