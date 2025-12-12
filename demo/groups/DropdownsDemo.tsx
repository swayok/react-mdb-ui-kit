import {
    mdiMenu,
    mdiMenuClose,
} from '@mdi/js'
import {Dropdown} from '../../components/Dropdown/Dropdown'
import {DropdownItem} from '../../components/Dropdown/DropdownItem'
import {DropdownMenu} from '../../components/Dropdown/DropdownMenu'
import {DropdownToggle} from '../../components/Dropdown/DropdownToggle'
import {SubmenuDropdownToggle} from '../../components/Dropdown/SubmenuDropdownToggle'
import Icon from '../../components/Icon'
import {ComboboxInput} from '../../components/Input/ComboboxInput'
import {DateInput} from '../../components/Input/DateInput'
import {MultiSelectInput} from '../../components/Input/SelectInput/MultiSelectInput'
import {SelectInput} from '../../components/Input/SelectInput/SelectInput'

// Демонстрация выпадающих меню.
export function DropdownsDemo() {

    // todo: data grid pagination filler

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
                    options={[
                        {label: 'Option 1', value: 'option1'},
                        {label: 'Option 2', value: 'option2'},
                        {label: 'Option 3', value: 'option3'},
                        {label: 'Option 4', value: 'option4'},
                    ]}
                    onChange={() => {
                    }}
                />
                <DateInput
                    label="Date input"
                    value={new Date()}
                    onChange={() => {
                    }}
                />
                <DateInput
                    label="Date range input"
                    value={[null, null]}
                    onChange={() => {
                    }}
                />
            </div>
            <div className="flex-1 d-flex flex-row align-items-center gap-4">
                <MultiSelectInput
                    label="Select values"
                    options={[
                        {label: 'Option 1', value: 'option1'},
                        {label: 'Option 2', value: 'option2'},
                        {label: 'Option 3', value: 'option3'},
                        {label: 'Option 4', value: 'option4'},
                        {label: 'Option 5', value: 'option5'},
                    ]}
                    onChange={() => {
                    }}
                />
                <ComboboxInput
                    label="Typeahead search"
                    options={[
                        {label: 'Option 1', value: 'option1'},
                        {label: 'Option 2', value: 'option2'},
                        {label: 'Option 3', value: 'option3'},
                        {label: 'Option 4', value: 'option4'},
                        {label: 'Option 5', value: 'option5'},
                    ]}
                    onChange={() => {
                    }}
                />
            </div>
        </div>
    )
}
