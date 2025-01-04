import React, {useCallback, useMemo} from 'react'
import clsx from 'clsx'
import {FormSelectOption} from '../../types/Common'
import SelectInput from '../Input/SelectInput/SelectInput'
import {useDataGridContext} from './DataGridContext'
import {DataGridItemsCountProps} from '../../types/DataGrid'
import withStable from '../../helpers/withStable'
import {DropdownProps} from '../Dropdown/Dropdown'

const dorpdownProps: Partial<DropdownProps> = {
    offset: 6,
    positioningContainer: 'wrapper',
    placement: 'top',
}

// Количество строк в таблице, диапазон отображаемых строк и выбор лимита строк на странице.
function DataGridItemsCount(props: DataGridItemsCountProps) {

    const {translations} = useDataGridContext()

    const {
        className,
        filteredCount,
        totalCount,
        offset,
        limits,
        limit,
        onLimitChange,
        disabled,
        ...otherProps
    } = props

    const limitsOptions: Array<FormSelectOption<number>> = useMemo(() => {
        if (!limits || limits.length === 0) {
            return []
        }
        const options: Array<FormSelectOption<number>> = []
        for (let i = 0; i < limits.length; i++) {
            options.push({
                label: String(limits[i]),
                value: limits[i],
            })
        }
        return options
    }, [limits])

    const handleLimitChange = useCallback((value: number) => {
        if (!disabled) {
            onLimitChange?.(value)
        }
    }, [onLimitChange, disabled])

    const valueToString = useCallback(
        (option: FormSelectOption<number>) => translations.items_count.items_per_page(option.value),
        [translations]
    )

    return (
        <div
            {...otherProps}
            className={clsx(
                'data-grid-items-count-panel me-3 d-flex flex-row align-items-center justify-content-start',
                className
            )}
        >
            {(filteredCount === undefined || totalCount === filteredCount) ? (
                <span>
                    {translations.items_count.items_total(totalCount)}
                </span>
            ) : (
                <span>
                    {translations.items_count.items_filtered(
                        totalCount,
                        filteredCount
                    )}
                </span>
            )}
            <span className="data-grid-vertical-separator"/>
            <span>
                {translations.items_count.items_shown(
                    totalCount === 0 ? 0 : offset + 1,
                    Math.min(totalCount, offset + limit)
                )}
            </span>
            {limitsOptions.length > 1 && !!onLimitChange && (
                <div className="d-flex flex-row align-items-center justify-content-start">
                    <span className="data-grid-vertical-separator"/>
                    <SelectInput<number>
                        options={limitsOptions}
                        value={limit}
                        small
                        dropdownProps={dorpdownProps}
                        mode="inline"
                        wrapperClass="m-0 data-grid-footer-items-limit-select"
                        valueToString={valueToString}
                        onChange={handleLimitChange}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    )
}

export default withStable(['onLimitChange'], DataGridItemsCount)
