import React from 'react'
import Card from 'swayok-react-mdb-ui-kit/components/Card/Card'
import CardBody from 'swayok-react-mdb-ui-kit/components/Card/CardBody'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import TabSheet from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheet'
import TabSheetBody from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetBody'
import TabSheetHeader from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetHeader'
import TabSheetTabButton from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabButton'
import TabSheetTabContent from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabContent'
import ButtonsDemo from 'swayok-react-mdb-ui-kit/demo/groups/ButtonsDemo'
import CheckboxesAndRadiosDemo from 'swayok-react-mdb-ui-kit/demo/groups/CheckboxesAndRadiosDemo'
import MdbTextAreaInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/MdbTextAreaInputsDemo'
import MdbTextInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/MdbTextInputsDemo'
import SelectInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/SelectInputsDemo'
import SimpleTextAreaInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/SimpleTextAreaInputsDemo'
import SimpleTextInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/SimpleTextInputsDemo'
import SwitchesDemo from 'swayok-react-mdb-ui-kit/demo/groups/SwitchesDemo'

// Демонстрация полей ввода.
export default function InputsDemo() {

    return (
        <div className="container">
            <h2 className="text-center text-theme mb-4">Inputs</h2>

            <TabSheet
                defaultTab="checkboxes"
                tag="div"
                savesStateToUrlQuery
            >
                <TabSheetHeader>
                    <TabSheetTabButton name="checkboxes">
                        Checkbox & Radio
                    </TabSheetTabButton>
                    <TabSheetTabButton name="switches">
                        Switch
                    </TabSheetTabButton>
                    <TabSheetTabButton name="text">
                        Text
                    </TabSheetTabButton>
                    <TabSheetTabButton name="text-area">
                        Text Area
                    </TabSheetTabButton>
                    <TabSheetTabButton name="buttons">
                        Buttons
                    </TabSheetTabButton>
                    <TabSheetTabButton name="selects">
                        Selects
                    </TabSheetTabButton>
                </TabSheetHeader>
                <TabSheetBody>
                    <TabContent name="checkboxes">
                        <SectionDivider label="Checkbox & Radio (normal size)"/>
                        <CheckboxesAndRadiosDemo/>

                        <SectionDivider label="Checkbox & Radio (small size)"/>
                        <CheckboxesAndRadiosDemo small/>
                    </TabContent>
                    <TabContent name="switches">
                        <SwitchesDemo/>
                    </TabContent>
                    <TabContent name="text">
                        <SectionDivider label="Text inputs (simple)"/>
                        <SimpleTextInputsDemo/>
                        <SectionDivider label="Text inputs (material design)"/>
                        <MdbTextInputsDemo/>
                    </TabContent>
                    <TabContent name="text-area">
                        <SectionDivider label="Text areas (simple)"/>
                        <SimpleTextAreaInputsDemo/>
                        <SectionDivider label="Text areas (material design)"/>
                        <MdbTextAreaInputsDemo/>
                    </TabContent>
                    <TabContent name="buttons">
                        <ButtonsDemo/>
                    </TabContent>
                    <TabContent name="selects">
                        <SelectInputsDemo/>
                    </TabContent>
                </TabSheetBody>
            </TabSheet>
        </div>
    )
}

function TabContent(
    props: {
        name: string,
        children: React.ReactNode | React.ReactNode[]
    }
) {
    return (
        <TabSheetTabContent
            name={props.name}
            lazy
        >
            <div className="row">
                <div className="col-6">
                    <Card>
                        <CardBody>
                            {props.children}
                        </CardBody>
                    </Card>
                </div>
                <div className="col-6 pt-4">
                    {props.children}
                </div>
            </div>
        </TabSheetTabContent>
    )
}
