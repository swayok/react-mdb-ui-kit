import React from 'react'
import SectionDivider from 'swayok-react-mdb-ui-kit/components/SectionDivider'
import TabSheet from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheet'
import TabSheetBody from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetBody'
import TabSheetHeader from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetHeader'
import TabSheetTabButton from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabButton'
import ButtonsSwitchDemo from 'swayok-react-mdb-ui-kit/demo/groups/ButtonsSwitchDemo'
import CheckboxesAndRadiosDemo from 'swayok-react-mdb-ui-kit/demo/groups/CheckboxesAndRadiosDemo'
import DateInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/DateInputsDemo'
import FilePickersDemo from 'swayok-react-mdb-ui-kit/demo/groups/FilePickersDemo'
import HtmlEditorsDemo from 'swayok-react-mdb-ui-kit/demo/groups/HtmlEditorsDemo'
import MdbTextAreaInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/MdbTextAreaInputsDemo'
import MdbTextInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/MdbTextInputsDemo'
import SelectInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/SelectInputsDemo'
import SimpleTextAreaInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/SimpleTextAreaInputsDemo'
import SimpleTextInputsDemo from 'swayok-react-mdb-ui-kit/demo/groups/SimpleTextInputsDemo'
import SwitchesDemo from 'swayok-react-mdb-ui-kit/demo/groups/SwitchesDemo'
import TabContentForDemoTabsheet from 'swayok-react-mdb-ui-kit/demo/TabContentForDemoTabsheet'

// Демонстрация полей ввода.
export default function InputsDemo() {

    return (
        <TabSheet
            defaultTab="checkboxes"
            tag="div"
            savesStateToUrlQuery
            urlQueryArgName="inputs"
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
                <TabSheetTabButton name="buttons-switch">
                    Buttons Switch
                </TabSheetTabButton>
                <TabSheetTabButton name="selects">
                    Selects
                </TabSheetTabButton>
                <TabSheetTabButton name="date-inputs">
                    Date Inputs
                </TabSheetTabButton>
                <TabSheetTabButton name="html-editors">
                    HTML Editors
                </TabSheetTabButton>
                <TabSheetTabButton name="file-pickers">
                    File Pickers
                </TabSheetTabButton>
            </TabSheetHeader>
            <TabSheetBody>
                <TabContentForDemoTabsheet name="checkboxes">
                    <SectionDivider label="Checkbox & Radio (normal size)"/>
                    <CheckboxesAndRadiosDemo/>

                    <SectionDivider label="Checkbox & Radio (small size)"/>
                    <CheckboxesAndRadiosDemo small/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="switches">
                    <SwitchesDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="text">
                    <SectionDivider label="Text inputs (simple)"/>
                    <SimpleTextInputsDemo/>
                    <SectionDivider label="Text inputs (material design)"/>
                    <MdbTextInputsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="text-area">
                    <SectionDivider label="Text areas (simple)"/>
                    <SimpleTextAreaInputsDemo/>
                    <SectionDivider label="Text areas (material design)"/>
                    <MdbTextAreaInputsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="buttons-switch">
                    <ButtonsSwitchDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="selects">
                    <SelectInputsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="date-inputs">
                    <DateInputsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="html-editors">
                    <HtmlEditorsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="file-pickers">
                    <FilePickersDemo/>
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
