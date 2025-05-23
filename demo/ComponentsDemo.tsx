import React from 'react'
import TabSheet from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheet'
import TabSheetBody from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetBody'
import TabSheetHeader from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetHeader'
import TabSheetTabButton from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabButton'
import {DataGridDemo} from 'swayok-react-mdb-ui-kit/demo/groups/DataGridDemo'
import ImagesPreviewDemo from 'swayok-react-mdb-ui-kit/demo/groups/ImagesPreviewDemo'
import RatingStarsDemo from 'swayok-react-mdb-ui-kit/demo/groups/RatingStarsDemo'
import {TablesDemo} from 'swayok-react-mdb-ui-kit/demo/groups/TablesDemo'
import TabContentForDemoTabsheet from 'swayok-react-mdb-ui-kit/demo/TabContentForDemoTabsheet'

// Демонстрация компонентов.
export default function ComponentsDemo() {

    return (
        <TabSheet
            defaultTab="rating-stars"
            tag="div"
            savesStateToUrlQuery
            urlQueryArgName="components"
        >
            <TabSheetHeader>
                <TabSheetTabButton name="rating-stars">
                    Rating Stars
                </TabSheetTabButton>
                <TabSheetTabButton name="images-previewer">
                    Images Previewer
                </TabSheetTabButton>
                <TabSheetTabButton name="tables">
                    Tables
                </TabSheetTabButton>
                <TabSheetTabButton name="data-grid">
                    Data Grid
                </TabSheetTabButton>
            </TabSheetHeader>
            <TabSheetBody>
                <TabContentForDemoTabsheet name="rating-stars">
                    <RatingStarsDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="images-previewer">
                    <ImagesPreviewDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="tables">
                    <TablesDemo/>
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="data-grid">
                    <DataGridDemo/>
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
