import {DateInput} from '../../components/Input/DateInput'
import {SectionDivider} from '../../components/Typography/SectionDivider'

export function DateInputsDemo() {

    const today = new Date()
    const range: [Date, Date] = [new Date(), new Date()]
    range[0].setDate(1)
    range[1].setDate(12)

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
                value={today}
                onChange={() => {
                }}
            />
            <DateInput
                label="Date input normal with range"
                value={range}
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
                value={today}
                onChange={() => {
                }}
                disabled
            />
            <DateInput
                label="Date input invalid"
                value={today}
                onChange={() => {
                }}
                invalid
                validationMessage="This field is required"
            />

            <SectionDivider label="Small" />

            <DateInput
                label="Date input small"
                value={null}
                onChange={() => {
                }}
                small
            />
            <DateInput
                label="Date input small with value"
                value={today}
                onChange={() => {
                }}
                small
            />
            <DateInput
                label="Date input small disabled"
                value={today}
                onChange={() => {
                }}
                disabled
                small
            />
            <DateInput
                label="Date input small invalid"
                value={today}
                onChange={() => {
                }}
                invalid
                validationMessage="This field is required"
                small
            />
        </>
    )
}
