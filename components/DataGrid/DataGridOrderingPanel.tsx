import React from 'react'
import clsx from 'clsx'
import {
    DataGridOrderingPanelOption,
    DataGridOrderingPanelOptionType,
    DataGridOrderingPanelProps,
} from '../../types/DataGrid'
import DataGridOrderingPanelLabel from './DataGridOrderingPanelLabel'
import SelectInput from '../Input/SelectInput/SelectInput'
import IconButton from '../IconButton'
import {
    mdiSortAlphabeticalAscending,
    mdiSortAlphabeticalDescending,
    mdiSortAscending,
    mdiSortCalendarAscending,
    mdiSortCalendarDescending,
    mdiSortDescending,
    mdiSortNumericAscending,
    mdiSortNumericDescending,
} from '@mdi/js'
import {useDataGridContext} from './DataGridContext'

type OrderingDirectionIcons = {
    asc: string,
    desc: string
}

// Панель фильтрации для таблицы.
function DataGridOrderingPanel<
    SortableColumn extends string = string
>(props: DataGridOrderingPanelProps<SortableColumn>) {

    const {
        translations,
        orderBy,
        orderDirection,
        defaultOrderBy,
        setOrder,
        loading,
    } = useDataGridContext()

    const {
        options,
        resetOffset,
        paddings,
        disabled,
        noLabel,
        className,
        ...otherProps
    } = props

    // Получение иконок для кнопок направления сортировки.
    const directionIcons: OrderingDirectionIcons = getOrderDirectionIcons(
        options,
        orderBy || defaultOrderBy
    )

    return (
        <div
            {...otherProps}
            className={clsx(
                'data-grid-ordering m-0 d-flex flex-row align-items-center justify-content-start',
                paddings || paddings === undefined ? 'py-1 px-2' : null,
                className
            )}
        >
            {!noLabel && (
                <DataGridOrderingPanelLabel/>
            )}
            <SelectInput<SortableColumn>
                value={(orderBy || defaultOrderBy || '') as SortableColumn}
                options={options}
                small
                mode="inline"
                wrapperClass="m-0"
                dropdownFluidWidth={false}
                disabled={disabled || loading}
                onChange={(value: SortableColumn): void => {
                    setOrder(value, orderDirection, !!resetOffset)
                }}
            />
            <IconButton
                path={directionIcons.asc}
                color={orderDirection === 'asc' ? 'theme' : 'muted'}
                tooltip={translations.ordering.ascending}
                className="ms-3"
                disabled={disabled || loading}
                onClick={(): void => {
                    setOrder(orderBy || defaultOrderBy || '', 'asc', !!resetOffset)
                }}
            />
            <IconButton
                path={directionIcons.desc}
                color={orderDirection === 'desc' ? 'theme' : 'muted'}
                tooltip={translations.ordering.descending}
                className="ms-3"
                disabled={disabled || loading}
                onClick={(): void => {
                    setOrder(orderBy || defaultOrderBy || '', 'desc', !!resetOffset)
                }}
            />
        </div>
    )
}

export default React.memo(DataGridOrderingPanel) as typeof DataGridOrderingPanel

// Иконки направления сортировки для разных типов данных.
const orderingDirectionIcons: Record<DataGridOrderingPanelOptionType, OrderingDirectionIcons> = {
    numbers: {
        asc: mdiSortNumericAscending,
        desc: mdiSortNumericDescending,
    },
    dates: {
        asc: mdiSortCalendarAscending,
        desc: mdiSortCalendarDescending,
    },
    strings: {
        asc: mdiSortAlphabeticalAscending,
        desc: mdiSortAlphabeticalDescending,
    },
    default: {
        asc: mdiSortAscending,
        desc: mdiSortDescending,
    },
}

// Получить иконки сортировки в зависимости от типа колонки по которой идет сортировка.
function getOrderDirectionIcons(
    options: DataGridOrderingPanelProps['options'],
    orderBy: string | null
): OrderingDirectionIcons {
    for (let i = 0; i < options.length; i++) {
        const option: DataGridOrderingPanelOption = options[i]
        if (option.value === orderBy) {
            const type: DataGridOrderingPanelOptionType = option.type || 'default'
            return orderingDirectionIcons[type]
        }
    }
    return orderingDirectionIcons.default
}
