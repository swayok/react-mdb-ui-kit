import clsx from 'clsx'
import React from 'react'
import {DataGridFiltersPanelProps} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'
import {DataGridFiltersPanelButtons} from './DataGridFiltersPanelButtons'
import {DataGridFiltersPanelLabel} from './DataGridFiltersPanelLabel'

// Панель фильтрации для таблицы.
export function DataGridFiltersPanel(props: DataGridFiltersPanelProps) {

    const {
        children,
        className,
        borderBottom = true,
        paddings = true,
        disabled,
        onSubmit,
        onReset,
        noLabel,
        noButtons,
        iconsAsButtons,
        buttonsContainerClassName = 'ms-auto',
        autoSubmit,
        ...otherProps
    } = props

    return (
        <form
            {...otherProps}
            className={clsx(
                'data-grid-filters m-0 form-inline flex-wrap align-items-center',
                borderBottom ? 'border-bottom' : null,
                paddings ? 'p-3' : null,
                className
            )}
            action="/public"
            method="get"
            noValidate
            onSubmit={event => {
                event.preventDefault()
                if (!disabled) {
                    onSubmit()
                }
            }}
            onReset={event => {
                event.preventDefault()
                if (!disabled && onReset) {
                    onReset()
                }
            }}
        >
            {!noLabel && <DataGridFiltersPanelLabel />}
            {children}
            {!noButtons && (
                <DataGridFiltersPanelButtons
                    disabled={disabled}
                    submitButton={!autoSubmit}
                    onSubmit={onSubmit}
                    resetButton={!!onReset}
                    onReset={onReset}
                    className={buttonsContainerClassName}
                    icons={iconsAsButtons}
                />
            )}
        </form>
    )
}

/** @deprecated */
export default DataGridFiltersPanel
