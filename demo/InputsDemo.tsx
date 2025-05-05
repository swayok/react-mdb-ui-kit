import React from 'react'
import Button from 'swayok-react-mdb-ui-kit/components/Button'
import Card from 'swayok-react-mdb-ui-kit/components/Card/Card'
import CardBody from 'swayok-react-mdb-ui-kit/components/Card/CardBody'
import Checkbox, {CheckboxProps} from 'swayok-react-mdb-ui-kit/components/Input/Checkbox'
import Input from 'swayok-react-mdb-ui-kit/components/Input/Input'
import InputGroup from 'swayok-react-mdb-ui-kit/components/Input/InputGroup'
import Radio from 'swayok-react-mdb-ui-kit/components/Input/Radio'
import Switch from 'swayok-react-mdb-ui-kit/components/Input/Switch'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import TabSheet from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheet'
import TabSheetBody from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetBody'
import TabSheetHeader from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetHeader'
import TabSheetTabButton from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabButton'
import TabSheetTabContent from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabContent'

// Демонстрация полей ввода.
export default function InputsDemo() {

    return (
        <div className="container">
            <h2 className="text-center text-theme mb-4">Inputs</h2>

            <TabSheet
                defaultTab="tab1"
                tag="div"
                savesStateToUrlQuery
            >
                <TabSheetHeader>
                    <TabSheetTabButton name="checkboxes">
                        Checkbox & Radio
                    </TabSheetTabButton>
                    <TabSheetTabButton name="switches">
                        Switch
                    </TabSheetTabButton>
                    <TabSheetTabButton name="text">
                        Text
                    </TabSheetTabButton>
                </TabSheetHeader>
                <TabSheetBody>
                    <TabContent name="checkboxes">
                        <SectionDivider label="Checkbox & Radio (normal size)"/>
                        {renderCheckboxesAndRadios()}

                        <SectionDivider label="Checkbox & Radio (small size)"/>
                        {renderCheckboxesAndRadios({small: true})}
                    </TabContent>

                    <TabContent name="switches">
                        {renderSwitches()}
                    </TabContent>
                </TabSheetBody>
                <TabSheetBody>
                    <TabContent name="text">
                        <SectionDivider label="Text inputs (simple)"/>
                        {renderSimpleTextInputs()}
                        <SectionDivider label="Text inputs (material design)"/>
                        {renderTextInputs()}
                    </TabContent>
                </TabSheetBody>
            </TabSheet>
        </div>
    )
}

function TabContent(
    props: {
        name: string,
        children: React.ReactNode | React.ReactNode[]
    }
) {
    return (
        <TabSheetTabContent
            name={props.name}
            lazy
        >
            <div className="row">
                <div className="col-6">
                    <Card>
                        <CardBody>
                            {props.children}
                        </CardBody>
                    </Card>
                </div>
                <div className="col-6 pt-4">
                    {props.children}
                </div>
            </div>
        </TabSheetTabContent>
    )
}

function renderCheckboxesAndRadios(commonProps?: Partial<CheckboxProps>) {
    return (
        <>
            <Checkbox
                {...commonProps}
                label="Checkbox normal"
            />
            <Checkbox
                {...commonProps}
                label="Checkbox checked"
                checked
            />
            <Checkbox
                {...commonProps}
                label="Checkbox checked solid"
                checked
                solid
            />
            <Checkbox
                {...commonProps}
                label="Checkbox disabled"
                disabled
            />
            <Checkbox
                {...commonProps}
                label="Checkbox disabled checked"
                disabled
                checked
            />
            <Checkbox
                {...commonProps}
                label="Checkbox disabled checked solid"
                disabled
                checked
                solid
            />
            <Checkbox {...commonProps}/>
            <Checkbox
                {...commonProps}
                label="Checkbox with very very very very very very very very very very very very very very very very very very very long label"
            />
            <Checkbox
                {...commonProps}
                label="Checkbox invalid"
                invalid
                validationMessage="Error message"
            />
            <Checkbox
                {...commonProps}
                label="Checkbox invalid"
                labelBeforeInput
                invalid
                validationMessage="Error message"
            />
            <Radio
                {...commonProps}
                label="Radio 1"
                checked={false}
            />
            <Radio
                {...commonProps}
                label="Radio 2"
                checked
            />
            <Radio
                {...commonProps}
                label="Radio disabled"
                disabled
            />
            <Radio
                {...commonProps}
                label="Radio disabled checked"
                disabled
                checked
            />
            <Radio {...commonProps}/>
            <Radio
                {...commonProps}
                label="Radio with very very very very very very very very very very very very very very very very very very very long label"
            />
            <Radio
                {...commonProps}
                label="Radio invalid"
                invalid
                validationMessage="Error message"
            />
            <Radio
                {...commonProps}
                label="Radio invalid"
                labelBeforeInput
                invalid
                validationMessage="Error message"
            />

            <Checkbox
                {...commonProps}
                label="Checkbox & Radio comparison"
                wrapperClass="mb-1"
            />
            <Radio
                {...commonProps}
                label="Checkbox & Radio comparison"
            />

            <Checkbox
                {...commonProps}
                label="Checkbox & Radio comparison"
                wrapperClass="mb-1"
                labelBeforeInput
            />
            <Radio
                {...commonProps}
                label="Checkbox & Radio comparison"
                labelBeforeInput
            />

            <div className="d-grid grid-columns-3">
                <Checkbox
                    {...commonProps}
                    label="Checkbox red"
                    checked={false}
                    color="red"
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox red"
                    checked
                    color="red"
                />
                <Checkbox
                    {...commonProps}
                    label="Red solid"
                    checked
                    color="red"
                    solid
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox green"
                    checked={false}
                    color="green"
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox green"
                    checked
                    color="green"
                />
                <Checkbox
                    {...commonProps}
                    label="Green solid"
                    checked
                    color="green"
                    solid
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox blue"
                    checked={false}
                    color="blue"
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox blue"
                    checked
                    color="blue"
                />
                <Checkbox
                    {...commonProps}
                    label="Blue solid"
                    checked
                    color="blue"
                    solid
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox orange"
                    checked={false}
                    color="orange"
                />
                <Checkbox
                    {...commonProps}
                    label="Checkbox orange"
                    checked
                    color="orange"
                />
                <Checkbox
                    {...commonProps}
                    label="Orange solid"
                    checked
                    color="orange"
                    solid
                />
                <Radio
                    {...commonProps}
                    label="Radio red"
                    checked={false}
                    color="red"
                />
                <Radio
                    {...commonProps}
                    label="Radio red"
                    checked
                    color="red"
                />
                <div/>
                <Radio
                    {...commonProps}
                    label="Radio green"
                    checked={false}
                    color="green"
                />
                <Radio
                    {...commonProps}
                    label="Radio green"
                    checked
                    color="green"
                />
                <div/>
                <Radio
                    {...commonProps}
                    label="Radio blue"
                    checked={false}
                    color="blue"
                />
                <Radio
                    {...commonProps}
                    label="Radio blue"
                    checked
                    color="blue"
                />
                <div/>
                <Radio
                    {...commonProps}
                    label="Radio orange"
                    checked={false}
                    color="orange"
                />
                <Radio
                    {...commonProps}
                    label="Radio orange"
                    checked
                    color="orange"
                />
                <div/>
            </div>
        </>
    )
}

function renderSwitches() {
    return (
        <>
            <Switch
                label="Switch normal"
                checked={false}
            />
            <Switch
                label="Switch checked"
                checked
            />
            <Switch
                label="Switch disabled"
                checked={false}
                disabled
            />
            <Switch
                label="Switch checked disabled"
                checked
                disabled
            />
            <Switch/>
            <Switch
                label="Switch with very very very very very very very very very very very very very very very very very very very long label"
            />
            <Switch
                label="Switch checked disabled"
                invalid={true}
                validationMessage="Error message"
            />
            <Switch
                label="Switch label before input"
                labelBeforeInput
            />
            <Switch
                label="Switch invalid"
                labelBeforeInput
                invalid={true}
                validationMessage="Error message"
            />

            <Switch
                label="Switch red"
                checked
                color="red"
            />
            <Switch
                label="Switch green"
                checked
                color="green"
            />
            <Switch
                label="Switch blue"
                checked
                color="blue"
            />
            <Switch
                label="Switch orange"
                checked
                color="orange"
            />
        </>
    )
}

function renderSimpleTextInputs() {
    return (
        <>
            <div>
                <label className="form-label">Input normal</label>
                <input
                    className="form-control mb-4"
                    placeholder="Placeholder"
                />
            </div>
            <div>
                <label className="form-label">Input readonly</label>
                <input
                    className="form-control mb-4"
                    readOnly
                    value="Read only"
                />
            </div>
            <div>
                <label className="form-label">Input disabled</label>
                <input
                    className="form-control mb-4"
                    disabled
                    value="Disabled"
                />
            </div>

            <div>
                <label className="form-label">Input small</label>
                <input
                    className="form-control form-control-sm mb-4"
                    placeholder="Placeholder"
                />
            </div>
            <div>
                <label className="form-label">Input large</label>
                <input
                    className="form-control form-control-lg mb-4"
                    placeholder="Placeholder"
                />
            </div>
        </>
    )
}

function renderTextInputs() {
    return (
        <>
            <Input
                label="Input normal"
            />

            <Input
                label="Input active label"
                active
            />

            <Input
                placeholder="Input no label"
                active
            />

            <Input
                label="Input with placeholder"
                active
                placeholder="Placeholder"
            />

            <Input
                label="Input with value"
                value="Value"
            />

            <Input
                label="Input readonly"
                value="Value"
                readOnly
            />

            <Input
                label="Input disabled"
                value="Value"
                disabled
            />

            <Input
                label="Input invalid"
                value="Value"
                invalid
            />

            <Input
                label="Input invalid with message"
                value="Value"
                invalid
                validationMessage="Validation error"
            />

            <Input
                label="Input small"
                small
            />
            <Input
                label="Input small"
                value="Value"
                small
            />
            <Input
                label="Input large"
                large
            />
            <Input
                label="Input large"
                value="Value"
                large
            />
            <InputGroup>
                <Input
                    label="Input normal"
                />
                <Button color="blue">Action</Button>
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input small"
                    small
                />
                <Button color="blue" small>Action</Button>
            </InputGroup>
            <div className="d-flex flex-row align-items-center justify-content-start gap-3 mb-4">
                <Input
                    label="Input normal"
                    wrapperClass="m-0"
                />
                <Button color="blue">Action</Button>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start gap-3 mb-4">
                <Input
                    label="Input small"
                    small
                    wrapperClass="m-0"
                />
                <Button color="blue" small>Action</Button>
            </div>
        </>
    )
}
