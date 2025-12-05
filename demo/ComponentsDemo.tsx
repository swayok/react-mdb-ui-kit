import {TabSheet} from '../components/TabSheet/TabSheet'
import {TabSheetBody} from '../components/TabSheet/TabSheetBody'
import {TabSheetHeader} from '../components/TabSheet/TabSheetHeader'
import {TabSheetTabButton} from '../components/TabSheet/TabSheetTabButton'
import {BadgesDemo} from './groups/BadgesDemo'
import {DataGridDemo} from './groups/DataGridDemo'
import {ImagesPreviewDemo} from './groups/ImagesPreviewDemo'
import {RatingStarsDemo} from './groups/RatingStarsDemo'
import {TablesDemo} from './groups/TablesDemo'
import {ToastsDemo} from './groups/ToastsDemo'
import {TabContentForDemoTabsheet} from './TabContentForDemoTabsheet'

// Демонстрация компонентов.
export function ComponentsDemo() {

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
                <TabSheetTabButton name="toast">
                    Toasts
                </TabSheetTabButton>
                <TabSheetTabButton name="badges">
                    Badges
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
                    <RatingStarsDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet
                    name="toast"
                    single
                >
                    <ToastsDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="badges">
                    <BadgesDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="images-previewer">
                    <ImagesPreviewDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="tables">
                    <TablesDemo />
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet name="data-grid">
                    <DataGridDemo />
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
