import React, {useState} from 'react'
import DataGrid from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGrid'
import DataGridCell from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridCell'
import DataGridDefaultLayout from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridDefaultLayout'
import DataGridFiltersPanel from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridFiltersPanel'
import DataGridHeader from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridHeader'
import DataGridHeaders from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridHeaders'
import DataGridRow from 'swayok-react-mdb-ui-kit/components/DataGrid/DataGridRow'
import Input from 'swayok-react-mdb-ui-kit/components/Input/Input'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import data_grid from 'swayok-react-mdb-ui-kit/locales/en/data_grid'

export function DataGridDemo() {

    return (
        <>
            <SectionDivider label="Table default + hover"/>
            <DataGrid
                rows={rows}
                translations={data_grid}
                defaultLimit={5}
                limits={[1, 2, 5, 10, 20]}
                defaultOrderBy="id"
                defaultOrderDirection="asc"
            >
                <DataGridDefaultLayout
                    className="mb-4"
                    filtersPanel={<FiltersPanel/>}
                    renderHeaders={<Headers/>}
                    renderRow={renderRow}
                />
            </DataGrid>

            <DataGrid
                rows={rows}
                translations={data_grid}
                defaultLimit={5}
                limits={[1, 2, 5, 10, 20]}
                defaultOrderBy="id"
                defaultOrderDirection="asc"
            >
                <DataGridDefaultLayout
                    tableProps={{
                        bordered: true,
                    }}
                    filtersPanel={<FiltersPanel/>}
                    renderHeaders={<Headers/>}
                    renderRow={renderRow}
                />
            </DataGrid>
        </>
    )
}

function FiltersPanel() {
    const [
        keywords,
        setKeywords,
    ] = useState<string>('')

    return (
        <DataGridFiltersPanel
            onSubmit={() => {}}
        >
            <Input
                label="Keywords"
                wrapperClass=""
                value={keywords}
                onChange={e => setKeywords(e.currentTarget.value)}
            />
        </DataGridFiltersPanel>
    )
}

function Headers() {
    return (
        <DataGridHeaders>
            <DataGridHeader
                sortable="id"
                numeric
                sortingDataType="number"
            >
                ID
            </DataGridHeader>
            <DataGridHeader
                sortable="name"
                sortingDataType="string"
            >
                Name
            </DataGridHeader>
            <DataGridHeader
                sortable="email"
                sortingDataType="string"
            >
                E-mail
            </DataGridHeader>
            <DataGridHeader
                sortable="is_active"
                sortingDataType="boolean"
                nowrap
            >
                Is Active
            </DataGridHeader>
        </DataGridHeaders>
    )
}

function renderRow(row: RowData, index: number) {
    return (
        <DataGridRow
            key={row.id}
            index={index}
        >
            <DataGridCell>{row.id}</DataGridCell>
            <DataGridCell>{row.name}</DataGridCell>
            <DataGridCell>{row.email}</DataGridCell>
            <DataGridCell>{row.is_active ? 'Yes' : 'No'}</DataGridCell>
        </DataGridRow>
    )
}

interface RowData {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
}

const rows: RowData[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        is_active: true,
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        is_active: false,
    },
    {
        id: 3,
        name: 'Alice Johnson',
        email: 'alicejohnson@example.com',
        is_active: true,
    },
    {
        id: 4,
        name: 'Bob Brown',
        email: 'bobbrwon@example.com',
        is_active: false,
    },
    {
        id: 5,
        name: 'Charlie Wilson',
        email: 'charliewilson@example.com',
        is_active: true,
    },
    {
        id: 6,
        name: 'David Davis',
        email: 'daviddavis@example.com',
        is_active: false,
    },
    {
        id: 7,
        name: 'Emily Thompson',
        email: 'emilythompson@example.com',
        is_active: true,
    },
    {
        id: 8,
        name: 'Frank Lee',
        email: 'franklee@example.com',
        is_active: false,
    },
    {
        id: 9,
        name: 'Grace Wilson',
        email: 'gracewilson@example.com',
        is_active: true,
    },
    {
        id: 10,
        name: 'Hannah Thompson',
        email: 'hannahthompson@example.com',
        is_active: false,
    },
]
