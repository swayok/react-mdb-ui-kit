import React from 'react'
import Checkbox, {CheckboxProps} from '../../components/Input/Checkbox'
import CheckboxesGroup from '../../components/Input/CheckboxesGroup'
import Radio from '../../components/Input/Radio'
import SectionDivider from '../../components/SectionDivider'

export default function CheckboxesAndRadiosDemo(props: Partial<CheckboxProps>) {

    return (
        <>
            <Checkbox
                {...props}
                label="Checkbox normal"
            />
            <Checkbox
                {...props}
                label="Checkbox checked"
                checked
            />
            <Checkbox
                {...props}
                label="Checkbox checked solid"
                checked
                solid
            />
            <Checkbox
                {...props}
                label="Checkbox disabled"
                disabled
            />
            <Checkbox
                {...props}
                label="Checkbox disabled checked"
                disabled
                checked
            />
            <Checkbox
                {...props}
                label="Checkbox disabled checked solid"
                disabled
                checked
                solid
            />
            <Checkbox {...props}/>
            <Checkbox
                {...props}
                label="Checkbox with very very very very very very very very very very very very very very very very very very very long label"
            />
            <Checkbox
                {...props}
                label="Checkbox invalid"
                invalid
                validationMessage="Error message"
            />
            <Checkbox
                {...props}
                label="Checkbox invalid"
                labelBeforeInput
                invalid
                validationMessage="Error message"
            />
            <Radio
                {...props}
                label="Radio 1"
                checked={false}
            />
            <Radio
                {...props}
                label="Radio 2"
                checked
            />
            <Radio
                {...props}
                label="Radio disabled"
                disabled
            />
            <Radio
                {...props}
                label="Radio disabled checked"
                disabled
                checked
            />
            <Radio {...props}/>
            <Radio
                {...props}
                label="Radio with very very very very very very very very very very very very very very very very very very very long label"
            />
            <Radio
                {...props}
                label="Radio invalid"
                invalid
                validationMessage="Error message"
            />
            <Radio
                {...props}
                label="Radio invalid"
                labelBeforeInput
                invalid
                validationMessage="Error message"
            />

            <Checkbox
                {...props}
                label="Checkbox & Radio comparison"
                wrapperClass="mb-1"
            />
            <Radio
                {...props}
                label="Checkbox & Radio comparison"
            />

            <Checkbox
                {...props}
                label="Checkbox & Radio comparison"
                wrapperClass="mb-1"
                labelBeforeInput
            />
            <Radio
                {...props}
                label="Checkbox & Radio comparison"
                labelBeforeInput
            />

            <SectionDivider label="Checkboxes group"/>

            <CheckboxesGroup
                label="Input label"
                columns={2}
                options={[
                    {
                        label: 'Group 1',
                        options: [
                            {label: 'Option 1', value: 'option1'},
                            {label: 'Option 2', value: 'option2'},
                            {label: 'Option 3', value: 'option3'},
                            {label: 'Option 4', value: 'option4', disabled: true},
                            {label: 'Option 5', value: 'option5'},
                        ],
                    },
                    {
                        label: 'Group 2',
                        options: [
                            {label: 'Option 6', value: 'option6'},
                            {label: 'Option 7', value: 'option7'},
                            {label: 'Option 8', value: 'option8'},
                            {label: 'Option 9', value: 'option9', disabled: true},
                            {label: 'Option 0', value: 'option0'},
                        ],
                    },
                ]}
                values={['option1', 'option3']}
            />

            <SectionDivider label="Colors"/>

            <div className="d-grid grid-columns-3">
                <Checkbox
                    {...props}
                    label="Checkbox red"
                    checked={false}
                    color="red"
                />
                <Checkbox
                    {...props}
                    label="Checkbox red"
                    checked
                    color="red"
                />
                <Checkbox
                    {...props}
                    label="Red solid"
                    checked
                    color="red"
                    solid
                />
                <Checkbox
                    {...props}
                    label="Checkbox green"
                    checked={false}
                    color="green"
                />
                <Checkbox
                    {...props}
                    label="Checkbox green"
                    checked
                    color="green"
                />
                <Checkbox
                    {...props}
                    label="Green solid"
                    checked
                    color="green"
                    solid
                />
                <Checkbox
                    {...props}
                    label="Checkbox blue"
                    checked={false}
                    color="blue"
                />
                <Checkbox
                    {...props}
                    label="Checkbox blue"
                    checked
                    color="blue"
                />
                <Checkbox
                    {...props}
                    label="Blue solid"
                    checked
                    color="blue"
                    solid
                />
                <Checkbox
                    {...props}
                    label="Checkbox orange"
                    checked={false}
                    color="orange"
                />
                <Checkbox
                    {...props}
                    label="Checkbox orange"
                    checked
                    color="orange"
                />
                <Checkbox
                    {...props}
                    label="Orange solid"
                    checked
                    color="orange"
                    solid
                />
                <Radio
                    {...props}
                    label="Radio red"
                    checked={false}
                    color="red"
                />
                <Radio
                    {...props}
                    label="Radio red"
                    checked
                    color="red"
                />
                <div/>
                <Radio
                    {...props}
                    label="Radio green"
                    checked={false}
                    color="green"
                />
                <Radio
                    {...props}
                    label="Radio green"
                    checked
                    color="green"
                />
                <div/>
                <Radio
                    {...props}
                    label="Radio blue"
                    checked={false}
                    color="blue"
                />
                <Radio
                    {...props}
                    label="Radio blue"
                    checked
                    color="blue"
                />
                <div/>
                <Radio
                    {...props}
                    label="Radio orange"
                    checked={false}
                    color="orange"
                />
                <Radio
                    {...props}
                    label="Radio orange"
                    checked
                    color="orange"
                />
                <div/>
            </div>
        </>
    )
}
