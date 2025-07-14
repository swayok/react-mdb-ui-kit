import React from 'react'
import Button from 'swayok-react-mdb-ui-kit/components/Button'
import Input from 'swayok-react-mdb-ui-kit/components/Input/Input'
import SelectInput from 'swayok-react-mdb-ui-kit/components/Input/SelectInput/SelectInput'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import useFormValues from 'swayok-react-mdb-ui-kit/helpers/useFormValues'

// Демонстрация inline форм.
export function FormInlineDemo() {

    const {
        formValues,
        setFormValue,
    } = useFormValues({
        value1: '',
        value2: 'value1',
    })

    return (
        <div>
            <SectionDivider label="Normal" margins="none" className="mb-4"/>
            <div className="form-inline mb-4">
                <Input
                    label="Input 1"
                    value={formValues.value1}
                    onChange={event => setFormValue('value1', event.currentTarget.value)}
                    wrapperClass="m-0"
                />
                <SelectInput
                    label="Select"
                    value={formValues.value2}
                    options={[
                        {label: 'Value 1', value: 'value1'},
                        {label: 'Value 2', value: 'value2'},
                        {label: 'Value 3', value: 'value3'},
                    ]}
                    onChange={value => setFormValue('value2', value)}
                    wrapperClass="m-0"
                />
                <Button
                    color="green"
                >
                    Button
                </Button>
            </div>
            <div className="form-inline mb-4">
                <Input
                    label="Input 1"
                    value={formValues.value1}
                    onChange={event => setFormValue('value1', event.currentTarget.value)}
                    invalid={true}
                    validationMessage="Invalid value with long long long long long text"
                    wrapperClass="m-0"
                />
                <SelectInput
                    label="Select"
                    value={formValues.value2}
                    options={[
                        {label: 'Value 1', value: 'value1'},
                        {label: 'Value 2', value: 'value2'},
                        {label: 'Value 3', value: 'value3'},
                    ]}
                    onChange={value => setFormValue('value2', value)}
                    wrapperClass="m-0"
                />
                <Button
                    color="green"
                >
                    Button
                </Button>
            </div>

            <SectionDivider label="Small"/>
            <div className="form-inline mb-4">
                <Input
                    label="Input 1"
                    value={formValues.value1}
                    small
                    onChange={event => setFormValue('value1', event.currentTarget.value)}
                    wrapperClass="m-0"
                />
                <SelectInput
                    label="Select"
                    value={formValues.value2}
                    small
                    options={[
                        {label: 'Value 1', value: 'value1'},
                        {label: 'Value 2', value: 'value2'},
                        {label: 'Value 3', value: 'value3'},
                    ]}
                    onChange={value => setFormValue('value2', value)}
                    wrapperClass="m-0"
                />
                <Button
                    color="green"
                    small
                >
                    Button
                </Button>
            </div>
            <div className="form-inline mb-4">
                <Input
                    label="Input 1"
                    value={formValues.value1}
                    onChange={event => setFormValue('value1', event.currentTarget.value)}
                    invalid={true}
                    small
                    validationMessage="Invalid value with long long long long long text"
                    wrapperClass="m-0"
                />
                <SelectInput
                    label="Select"
                    value={formValues.value2}
                    small
                    options={[
                        {label: 'Value 1', value: 'value1'},
                        {label: 'Value 2', value: 'value2'},
                        {label: 'Value 3', value: 'value3'},
                    ]}
                    onChange={value => setFormValue('value2', value)}
                    wrapperClass="m-0"
                />
                <Button
                    color="green"
                    small
                >
                    Button
                </Button>
            </div>

            <SectionDivider label="Large"/>
            <div className="form-inline mb-4">
                <Input
                    label="Input 1"
                    value={formValues.value1}
                    large
                    onChange={event => setFormValue('value1', event.currentTarget.value)}
                    wrapperClass="m-0"
                />
                <SelectInput
                    label="Select"
                    value={formValues.value2}
                    large
                    options={[
                        {label: 'Value 1', value: 'value1'},
                        {label: 'Value 2', value: 'value2'},
                        {label: 'Value 3', value: 'value3'},
                    ]}
                    onChange={value => setFormValue('value2', value)}
                    wrapperClass="m-0"
                />
                <Button
                    color="green"
                    large
                >
                    Button
                </Button>
            </div>
            <div className="form-inline mb-4">
                <Input
                    label="Input 1"
                    value={formValues.value1}
                    onChange={event => setFormValue('value1', event.currentTarget.value)}
                    invalid={true}
                    large
                    validationMessage="Invalid value with long long long long long text"
                    wrapperClass="m-0"
                />
                <SelectInput
                    label="Select"
                    value={formValues.value2}
                    large
                    options={[
                        {label: 'Value 1', value: 'value1'},
                        {label: 'Value 2', value: 'value2'},
                        {label: 'Value 3', value: 'value3'},
                    ]}
                    onChange={value => setFormValue('value2', value)}
                    wrapperClass="m-0"
                />
                <Button
                    color="green"
                    large
                >
                    Button
                </Button>
            </div>
        </div>
    )
}
