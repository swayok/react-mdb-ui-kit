import React from 'react'
import clsx from 'clsx'
import {
    DataGridOrderingPanelOptionType,
    DataGridOrderingPanelProps,
} from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridTypes'
import {DataGridOrderingPanelLabel} from './DataGridOrderingPanelLabel'
import SelectInput from '../Input/SelectInput/SelectInput'
import {IconButton} from '../IconButton'
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

interface OrderingDirectionIcons {
    asc: string
    desc: string
}

// Панель фильтрации для таблицы.
export function DataGridOrderingPanel<
    SortableColumn extends string = string,
>(props: DataGridOrderingPanelProps<SortableColumn>) {

    const {
        translations,
        defaultOrderBy,
        orderBy = defaultOrderBy,
        orderDirection,
        setOrder,
        loading,
    } = useDataGridContext()

    const {
        options,
        resetOffset,
        paddings = 'py-1 px-2',
        disabled = false,
        noLabel,
        className,
        ...otherProps
    } = props

    // Получение иконок для кнопок направления сортировки.
    const directionIcons: OrderingDirectionIcons = getOrderDirectionIcons(
        options,
        orderBy
    )

    const isDisabled: boolean = disabled || loading

    return (
        <div
            {...otherProps}
            className={clsx(
                'data-grid-ordering m-0 d-flex flex-row align-items-center justify-content-start',
                paddings,
                className
            )}
        >
            {!noLabel && (
                <DataGridOrderingPanelLabel />
            )}
            <SelectInput<SortableColumn>
                value={(orderBy ?? '') as SortableColumn}
                options={options}
                small
                mode="inline"
                wrapperClass="m-0"
                dropdownFluidWidth={false}
                disabled={isDisabled}
                onChange={(value: SortableColumn): void => {
                    setOrder(value, orderDirection, !!resetOffset)
                }}
            />
            <IconButton
                path={directionIcons.asc}
                color={orderDirection === 'asc' ? 'primary' : 'muted'}
                tooltip={translations.ordering.ascending}
                className="ms-3"
                disabled={isDisabled}
                onClick={(): void => {
                    setOrder(orderBy ?? '', 'asc', !!resetOffset)
                }}
            />
            <IconButton
                path={directionIcons.desc}
                color={orderDirection === 'desc' ? 'primary' : 'muted'}
                tooltip={translations.ordering.descending}
                className="ms-3"
                disabled={isDisabled}
                onClick={(): void => {
                    setOrder(orderBy ?? '', 'desc', !!resetOffset)
                }}
            />
        </div>
    )
}

/** @deprecated */
export default DataGridOrderingPanel

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

// Получить иконки сортировки в зависимости от типа колонки, по которой идет сортировка.
function getOrderDirectionIcons(
    options: DataGridOrderingPanelProps['options'],
    orderBy: string | null
): OrderingDirectionIcons {
    for (const option of options) {
        if (option.value === orderBy) {
            const type: DataGridOrderingPanelOptionType = option.type ?? 'default'
            return orderingDirectionIcons[type]
        }
    }
    return orderingDirectionIcons.default
}
