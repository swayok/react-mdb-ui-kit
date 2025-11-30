import React from 'react'
import {SectionDivider} from '../components/SectionDivider'
import TabSheet from '../components/TabSheet/TabSheet'
import TabSheetBody from '../components/TabSheet/TabSheetBody'
import TabSheetHeader from '../components/TabSheet/TabSheetHeader'
import TabSheetTabButton from '../components/TabSheet/TabSheetTabButton'
import {ButtonsSwitchDemo} from './groups/ButtonsSwitchDemo'
import {CheckboxesAndRadiosDemo} from './groups/CheckboxesAndRadiosDemo'
import {DateInputsDemo} from './groups/DateInputsDemo'
import {FilePickersDemo} from './groups/FilePickersDemo'
import {FormInlineDemo} from './groups/FormInlineDemo'
import {HtmlEditorsDemo} from './groups/HtmlEditorsDemo'
import {MdbTextAreaInputsDemo} from './groups/MdbTextAreaInputsDemo'
import {MdbTextInputsDemo} from './groups/MdbTextInputsDemo'
import {SelectInputsDemo} from './groups/SelectInputsDemo'
import {SimpleTextAreaInputsDemo} from './groups/SimpleTextAreaInputsDemo'
import {SimpleTextInputsDemo} from './groups/SimpleTextInputsDemo'
import {SwitchesDemo} from './groups/SwitchesDemo'
import {TabContentForDemoTabsheet} from './TabContentForDemoTabsheet'

// Демонстрация полей ввода.
export function InputsDemo() {

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
                <TabSheetTabButton name="form-inline">
                    Form Inline
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
                <TabContentForDemoTabsheet name="form-inline">
                    <FormInlineDemo/>
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
