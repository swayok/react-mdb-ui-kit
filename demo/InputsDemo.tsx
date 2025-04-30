import React from 'react'
import Card from 'swayok-react-mdb-ui-kit/components/Card/Card'
import CardBody from 'swayok-react-mdb-ui-kit/components/Card/CardBody'
import Checkbox, {CheckboxProps} from 'swayok-react-mdb-ui-kit/components/Input/Checkbox'
import Radio from 'swayok-react-mdb-ui-kit/components/Input/Radio'
import Switch from 'swayok-react-mdb-ui-kit/components/Input/Switch'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'

// Демонстрация полей ввода.
export default function InputsDemo() {

    const inputs = (
        <>
            <SectionDivider label="Checkbox & Radio (normal size)"/>
            {renderCheckboxesAndRadios()}

            <SectionDivider label="Checkbox & Radio (small size)"/>
            {renderCheckboxesAndRadios({small: true})}

            <SectionDivider label="Switch (normal size)"/>
            {renderSwitches()}
        </>
    )

    return (
        <div className="container">
            <h2 className="text-center text-theme mb-4">Inputs</h2>

            <div className="row">
                <div className="col-6">
                    <Card>
                        <CardBody>
                            {inputs}
                        </CardBody>
                    </Card>
                </div>
                <div className="col-6 pt-4">
                    {inputs}
                </div>
            </div>
        </div>
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
