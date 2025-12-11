import {
    mdiMenu,
    mdiMenuClose,
} from '@mdi/js'
import {Dropdown} from '../../components/Dropdown/Dropdown'
import {DropdownItem} from '../../components/Dropdown/DropdownItem'
import {DropdownMenu} from '../../components/Dropdown/DropdownMenu'
import {DropdownToggle} from '../../components/Dropdown/DropdownToggle'
import {SubmenuDropdownToggle} from '../../components/Dropdown/SubmenuDropdownToggle'
import {
    IconButton,
    IconButtonProps,
} from '../../components/IconButton'
import {DateInput} from '../../components/Input/DateInput'
import {SelectInput} from '../../components/Input/SelectInput/SelectInput'

// Демонстрация выпадающих меню.
export function DropdownsDemo() {

    // todo: add select input / multiselect input / combobox input / date picker
    // todo: add icon menu dropdown / context menu dropdown / data grid pagination filler

    return (
        <div className="d-flex flex-column gap-4">
            <div className="flex-1 d-flex flex-row gap-4">
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
                    <DropdownToggle<IconButtonProps>
                        tag={IconButton}
                        color="gray"
                        path={mdiMenu}
                        tooltip="Click to toggle menu"
                    />
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
                    <DropdownToggle<IconButtonProps>
                        tag={IconButton}
                        color="gray"
                        path={mdiMenu}
                        modifyProps={metadata => ({
                            path: metadata.isOpen ? mdiMenuClose : mdiMenu,
                        })}
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
            </div>
            <div className="flex-1 d-flex flex-row gap-4">
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
        </div>
    )
}
