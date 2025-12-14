import {
    mdiMenu,
    mdiMenuClose,
} from '@mdi/js'
import {Dropdown} from '../../components/Dropdown/Dropdown'
import {DropdownItem} from '../../components/Dropdown/DropdownItem'
import {DropdownMenu} from '../../components/Dropdown/DropdownMenu'
import {DropdownToggle} from '../../components/Dropdown/DropdownToggle'
import {SubmenuDropdownToggle} from '../../components/Dropdown/SubmenuDropdownToggle'
import {Icon} from '../../components/Icon'
import {ComboboxInput} from '../../components/Input/ComboboxInput'
import {DateInput} from '../../components/Input/DateInput'
import {MultiSelectInput} from '../../components/Input/SelectInput/MultiSelectInput'
import {SelectInput} from '../../components/Input/SelectInput/SelectInput'
import {useFormValues} from '../../helpers/useFormValues'

// Демонстрация выпадающих меню.
export function DropdownsDemo() {

    // todo: data grid pagination filler

    const {
        formValues,
        setFormValue,
    } = useFormValues<{
        select1: string
        date1: Date | null
        dateRange1: [Date | null, Date | null]
        multiSelect1: string[]
        combobox1: string
    }>({
        select1: 'option1',
        date1: null,
        dateRange1: [null, null],
        multiSelect1: [],
        combobox1: '',
    })

    return (
        <div className="d-flex flex-column gap-4">
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <Dropdown>
                    <DropdownToggle
                        color="gray"
                        small
                    >
                        Menu
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
                            tooltip="Click to toggle menu"
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

                <Dropdown focusFirstItemOnOpen>
                    <DropdownToggle
                        color="link"
                        renderContent={metadata => (
                            <Icon
                                path={metadata.isOpen ? mdiMenuClose : mdiMenu}
                                tooltip="Click to toggle menu"
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
                        tag="div"
                        className="clickable"
                    >
                        Inline toggler
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
                    options={[
                        {label: 'Option 1', value: 'option1'},
                        {label: 'Option 2', value: 'option2'},
                        {label: 'Option 3', value: 'option3'},
                        {label: 'Option 4', value: 'option4'},
                    ]}
                    onChange={value => {
                        setFormValue('select1', value)
                    }}
                />
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
                <MultiSelectInput
                    label="Select values"
                    values={formValues.multiSelect1}
                    options={[
                        {label: 'Option 1', value: 'option1'},
                        {label: 'Option 2', value: 'option2'},
                        {label: 'Option 3', value: 'option3'},
                        {label: 'Option 4', value: 'option4'},
                        {label: 'Option 5', value: 'option5'},
                    ]}
                    onChange={values => {
                        setFormValue('multiSelect1', values)
                    }}
                />
                <ComboboxInput
                    label="Typeahead search"
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
            </div>
        </div>
    )
}
