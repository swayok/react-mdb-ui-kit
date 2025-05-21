import React from 'react'
import ButtonsSwitch from 'swayok-react-mdb-ui-kit/components/ButtonsSwitch'
import ButtonsSwitchInput from 'swayok-react-mdb-ui-kit/components/Input/ButtonsSwitchInput'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'

export default function ButtonsSwitchDemo() {

    return (
        <>
            <ButtonsSwitch
                options={[
                    {value: 'Option 1', label: 'Option 1'},
                    {value: 'Option 2', label: 'Option 2'},
                    {value: 'Option 3', label: 'Option 3'},
                ]}
                value="Option 2"
                className="d-block mb-4"
                small={false}
                onChange={() => {
                }}
            />
            <ButtonsSwitch
                options={[
                    {value: 'Option 1', label: 'Option 1'},
                    {value: 'Option 2', label: 'Option 2'},
                    {value: 'Option 3', label: 'Option 3'},
                ]}
                activeColor="primary"
                value="Option 2"
                className="d-block mb-4"
                onChange={() => {
                }}
            />
            <ButtonsSwitch
                options={[
                    {value: 'Option 1', label: 'Option 1'},
                    {value: 'Option 2', label: 'Option 2'},
                    {value: 'Option 3', label: 'Option 3'},
                ]}
                activeColor="green"
                value="Option 2"
                className="d-block mb-4"
                small={false}
                large={true}
                onChange={() => {
                }}
            />

            <SectionDivider label="Buttons Switch Input"/>

            <ButtonsSwitchInput
                options={[
                    {value: 'Option 1', label: 'Option 1'},
                    {value: 'Option 2', label: 'Option 2'},
                    {value: 'Option 3', label: 'Option 3'},
                ]}
                value="Option 2"
                className="d-block mb-4"
                small={false}
                invalid
                validationMessage="This field is required"
                onChange={() => {
                }}
            />
            <ButtonsSwitchInput
                options={[
                    {value: 'Option 1', label: 'Option 1'},
                    {value: 'Option 2', label: 'Option 2'},
                    {value: 'Option 3', label: 'Option 3'},
                ]}
                activeColor="primary"
                value="Option 2"
                className="d-block mb-4"
                invalid
                validationMessage="This field is required"
                onChange={() => {
                }}
            />
            <ButtonsSwitchInput
                options={[
                    {value: 'Option 1', label: 'Option 1'},
                    {value: 'Option 2', label: 'Option 2'},
                    {value: 'Option 3', label: 'Option 3'},
                ]}
                activeColor="green"
                value="Option 2"
                className="d-block mb-4"
                small={false}
                large={true}
                invalid
                validationMessage="This field is required"
                onChange={() => {
                }}
            />
        </>
    )
}
