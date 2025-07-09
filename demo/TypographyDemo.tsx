import React from 'react'
import TabSheet from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheet'
import TabSheetBody from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetBody'
import TabSheetHeader from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetHeader'
import TabSheetTabButton from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabButton'
import {HeadingsDemo} from 'swayok-react-mdb-ui-kit/demo/groups/HeadingsDemo'
import TabContentForDemoTabsheet from 'swayok-react-mdb-ui-kit/demo/TabContentForDemoTabsheet'

// Демонстрация компонентов.
export default function TypographyDemo() {

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
