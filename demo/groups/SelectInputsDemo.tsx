import React from 'react'
import MultiSelectInput from '../../components/Input/MultiSelectInput'
import {SelectInput} from '../../components/Input/SelectInput/SelectInput'
import {SectionDivider} from '../../components/SectionDivider'

export function SelectInputsDemo() {

    return (
        <>
            <SectionDivider label="Select with dropdown" />
            <SelectInput
                label="Select normal"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3', disabled: true},
                    {
                        label: 'Group 1',
                        options: [
                            {value: 'group1option1', label: 'Group 1 Option 1'},
                            {value: 'group1option2', label: 'Group 1 Option 2'},
                        ],
                    },
                    {
                        label: 'Group 2',
                        options: [
                            {value: 'group2option1', label: 'Group 2 Option 1'},
                            {value: 'group2option2', label: 'Group 2 Option 2'},
                        ],
                    },
                    {value: 'option4', label: 'Option 4'},
                ]}
                withEmptyOption={{
                    value: '',
                    label: 'Select an option',
                }}
                value=""
                onChange={() => {
                }}
            />

            <SelectInput
                label="Select normal, option selected"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                withEmptyOption={{
                    value: '',
                    label: 'Select an option',
                }}
                value="option2"
                onChange={() => {
                }}
            />
            <SelectInput
                label="Select normal, no empty, no value, drop up"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                value=""
                onChange={() => {
                }}
                drop="up"
            />
            <SelectInput
                label="Select normal, search"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                    {value: 'option4', label: 'Option 4'},
                    {value: 'option5', label: 'Option 5'},
                    {value: 'option6', label: 'Option 6'},
                ]}
                withEmptyOption={{
                    value: '',
                    label: 'Select an option',
                }}
                value=""
                search
                searchPlaceholder="Filter options"
                onChange={() => {
                }}
            />
            <SelectInput
                label="Select disabled"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                value=""
                onChange={() => {
                }}
                disabled
            />
            <SelectInput
                label="Select normal inavlid"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                value=""
                onChange={() => {
                }}
                invalid
                validationMessage="This field is required"
            />
            <MultiSelectInput
                label="Multi-select normal"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                    {value: 'option4', label: 'Option 4'},
                    {value: 'option5', label: 'Option 5'},
                    {value: 'option6', label: 'Option 6'},
                ]}
                values={['option2', 'option4']}
                onChange={() => {
                }}
            />
            <MultiSelectInput
                label="Multi-select normal invalid"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                    {value: 'option4', label: 'Option 4'},
                    {value: 'option5', label: 'Option 5'},
                    {value: 'option6', label: 'Option 6'},
                ]}
                values={['option2', 'option4']}
                onChange={() => {
                }}
                invalid
                validationMessage="This field is required"
            />

            <SectionDivider label="Small" />

            <SelectInput
                label="Select small"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3', disabled: true},
                    {
                        label: 'Group 1',
                        options: [
                            {value: 'group1option1', label: 'Group 1 Option 1'},
                            {value: 'group1option2', label: 'Group 1 Option 2'},
                        ],
                    },
                    {
                        label: 'Group 2',
                        options: [
                            {value: 'group2option1', label: 'Group 2 Option 1'},
                            {value: 'group2option2', label: 'Group 2 Option 2'},
                        ],
                    },
                    {value: 'option4', label: 'Option 4'},
                ]}
                withEmptyOption={{
                    value: '',
                    label: 'Select an option',
                }}
                value=""
                onChange={() => {
                }}
                small
            />

            <SelectInput
                label="Select small, option selected"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                withEmptyOption={{
                    value: '',
                    label: 'Select an option',
                }}
                value="option2"
                onChange={() => {
                }}
                small
            />
            <SelectInput
                label="Select small, no empty, no value, drop up"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                value=""
                onChange={() => {
                }}
                drop="up"
                small
            />
            <SelectInput
                label="Select small, search"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                    {value: 'option4', label: 'Option 4'},
                    {value: 'option5', label: 'Option 5'},
                    {value: 'option6', label: 'Option 6'},
                ]}
                withEmptyOption={{
                    value: '',
                    label: 'Select an option',
                }}
                value=""
                search
                searchPlaceholder="Filter options"
                onChange={() => {
                }}
                small
            />
            <SelectInput
                label="Select small disabled"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                value=""
                onChange={() => {
                }}
                disabled
                small
            />
            <SelectInput
                label="Select small invalid"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                ]}
                value=""
                onChange={() => {
                }}
                small
                invalid
                validationMessage="This field is required"
            />
            <MultiSelectInput
                label="Multi-select small"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                    {value: 'option4', label: 'Option 4'},
                    {value: 'option5', label: 'Option 5'},
                    {value: 'option6', label: 'Option 6'},
                ]}
                values={['option2', 'option4']}
                onChange={() => {
                }}
                small
            />
            <MultiSelectInput
                label="Multi-select small invalid"
                options={[
                    {value: 'option1', label: 'Option 1'},
                    {value: 'option2', label: 'Option 2'},
                    {value: 'option3', label: 'Option 3'},
                    {value: 'option4', label: 'Option 4'},
                    {value: 'option5', label: 'Option 5'},
                    {value: 'option6', label: 'Option 6'},
                ]}
                values={['option2', 'option4']}
                onChange={() => {
                }}
                small
                invalid
                validationMessage="This field is required"
            />
        </>
    )
}
