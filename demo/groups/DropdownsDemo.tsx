import {
    mdiMenu,
    mdiMenuClose,
} from '@mdi/js'
import {
    FormSelectOptionsAndGroupsList,
    FormSelectOptionsList,
} from '../../types'
import {Dropdown} from '../../components/Dropdown/Dropdown'
import {DropdownItem} from '../../components/Dropdown/DropdownItem'
import {DropdownMenu} from '../../components/Dropdown/DropdownMenu'
import {DropdownToggle} from '../../components/Dropdown/DropdownToggle'
import {SubmenuDropdownToggle} from '../../components/Dropdown/SubmenuDropdownToggle'
import {Icon} from '../../components/Icon/Icon'
import {ComboboxInput} from '../../components/Input/ComboboxInput'
import {DateInput} from '../../components/Input/DateInput'
import {MultiSelectInput} from '../../components/Input/SelectInput/MultiSelectInput'
import {SelectInput} from '../../components/Input/SelectInput/SelectInput'
import {useFormValues} from '../../helpers/form/useFormValues'

// Демонстрация выпадающих меню.
export function DropdownsDemo() {

    // todo: data grid pagination filler

    const {
        formValues,
        setFormValue,
    } = useFormValues<{
        select1: string
        select2: string
        select3: string
        select4: string
        selectVirtual1: string
        selectVirtual2: string
        selectInline1: string
        selectAutoDropdown1: string
        multiSelect1: string[]
        multiSelect2: string[]
        multiSelect3: string[]
        combobox1: string
        combobox2: string
        date1: Date | null
        dateRange1: [Date | null, Date | null]
    }>({
        select1: 'option1',
        select2: 'option1',
        select3: 'option1',
        select4: 'option1',
        selectVirtual1: 'option1',
        selectVirtual2: 'option1',
        selectInline1: 'option1',
        selectAutoDropdown1: 'option1',
        multiSelect1: [],
        multiSelect2: [],
        multiSelect3: [],
        combobox1: '',
        combobox2: '',
        date1: null,
        dateRange1: [null, null],
    })

    const optionsSeveral: FormSelectOptionsList = [
        {label: 'Option 1', value: 'option1'},
        {label: 'Option 2', value: 'option2'},
        {label: 'Option 3', value: 'option3'},
        {label: 'Option 4', value: 'option4'},
        {label: 'Option 5', value: 'option5'},
    ]

    const optionsMany: FormSelectOptionsList = [
        {label: 'Option 1', value: 'option1'},
        {label: 'Option 2', value: 'option2'},
        {label: 'Option 3', value: 'option3'},
        {label: 'Option 4', value: 'option4'},
        {label: 'Option 5', value: 'option5'},
        {label: 'Option 6', value: 'option6'},
        {label: 'Option 7', value: 'option7'},
        {label: 'Option 8', value: 'option8'},
        {label: 'Option 9', value: 'option9'},
        {label: 'Option 10', value: 'option10'},
        {label: 'Option 11', value: 'option11'},
        {label: 'Option 12', value: 'option12'},
        {label: 'Option 13', value: 'option13'},
        {label: 'Option 14', value: 'option14'},
        {label: 'Option 15', value: 'option15'},
    ]

    const optionsGrouped: FormSelectOptionsAndGroupsList = [
        {
            label: 'Option outside group 1',
            value: 'outside1',
        },
        {
            label: 'Group 1',
            options: [
                {label: 'Option 1', value: 'option1'},
                {label: 'Option 2', value: 'option2'},
                {label: 'Option 3', value: 'option3'},
            ],
        },
        {
            label: 'Option outside group 2',
            value: 'outside2',
        },
        {
            label: 'Group 2',
            options: [
                {label: 'Option 4', value: 'option4'},
                {label: 'Option 5', value: 'option5'},
                {label: 'Option 6', value: 'option6'},
            ],
            extra: {
                radios: true,
            },
        },
        {
            label: 'Option outside group 3',
            value: 'outside3',
        },
    ]

    return (
        <div className="d-flex flex-column">
            <div className="mb-4 flex-1 d-flex flex-row align-items-center gap-4">
                <Dropdown>
                    <DropdownToggle
                        color="gray"
                        small
                    >
                        Menu
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => alert('Test')}>
                            On click Alert
                        </DropdownItem>
                        <DropdownItem
                            href="/"
                            target="_blank"
                        >
                            Href (blank)
                        </DropdownItem>
                        <DropdownItem>
                            Item 3
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown focusFirstItemOnOpen>
                    <DropdownToggle
                        color="gray"
                        small
                    >
                        Select first on open
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            Item 1
                        </DropdownItem>
                        <DropdownItem>
                            Item 2
                        </DropdownItem>
                        <DropdownItem>
                            Item 3
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownToggle
                        color="gray"
                        small
                    >
                        Nested
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            Item 1
                        </DropdownItem>
                        <DropdownItem>
                            Item 2
                        </DropdownItem>
                        <DropdownItem submenu>
                            <Dropdown>
                                <SubmenuDropdownToggle>
                                    Select first on open
                                </SubmenuDropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>
                                        Item 1
                                    </DropdownItem>
                                    <DropdownItem>
                                        Item 2
                                    </DropdownItem>
                                    <DropdownItem>
                                        Item 3
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown focusFirstItemOnOpen>
                    <DropdownToggle
                        color="link"
                    >
                        <Icon
                            path={mdiMenu}
                            tooltip="Click to toggle menu (focus on first)"
                        />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            Item 1
                        </DropdownItem>
                        <DropdownItem>
                            Item 2
                        </DropdownItem>
                        <DropdownItem>
                            Item 3
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownToggle
                        color="link"
                        renderContent={metadata => (
                            <Icon
                                path={metadata.isOpen ? mdiMenuClose : mdiMenu}
                                tooltip="Click to toggle menu (right)"
                            />
                        )}
                    />
                    <DropdownMenu drop="end">
                        <DropdownItem>
                            Item 1
                        </DropdownItem>
                        <DropdownItem>
                            Item 2
                        </DropdownItem>
                        <DropdownItem>
                            Item 3
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown>
                    <DropdownToggle
                        color="link"
                    >
                        <Icon
                            path={mdiMenu}
                            tooltip="Click to toggle menu (top)"
                            tooltipPlacement="bottom"
                        />
                    </DropdownToggle>
                    <DropdownMenu drop="up">
                        <DropdownItem>
                            Item 1
                        </DropdownItem>
                        <DropdownItem>
                            Item 2
                        </DropdownItem>
                        <DropdownItem>
                            Item 3
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown>
                    <DropdownToggle
                        tag="div"
                        className="clickable"
                    >
                        Inline
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            Item 1
                        </DropdownItem>
                        <DropdownItem>
                            Item 2
                        </DropdownItem>
                        <DropdownItem>
                            Item 3
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <SelectInput
                    label="Select value"
                    value={formValues.select1}
                    options={optionsSeveral}
                    onChange={value => {
                        setFormValue('select1', value)
                    }}
                />
                <SelectInput
                    label="Select scrollable"
                    value={formValues.select2}
                    options={optionsMany}
                    onChange={value => {
                        setFormValue('select2', value)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <SelectInput
                    label="Select with search"
                    value={formValues.select3}
                    options={optionsMany}
                    search
                    onChange={value => {
                        setFormValue('select3', value)
                    }}
                />
                <SelectInput
                    label="Grouped options"
                    value={formValues.select4}
                    options={optionsGrouped}
                    onChange={value => {
                        setFormValue('select4', value)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <SelectInput
                    label="Virtualized options"
                    value={formValues.selectVirtual1}
                    maxHeight={300}
                    enableVirtualization
                    options={optionsMany}
                    onChange={value => {
                        setFormValue('selectVirtual1', value)
                    }}
                />
                <SelectInput
                    label="Virtualized options + search"
                    value={formValues.selectVirtual2}
                    search
                    maxHeight={300}
                    enableVirtualization
                    options={optionsMany}
                    onChange={value => {
                        setFormValue('selectVirtual2', value)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <MultiSelectInput
                    label="Multiselect"
                    values={formValues.multiSelect1}
                    options={optionsSeveral}
                    onChange={values => {
                        setFormValue('multiSelect1', values)
                    }}
                />
                <MultiSelectInput
                    label="Multiselect scrollable"
                    values={formValues.multiSelect2}
                    options={optionsMany}
                    onChange={values => {
                        setFormValue('multiSelect2', values)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <MultiSelectInput
                    label="Multiselect grouped"
                    values={formValues.multiSelect3}
                    options={optionsGrouped}
                    onChange={values => {
                        setFormValue('multiSelect3', values)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <ComboboxInput
                    label="Combobox"
                    value={formValues.combobox1}
                    options={[
                        'Option 1',
                        'Option 2',
                        'Option 3',
                        'Option 4',
                        'Option 5',
                        'Option 1-2',
                    ]}
                    onChange={value => {
                        setFormValue('combobox1', value)
                    }}
                />
                <ComboboxInput
                    label="Combobox scrollable"
                    value={formValues.combobox2}
                    options={[
                        'Option 1',
                        'Option 2',
                        'Option 3',
                        'Option 4',
                        'Option 5',
                        'Option 6',
                        'Option 7',
                        'Option 8',
                        'Option 9',
                        'Option 10',
                        'Option 11',
                        'Option 12',
                        'Option 13',
                        'Option 14',
                        'Option 15',
                    ]}
                    onChange={value => {
                        setFormValue('combobox2', value)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <SelectInput
                    label="Inline select"
                    mode="inline"
                    value={formValues.selectInline1}
                    options={optionsSeveral}
                    onChange={value => {
                        setFormValue('selectInline1', value)
                    }}
                />
                <SelectInput
                    label="Select long value"
                    value={formValues.selectAutoDropdown1}
                    dropdownWidth="fit-items"
                    textNowrapOnOptions
                    options={[
                        {label: 'This is a very long option 1', value: 'option1'},
                        {label: 'Option 2', value: 'option2'},
                        {label: 'Option 3', value: 'option3'},
                        {label: 'Option 4', value: 'option4'},
                    ]}
                    style={{
                        width: 160,
                    }}
                    onChange={value => {
                        setFormValue('selectAutoDropdown1', value)
                    }}
                />
                <SelectInput
                    label="Select long value"
                    value={formValues.selectAutoDropdown1}
                    options={optionsSeveral}
                    style={{
                        width: 160,
                    }}
                    onChange={value => {
                        setFormValue('selectAutoDropdown1', value)
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <SelectInput
                    label="Select disabled"
                    value="option1"
                    disabled
                    options={optionsMany}
                />
                <MultiSelectInput
                    label="Multiselect disabled"
                    values={['option1']}
                    options={optionsSeveral}
                    disabled
                />
                <ComboboxInput
                    label="Combobox disabled"
                    value="Option 1"
                    disabled
                    options={['Option 1']}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <DateInput
                    label="Date input"
                    value={formValues.date1}
                    onChange={value => {
                        setFormValue('date1', value)
                    }}
                />
                <DateInput
                    label="Date range input"
                    value={formValues.dateRange1}
                    onChange={(value1, value2) => {
                        setFormValue('dateRange1', [value1, value2])
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <DateInput
                    label="Date input disabled"
                    disabled
                    value={new Date()}
                />
            </div>
        </div>
    )
}
