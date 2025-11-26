import React from 'react'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import clsx from 'clsx'
import DataGridItemsCount from '../DataGrid/DataGridItemsCount'
import DataGridPagination from '../DataGrid/DataGridPagination'
import Icon from '../Icon'
import {mdiRefresh} from '@mdi/js'
import DataGridFooterWrapper from '../DataGrid/DataGridFooterWrapper'
import {AsyncDataGridFooterProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'

// Подвал таблицы с данными.
// Слева:
// - количество строк в таблице;
// - диапазон отображаемых строк;
// - выбор лимита кол-ва строк, отображаемых на странице.
// Справа:
// - пагинация;
// - кнопка перезагрузки данных.
export const AsyncDataGridFooter = React.memo(function AsyncDataGridFooter(props: AsyncDataGridFooterProps) {

    const {
        disabled,
        reloader = true,
        limitChanger = true,
        paginationProps = {
            numbers: true,
        },
        shadow = true,
        border = false,
        ...otherProps
    } = props

    const {
        limit,
        offset,
        limits,
        totalCount,
        setLimit,
        setOffset,
        loading,
        reload,
    } = useAsyncDataGridContext()

    const isDisabled: boolean = !!disabled || loading

    return (
        <DataGridFooterWrapper
            {...otherProps}
            shadow={shadow}
            border={border}
        >
            <DataGridItemsCount
                totalCount={totalCount ?? 0}
                offset={offset}
                limit={limit}
                limits={limitChanger ? limits : undefined}
                onLimitChange={setLimit}
                disabled={isDisabled}
            />
            <div className="d-flex flex-row align-items-center justify-content-end">
                <DataGridPagination
                    {...paginationProps}
                    totalCount={totalCount ?? 0}
                    offset={offset}
                    limit={limit}
                    disabled={isDisabled}
                    onOffsetChange={setOffset}
                />
                {reloader && (
                    <div
                        className={clsx(
                            'page-item',
                            isDisabled ? 'disabled' : null
                        )}
                    >
                        <div
                            className={clsx(
                                'page-link with-icon ms-2 clickable',
                                isDisabled ? 'disabled' : null
                            )}
                            onClick={() => {
                                if (!isDisabled) {
                                    reload()
                                }
                            }}
                        >
                            <Icon path={mdiRefresh}/>
                        </div>
                    </div>
                )}
            </div>
        </DataGridFooterWrapper>
    )
})
