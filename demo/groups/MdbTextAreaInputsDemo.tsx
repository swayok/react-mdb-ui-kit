import React from 'react'
import Input from '../../components/Input/Input'
import InputInfo from '../../components/Input/InputInfo'

export function MdbTextAreaInputsDemo() {

    return (
        <>
            <Input
                textarea
                label="Input normal"
            />

            <Input
                textarea
                label="Input active label"
                active
            />

            <Input
                textarea
                placeholder="Input no label"
                active
            />

            <Input
                textarea
                label="Input with placeholder"
                active
                placeholder="Placeholder"
            />

            <Input
                textarea
                label="Input with value"
                value="Value"
            />

            <Input
                textarea
                label="Input readonly"
                value="Value"
                readOnly
            />

            <Input
                textarea
                label="Input disabled"
                value="Value"
                disabled
            />

            <Input
                textarea
                label="Input invalid"
                value="Value"
                invalid
            />

            <Input
                textarea
                label="Input invalid with message"
                value="Value"
                invalid
                validationMessage="Validation error"
            />

            <Input
                textarea
                label="Input small"
                small
            />
            <Input
                textarea
                label="Input small"
                value="Value"
                small
            />
            <Input
                textarea
                label="Input large"
                large
            />
            <Input
                textarea
                label="Input large"
                value="Value"
                large
            />
            <Input
                textarea
                label="Input with info"
                value="Value"
            />
            <InputInfo>
                Additional information
            </InputInfo>

            <Input
                textarea
                label="Input invalid with info"
                value="Value"
                invalid
                validationMessage="Validation error"
            />
            <InputInfo>
                Additional information
            </InputInfo>
        </>
    )
}
