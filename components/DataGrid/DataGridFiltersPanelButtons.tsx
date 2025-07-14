import React from 'react'
import Button from '../Button'
import {useDataGridContext} from './DataGridContext'
import {DataGridFiltersPanelButtonsProps} from '../../types/DataGrid'
import clsx from 'clsx'
import IconButton from '../IconButton'
import {mdiCheck, mdiClose} from '@mdi/js'
import withStable from '../../helpers/withStable'

// Кнопки для панели фильтрации: применить и сбросить.
function DataGridFiltersPanelButtons(props: DataGridFiltersPanelButtonsProps) {

    const {
        translations,
        loading,
    } = useDataGridContext()

    const {
        disabled,
        submitButton = true,
        onSubmit,
        resetButton = true,
        onReset,
        icons,
        className,
        ...otherProps
    } = props

    if (!submitButton && !resetButton) {
        return null
    }

    const buttons: Record<'submit' | 'reset', null | React.ReactNode> = {
        submit: null,
        reset: null,
    }

    if (submitButton) {
        buttons.submit = icons
            ? (
                <IconButton
                    path={mdiCheck}
                    size={30}
                    tooltip={translations.filters.apply}
                    color="blue"
                    disabled={disabled ?? loading}
                    onClick={() => onSubmit?.()}
                />
            )
            : (
                <Button
                    color="blue"
                    type={onSubmit ? 'button' : 'submit'}
                    className="full-height"
                    disabled={!!disabled || loading}
                    onClick={onSubmit}
                >
                    {translations.filters.apply}
                </Button>
            )
    }

    if (resetButton) {
        buttons.reset = icons
            ? (
                <IconButton
                    path={mdiClose}
                    size={30}
                    tooltip={translations.filters.reset}
                    color="muted"
                    disabled={disabled ?? loading}
                    onClick={() => onReset?.()}
                />
            )
            : (
                <Button
                    color="gray"
                    type={onSubmit ? 'button' : 'reset'}
                    className="full-height"
                    disabled={!!disabled || loading}
                    onClick={onReset}
                >
                    {translations.filters.reset}
                </Button>
            )
    }

    return (
        <div
            {...otherProps}
            className={clsx(
                'align-self-stretch d-flex flex-row gap-3 align-items-center justify-content-end',
                className
            )}
        >
            {/* Кнопка требуется, чтобы отрабатывало submit событие формы при нажатии Enter в поле ввода.*/}
            <button type="submit" className="d-none"/>
            {buttons.submit}
            {buttons.reset}
        </div>
    )
}

export default withStable<DataGridFiltersPanelButtonsProps>(
    ['onReset', 'onSubmit'],
    DataGridFiltersPanelButtons
)
