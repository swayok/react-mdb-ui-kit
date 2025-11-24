import {mdiAccount, mdiTranslate} from '@mdi/js'
import React from 'react'
import Button from '../../components/Button'
import Icon from '../../components/Icon'
import Input from '../../components/Input/Input'
import InputAddonIcon from '../../components/Input/InputAddonIcon'
import InputAddonText from '../../components/Input/InputAddonText'
import InputGroup from '../../components/Input/InputGroup'
import InputGroupText from '../../components/Input/InputGroupText'
import InputInfo from '../../components/Input/InputInfo'
import PasswordInput from '../../components/Input/PasswordInput'
import SectionDivider from '../../components/SectionDivider'

export default function MdbTextInputsDemo() {

    return (
        <>
            <Input
                label="Input normal"
            />

            <Input
                label="Input active label"
                active
            />

            <Input
                placeholder="Input no label"
                active
            />

            <Input
                label="Input with placeholder"
                active
                placeholder="Placeholder"
            />

            <Input
                label="Input with value"
                value="Value"
            />

            <Input
                label="Input readonly"
                value="Value"
                readOnly
            />

            <Input
                label="Input disabled"
                value="Value"
                disabled
            />

            <Input
                label="Input invalid"
                value="Value"
                invalid
            />

            <Input
                label="Input invalid with message"
                value="Value"
                invalid
                validationMessage="Validation error"
            />

            <Input
                label="Input small"
                small
            />
            <Input
                label="Input small"
                value="Value"
                small
            />
            <Input
                label="Input large"
                large
            />
            <Input
                label="Input large"
                value="Value"
                large
            />

            <SectionDivider label="Password"/>

            <PasswordInput
                label="Password input normal"
            />

            <PasswordInput
                label="Password input with value"
                value="123456"
            />

            <PasswordInput
                label="Password input with unmask"
                value="123456"
                withUnmaskToggler
            />

            <SectionDivider label="Inputs with addon"/>

            <Input
                label="Input with addon"
            >
                <InputAddonText>Addon</InputAddonText>
            </Input>
            <Input
                label="Input with addon"
            >
                <InputAddonIcon path={mdiAccount}/>
            </Input>

            <SectionDivider label="Grouped inputs"/>

            <InputGroup>
                <Input
                    label="Input normal"
                />
                <Button color="blue">Action</Button>
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input normal"
                />
                <InputGroupText>Text</InputGroupText>
            </InputGroup>
            <InputGroup>
                <InputGroupText>Text</InputGroupText>
                <Input
                    label="Input normal"
                />
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input normal in group alone"
                />
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input normal"
                />
                <Button color="blue">Action</Button>
            </InputGroup>
            <InputGroup>
                <InputGroupText>Text</InputGroupText>
                <Input
                    label="Input normal"
                />
                <Button color="blue">Action</Button>
            </InputGroup>
            <InputGroup>
                <InputGroupText>Text</InputGroupText>
                <Input
                    label="Input grouped normal"
                    invalid
                    validationMessage="Validation error"
                    wrapperClass="m-0"
                />
                <Button color="blue">Action</Button>
            </InputGroup>
            <InputGroup>
                <InputGroupText>Text</InputGroupText>
                <Input
                    label="Input grouped normal"
                    invalid
                    grouped="center"
                    validationMessage="Validation error"
                    wrapperClass="m-0"
                />
                <Button color="blue">Action</Button>
            </InputGroup>
            <InputGroup>
                <Button color="blue" small>Action</Button>
                <Input
                    label="Input grouped small"
                    small
                />
                <InputGroupText small>Text</InputGroupText>
            </InputGroup>
            <InputGroup>
                <InputGroupText small>Text</InputGroupText>
                <Input
                    label="Input grouped small"
                    small
                />
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input grouped small"
                    small
                />
                <InputGroupText small>Text</InputGroupText>
            </InputGroup>
            <InputGroup>
                <Button color="blue" small>Action</Button>
                <Input
                    label="Input small"
                    small
                />
                <InputGroupText small>Text</InputGroupText>
            </InputGroup>
            <InputGroup>
                <InputGroupText small>Text</InputGroupText>
                <Input
                    label="Input small"
                    small
                />
                <Button color="blue" small>Action</Button>
            </InputGroup>
            <InputGroup>
                <InputGroupText small>Text</InputGroupText>
                <Input
                    label="Input small"
                    small
                    invalid
                    validationMessage="Validation error"
                />
                <Button color="blue" small>Action</Button>
            </InputGroup>
            <InputGroup className="with-input-label mb-4">
                <Input
                    label="In group With Loooooooooooooooooooooooooooooooooooooooooooooooooooong label"
                    value="Value"
                />
                <InputGroupText className="px-3">
                    <Icon
                        path={mdiTranslate}
                        color="muted"
                    />
                </InputGroupText>
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input 1"
                    grouped="first"
                />
                <Input
                    label="Input 2"
                    grouped="center"
                />
                <Input
                    label="Input 3"
                    grouped="last"
                />
            </InputGroup>
            <InputGroup>
                <Input
                    label="Input 1"
                    grouped="first"
                />
                <Input
                    label="Input 2"
                    grouped="center"
                    invalid
                    validationMessage="Validation error"
                />
                <Input
                    label="Input 3"
                    grouped="last"
                />
            </InputGroup>

            <SectionDivider label="Inline form"/>

            <div className="form-inline mb-4">
                <Input
                    label="Inline form"
                    wrapperClass="m-0"
                />
                <Button color="blue">Action</Button>
            </div>
            <div className="form-inline mb-4">
                <Input
                    label="Inline form"
                    wrapperClass="m-0"
                    invalid
                    validationMessage="Validation error"
                />
                <Button color="blue">Action</Button>
            </div>
            <div className="form-inline mb-4">
                <Input
                    label="Inline form sm"
                    small
                    wrapperClass="m-0"
                />
                <Button color="blue" small>Action</Button>
            </div>

            <div className="form-inline mb-4">
                <Input
                    label="Inline form sm"
                    small
                    wrapperClass="m-0"
                    invalid
                    validationMessage="Validation error"
                />
                <Button color="blue" small>Action</Button>
            </div>

            <SectionDivider label="Input with info block"/>

            <Input
                label="Input with info"
                value="Value"
            />
            <InputInfo>
                Additional information
            </InputInfo>

            <Input
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
