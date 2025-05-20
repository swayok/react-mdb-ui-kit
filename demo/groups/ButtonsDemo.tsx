import {mdiAccount} from '@mdi/js'
import React from 'react'
import Button from 'swayok-react-mdb-ui-kit/components/Button'
import ButtonsSwitch from 'swayok-react-mdb-ui-kit/components/ButtonsSwitch'
import Icon from 'swayok-react-mdb-ui-kit/components/Icon'
import ButtonsSwitchInput from 'swayok-react-mdb-ui-kit/components/Input/ButtonsSwitchInput'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import {ButtonColors} from 'swayok-react-mdb-ui-kit/types/Common'

export default function ButtonsDemo() {

    const colors: ButtonColors[] = [
        'gray',
        'green',
        'red',
        'orange',
        'blue',
        'secondary',
        'light',
        'dark',
        'link',
    ]
    return (
        <>
            <div className="d-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3">
                <div>
                    <div className="mb-3">
                        <Button>
                            Button default
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button small>
                            Button default small
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button large>
                            Button default large
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button disabled>
                            Button default disabled
                        </Button>
                    </div>
                </div>
                <div>
                    <div className="mb-3">
                        <Button outline>
                            Button outline
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button small outline>
                            Button outline small
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button large outline>
                            Button outline large
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button disabled outline>
                            Button outline disabled
                        </Button>
                    </div>
                </div>
            </div>
            {colors.map(color => (
                <div
                    key={color}
                    className="d-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3 mb-3"
                >
                    <div>
                        <Button color={color}>
                            Color: {color}
                        </Button>
                    </div>
                    <div>
                        <Button color={color} disabled>
                            Color: {color} disabled
                        </Button>
                    </div>
                    <div>
                        <Button color={color} outline>
                            Outline color: {color}
                        </Button>
                    </div>
                    <div>
                        <Button color={color} outline disabled>
                            Outline color: {color} disabled
                        </Button>
                    </div>
                </div>
            ))}
            <div className="mb-3">
                <Button color="icon">
                    <Icon path={mdiAccount}/>
                    <span className="ms-1">Button color: icon</span>
                </Button>
            </div>
            <div className="mb-3">
                <div className="btn-group">
                    <Button color="green">
                        Button 1
                    </Button>
                    <Button color="blue">
                        Button 2
                    </Button>
                    <Button color="gray">
                        Button 3
                    </Button>
                </div>
            </div>
            <SectionDivider label="Buttons Switch"/>

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
