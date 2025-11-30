import React from 'react'
import TabSheet from '../components/TabSheet/TabSheet'
import TabSheetBody from '../components/TabSheet/TabSheetBody'
import TabSheetHeader from '../components/TabSheet/TabSheetHeader'
import TabSheetTabButton from '../components/TabSheet/TabSheetTabButton'
import {HeadingsDemo} from './groups/HeadingsDemo'
import {TabContentForDemoTabsheet} from './TabContentForDemoTabsheet'

// Демонстрация компонентов.
export function TypographyDemo() {

    return (
        <TabSheet
            defaultTab="headings"
            tag="div"
            savesStateToUrlQuery
            urlQueryArgName="typography"
        >
            <TabSheetHeader>
                <TabSheetTabButton name="headings">
                    Headings
                </TabSheetTabButton>
            </TabSheetHeader>
            <TabSheetBody>
                <TabContentForDemoTabsheet name="headings">
                    <HeadingsDemo/>
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
