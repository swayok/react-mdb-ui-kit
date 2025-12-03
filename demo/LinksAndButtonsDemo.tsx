import React from 'react'
import {TabSheet} from '../components/TabSheet/TabSheet'
import {TabSheetBody} from '../components/TabSheet/TabSheetBody'
import {TabSheetHeader} from '../components/TabSheet/TabSheetHeader'
import {TabSheetTabButton} from '../components/TabSheet/TabSheetTabButton'
import {ButtonsDemo} from './groups/ButtonsDemo'
import {IconButtonsDemo} from './groups/IconButtonsDemo'
import {LinksDemo} from './groups/LinksDemo'
import {TabContentForDemoTabsheet} from './TabContentForDemoTabsheet'

// Демонстрация ссылок и кнопок.
export function LinksAndButtonsDemo() {

    return (
        <TabSheet
            defaultTab="links"
            tag="div"
            savesStateToUrlQuery
            urlQueryArgName="typography"
        >
            <TabSheetHeader>
                <TabSheetTabButton name="links">
                    Links
                </TabSheetTabButton>
                <TabSheetTabButton name="icon-buttons">
                    Icon Buttons
                </TabSheetTabButton>
                <TabSheetTabButton name="buttons">
                    Buttons
                </TabSheetTabButton>
            </TabSheetHeader>
            <TabSheetBody>
                <TabContentForDemoTabsheet name="links">
                    <LinksDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="icon-buttons">
                    <IconButtonsDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="buttons">
                    <ButtonsDemo />
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
