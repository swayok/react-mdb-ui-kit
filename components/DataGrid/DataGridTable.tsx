import React from 'react'
import clsx from 'clsx'
import DataGridNoItems from './DataGridNoItems'
import {useDataGridContext} from './DataGridContext'
import {AnyObject} from '../../types/Common'
import {DataGridTableProps} from '../../types/DataGrid'
import withStable from '../../helpers/withStable'
import FadeSwitch from '../FadeSwitch'

// Таблица с данными (<table>).
function DataGridTable<
    RowDataType extends object = AnyObject
>(props: DataGridTableProps<RowDataType>) {

    const {translations} = useDataGridContext()

    const {
        striped,
        hover,
        small,
        bordered,
        flexFill,
        verticalAlign,

        className,
        wrapperClass,
        wrapperId,
        wrapperStyle,

        renderHeaders,
        renderRow,
        renderTotalsRow,
        noItemsMessage,

        ...tableProps
    } = props

    const context = useDataGridContext<RowDataType>()
    const {visibleRows} = context

    const renderNoItemsMessage = () => {
        if (!noItemsMessage || typeof noItemsMessage === 'string') {
            return (
                <DataGridNoItems flexFill={flexFill}>
                    {noItemsMessage || translations.no_items}
                </DataGridNoItems>
            )
        } else {
            return noItemsMessage
        }
    }

    return (
        <div
            className={clsx(
                'data-grid-table-container position-relative table-responsive',
                flexFill ? 'data-grid-flex flex-1 overflow-y-scroll' : null,
                wrapperClass
            )}
            id={wrapperId}
            style={wrapperStyle}
        >
            <FadeSwitch transitionKey={visibleRows.length === 0}>
                {visibleRows.length === 0 ? renderNoItemsMessage() : (
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
                        {visibleRows.length > 0 && (
                            <tbody>
                                {visibleRows.map((
                                    rowData: Readonly<RowDataType>,
                                    index: number,
                                    rows: ReadonlyArray<RowDataType>
                                ) => renderRow(rowData, index, rows, context))}
                            </tbody>
                        )}
                        {!!renderTotalsRow && visibleRows.length > 0 && (
                            <tfoot>
                                {renderTotalsRow?.(visibleRows, context)}
                            </tfoot>
                        )}
                    </table>
                )}
            </FadeSwitch>
        </div>
    )
}

export default withStable<DataGridTableProps>(
    ['renderRow', 'renderTotalsRow', 'renderHeaders'],
    DataGridTable
) as typeof DataGridTable
