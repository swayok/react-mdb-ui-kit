import React from 'react'
import Switch from '../../components/Input/Switch'

export function SwitchesDemo() {

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
