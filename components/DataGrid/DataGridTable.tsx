import clsx from 'clsx'
import {DataGridNoItems} from './DataGridNoItems'
import {useDataGridContext} from './DataGridContext'
import {AnyObject} from '../../types'
import {DataGridTableProps} from './DataGridTypes'
import {FadeSwitch} from '../FadeSwitch'

// Таблица с данными (<table>).
export function DataGridTable<
    RowDataType extends object = AnyObject,
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
        wrapperClassName,
        wrapperId,
        wrapperStyle,

        Headers,
        renderRow,
        TotalsRow,
        noItemsMessage,

        ...tableProps
    } = props

    const context = useDataGridContext<RowDataType>()
    const visibleRows = context.visibleRows

    const renderNoItemsMessage = () => {
        if (!noItemsMessage || typeof noItemsMessage === 'string') {
            return (
                <DataGridNoItems flexFill={flexFill}>
                    {noItemsMessage ?? translations.no_items}
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
                wrapperClassName
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
                        {Headers}
                        <tbody>
                            {visibleRows.map(
                                (rowData, index, rows) => renderRow(
                                    rowData,
                                    index,
                                    rows,
                                    context
                                )
                            )}
                        </tbody>
                        {!!TotalsRow && (
                            <tfoot>
                                {TotalsRow && <TotalsRow />}
                            </tfoot>
                        )}
                    </table>
                )}
            </FadeSwitch>
        </div>
    )
}

/** @deprecated */
export default DataGridTable
