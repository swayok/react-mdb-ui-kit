import clsx from 'clsx'
import React from 'react'
import {SectionDivider} from '../../components/SectionDivider'

export function TablesDemo() {

    return (
        <>
            <SectionDivider label="Table default + hover"/>
            <table className="table table-hover">
                <TableContent/>
            </table>
            <SectionDivider label="Table bordered striped hover"/>
            <table className="table table-bordered table-striped table-hover">
                <TableContent/>
            </table>
            <SectionDivider label="Table borderless"/>
            <table className="table table-borderless">
                <TableContent/>
            </table>
            <SectionDivider label="Table small no last border"/>
            <table className="table table-sm table-no-border-for-last-row">
                <TableContent footer={false}/>
            </table>
            <SectionDivider label="Table striped manually"/>
            <table className="table">
                <TableContent evenOdd/>
            </table>
            <SectionDivider label="Table with highlighted cells and rows"/>
            <table className="table">
                <TableContent highlights/>
            </table>
        </>
    )
}

function TableContent(props: {
    evenOdd?: boolean,
    footer?: boolean,
    highlights?: boolean
} = {footer: true}) {
    return (
        <>
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                    <th>Column 4</th>
                </tr>
            </thead>
            <tbody>
                <tr className={props.evenOdd ? 'odd' : ''}>
                    <td>Value 1</td>
                    <td>Value 2</td>
                    <td className={props.highlights ? 'table-highlight-gray' : ''}>
                        Value 3
                    </td>
                    <td>Value 4</td>
                </tr>
                <tr className={props.evenOdd ? 'odd' : ''}>
                    <td>Value 1</td>
                    <td>Value 2</td>
                    <td className={props.highlights ? 'table-highlight-orange' : ''}>
                        Value 3
                    </td>
                    <td>Value 4</td>
                </tr>
                <tr className={props.evenOdd ? 'even' : ''}>
                    <td>Value 1</td>
                    <td>Value 2</td>
                    <td className={props.highlights ? 'table-highlight-green' : ''}>
                        Value 3
                    </td>
                    <td>Value 4</td>
                </tr>
                <tr className={props.evenOdd ? 'odd' : ''}>
                    <td>Value 1</td>
                    <td>Value 2</td>
                    <td className={props.highlights ? 'table-highlight-red' : ''}>
                        Value 3
                    </td>
                    <td>Value 4</td>
                </tr>
                <tr className={props.evenOdd ? 'even' : ''}>
                    <td>Value 1</td>
                    <td>Value 2</td>
                    <td className={props.highlights ? 'table-highlight-blue' : ''}>
                        Value 3
                    </td>
                    <td>Value 4</td>
                </tr>
                <tr className={clsx(
                    props.evenOdd ? 'even' : null,
                    props.highlights ? 'table-highlight-green' : ''
                )}>
                    <td>Value 1</td>
                    <td>Value 2</td>
                    <td>Value 3</td>
                    <td>Value 4</td>
                </tr>
            </tbody>
            {props.footer && (
                <tfoot>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                        <th>Column 4</th>
                    </tr>
                </tfoot>
            )}
        </>
    )
}
