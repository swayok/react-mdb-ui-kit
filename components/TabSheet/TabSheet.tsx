import React, {useState} from 'react'
import {TabSheetProps} from '../../types/TabSheet'
import Card from '../Card/Card'
import TabSheetContext from './TabSheetContext'
import TabSheetStateToUrlQueryHandler from './TabSheetStateToUrlQueryHandler'
import useUrlQueryParams from '../../helpers/useUrlQueryParams'

// Обертка вкладок и их содержимого.
// Обычная структура:
// <TabSheet>
//  <TabSheetTabs>
//      <TabSheetTab/>
//      ...
//  </TabSheetTabs>
//  <TabSheetBody>
//      <TabSheetTabContent>...</TabSheetTabContent>
//      ...
//  </TabSheetBody>
// </TabSheet>
function TabSheet<TabName extends string = string>(
    props: TabSheetProps<TabName>
) {

    const {
        tag,
        defaultTab,
        savesStateToUrlQuery,
        urlQueryArgName,
        children,
        ...otherProps
    } = props

    const argName: string = urlQueryArgName || 'tab'

    // Аргументы в сроке адреса.
    const [urlQueryParams] = useUrlQueryParams()

    // Открытая вкладка.
    const [currentTab, setCurrentTab] = useState<TabName>(() => {
        if (savesStateToUrlQuery && urlQueryParams.has(argName)) {
            // Достаем текущую вкладку из URL Query.
            return urlQueryParams.get(argName) as TabName
        }
        return defaultTab
    })

    // Контекст.
    const Context  = TabSheetContext<TabName>()

    const Tag = tag || Card

    return (
        <Tag {...otherProps}>
            <Context.Provider
                value={{
                    defaultTab,
                    currentTab,
                    setCurrentTab,
                }}
            >
                {savesStateToUrlQuery && (
                    <TabSheetStateToUrlQueryHandler name={argName}/>
                )}
                {children}
            </Context.Provider>
        </Tag>
    )
}

export default React.memo(TabSheet) as typeof TabSheet
