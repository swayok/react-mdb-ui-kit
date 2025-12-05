import {ButtonsSwitch} from '../../components/ButtonsSwitch'
import {ButtonsSwitchInput} from '../../components/Input/ButtonsSwitchInput'
import {SectionDivider} from '../../components/SectionDivider'

export function ButtonsSwitchDemo() {

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

            <SectionDivider label="Buttons Switch Input" />

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
