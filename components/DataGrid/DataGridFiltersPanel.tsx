import React from 'react'
import clsx from 'clsx'
import DataGridFiltersPanelLabel from './DataGridFiltersPanelLabel'
import DataGridFiltersPanelButtons from './DataGridFiltersPanelButtons'
import {DataGridFiltersPanelProps} from '../../types/DataGrid'
import withStable from '../../helpers/withStable'

// Панель фильтрации для таблицы.
function DataGridFiltersPanel(props: DataGridFiltersPanelProps) {

    const {
        children,
        className,
        flex = true,
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
                'data-grid-filters m-0',
                borderBottom ? 'border-bottom' : null,
                flex ? 'd-flex flex-row flex-wrap align-items-center justify-content-start' : null,
                paddings ? 'pt-1 pb-1 ps-2 pe-2' : null,
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
            {!noLabel && <DataGridFiltersPanelLabel/>}
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

export default withStable<DataGridFiltersPanelProps>(
    ['onReset', 'onSubmit'],
    DataGridFiltersPanel
)
