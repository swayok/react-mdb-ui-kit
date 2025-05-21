import React from 'react'
import TabSheet from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheet'
import TabSheetBody from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetBody'
import TabSheetHeader from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetHeader'
import TabSheetTabButton from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabButton'
import ButtonsDemo from 'swayok-react-mdb-ui-kit/demo/groups/ButtonsDemo'
import IconButtonsDemo from 'swayok-react-mdb-ui-kit/demo/groups/IconButtonsDemo'
import LinksDemo from 'swayok-react-mdb-ui-kit/demo/groups/LinksDemo'
import TabContentForDemoTabsheet from 'swayok-react-mdb-ui-kit/demo/TabContentForDemoTabsheet'

// Демонстрация типографии.
export default function LinksAndButtonsDemo() {

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
                    <LinksDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="icon-buttons">
                    <IconButtonsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="buttons">
                    <ButtonsDemo/>
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
