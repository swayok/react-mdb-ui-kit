import clsx from 'clsx'
import React from 'react'
import {AsyncDataGridTableProps} from 'swayok-react-mdb-ui-kit/components/AsyncDataGrid/AsyncDataGridTypes'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'
import {DataGridNoItems} from '../DataGrid/DataGridNoItems'
import {FadeIn} from '../FadeIn'
import {useAsyncDataGridContext} from './AsyncDataGridContext'
import {AsyncDataGridLoading} from './AsyncDataGridLoading'

// Таблица с данными, получаемыми с сервера (<table>).
export function AsyncDataGridTable<RowDataType extends object = AnyObject>(
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

        Headers,
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
                {Headers}
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

/** @deprecated */
export default AsyncDataGridTable
