import {Dropdown} from '../../components/Dropdown/Dropdown'
import {DropdownItem} from '../../components/Dropdown/DropdownItem'
import {DropdownMenu} from '../../components/Dropdown/DropdownMenu'
import {DropdownToggle} from '../../components/Dropdown/DropdownToggle'
import {Dropdown as Dropdown2} from '../../components/DropdownOld/Dropdown'
import {DropdownItem as DropdownItem2} from '../../components/DropdownOld/DropdownItem'
import {DropdownMenu as DropdownMenu2} from '../../components/DropdownOld/DropdownMenu'
import {DropdownToggle as DropdownToggle2} from '../../components/DropdownOld/DropdownToggle'

// Демонстрация выпадающих меню.
export function DropdownsDemo() {

    // todo: add select input / multiselect input / combobox input / date picker
    // todo: add icon menu dropdown / context menu dropdown / data grid pagination filler

    return (
        <div className="d-flex flex-column gap-3">
            <div className="flex-1">
                <Dropdown>
                    <DropdownToggle
                        color="gray"
                        small
                    >
                        Click to show menu
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
            <div className="flex-1">
                <Dropdown2>
                    <DropdownToggle2
                        color="gray"
                        small
                    >
                        Click to show menu
                    </DropdownToggle2>
                    <DropdownMenu2>
                        <DropdownItem2>
                            Item 1
                        </DropdownItem2>
                        <DropdownItem2>
                            Item 2
                        </DropdownItem2>
                        <DropdownItem2>
                            Item 3
                        </DropdownItem2>
                    </DropdownMenu2>
                </Dropdown2>
            </div>
        </div>
    )
}
