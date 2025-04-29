import React from 'react'
import Card from 'swayok-react-mdb-ui-kit/components/Card/Card'
import CardBody from 'swayok-react-mdb-ui-kit/components/Card/CardBody'
import Checkbox, {CheckboxProps} from 'swayok-react-mdb-ui-kit/components/Input/Checkbox'
import Radio from 'swayok-react-mdb-ui-kit/components/Input/Radio'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'

// Демонстрация полей ввода.
export default function InputsDemo() {

    const inputs = (
        <>
            <SectionDivider label="Checkbox & Radio (normal size)"/>
            {renderCheckboxesAndRadios()}

            <SectionDivider label="Checkbox & Radio (small size)"/>
            {renderCheckboxesAndRadios({small: true})}
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
                label="Checkbox disabled"
                disabled
            />
            <Checkbox
                {...commonProps}
                label="Checkbox disabled checked"
                disabled
                checked
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
        </>
    )
}
