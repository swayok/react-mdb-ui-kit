import React from 'react'
import DateInput from 'swayok-react-mdb-ui-kit/components/Input/DateInput'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'

export default function DateInputsDemo() {

    return (
        <>
            <DateInput
                label="Date input normal"
                value={null}
                onChange={() => {
                }}
            />
            <DateInput
                label="Date input normal with value"
                value={new Date()}
                onChange={() => {
                }}
            />
            <DateInput
                label="Date input dropup"
                value={null}
                onChange={() => {
                }}
                drop="up"
            />
            <DateInput
                label="Date input disabled"
                value={new Date()}
                onChange={() => {
                }}
                disabled
            />
            <DateInput
                label="Date input invalid"
                value={new Date()}
                onChange={() => {
                }}
                invalid
                validationMessage="This field is required"
            />

            <SectionDivider label="Small"/>

            <DateInput
                label="Date input small"
                value={null}
                onChange={() => {
                }}
                small
            />
            <DateInput
                label="Date input small with value"
                value={new Date()}
                onChange={() => {
                }}
                small
            />
            <DateInput
                label="Date input small disabled"
                value={new Date()}
                onChange={() => {
                }}
                disabled
                small
            />
            <DateInput
                label="Date input small invalid"
                value={new Date()}
                onChange={() => {
                }}
                invalid
                validationMessage="This field is required"
                small
            />
        </>
    )
}
