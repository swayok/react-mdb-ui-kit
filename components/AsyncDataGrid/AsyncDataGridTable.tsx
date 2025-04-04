import React from 'react'
import clsx from 'clsx'
import DataGridNoItems from '../DataGrid/DataGridNoItems'
import AsyncDataGridLoading from './AsyncDataGridLoading'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AnyObject} from '../../types/Common'
import {AsyncDataGridTableProps} from '../../types/AsyncDataGrid'
import withStable from '../../helpers/withStable'
import FadeIn from '../FadeIn'

// Таблица с данными, получаемыми с сервера (<table>).
function AsyncDataGridTable<RowDataType extends object = AnyObject>(
    props: AsyncDataGridTableProps<RowDataType>
) {

    const {translations} = useAsyncDataGridContext()

    const {
        striped,
        hover,
        small,
        bordered,
        fillHeight,
        verticalAlign,

        className,
        wrapperClass,
        wrapperId,

        renderHeaders,
        renderRow,
        noItemsMessage,

        ...tableProps
    } = props

    const context = useAsyncDataGridContext<RowDataType>()
    const {
        rows,
        totalCount,
        loading,
        loadingError,
        preloaderProps,
        reload,
    } = context

    return (
        <div
            className={clsx(
                'data-grid-table-container position-relative table-responsive',
                fillHeight ? 'data-grid-flex full-height overflow-y-scroll' : null,
                wrapperClass
            )}
            id={wrapperId}
        >
            <table
                className={clsx(
                    'table data-grid m-0',
                    striped ? 'table-striped-manually' : null,
                    hover ? 'table-hover' : null,
                    small ? 'table-sm' : null,
                    bordered ? 'table-bordered' : null,
                    verticalAlign ? 'align-' + verticalAlign : null,
                    className
                )}
                {...tableProps}
            >
                {typeof renderHeaders === 'function' ? renderHeaders() : renderHeaders}
                {rows.length > 0 && !loadingError && (
                    <tbody>
                        {rows.map((rowData: RowDataType, index: number) => renderRow(rowData, index, context))}
                    </tbody>
                )}
            </table>
            <FadeIn visible={totalCount === 0 && !loading}>
                {(!noItemsMessage || typeof noItemsMessage === 'string') ? (
                    <DataGridNoItems flexFill={fillHeight}>
                        {noItemsMessage ?? translations.no_items}
                    </DataGridNoItems>
                ) : (
                    <>{noItemsMessage}</>
                )}
            </FadeIn>
            <AsyncDataGridLoading
                showDelay={totalCount === null ? null : 2000}
                {...preloaderProps}
                loading={loading}
                error={loadingError}
                onReload={reload}
            />
        </div>
    )
}

export default withStable<AsyncDataGridTableProps>(
    ['renderRow', 'renderHeaders'],
    AsyncDataGridTable
) as typeof AsyncDataGridTable
