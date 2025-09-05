import React, {useEffect, useState} from 'react'
import {TabSheetProps} from '../../types/TabSheet'
import Card from '../Card/Card'
import TabSheetContext from './TabSheetContext'
import TabSheetStateToUrlQueryHandler from './TabSheetStateToUrlQueryHandler'
import {useUrlQueryParams} from '../../helpers/useUrlQueryParams'

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
        tag: Tag = Card,
        defaultTab,
        savesStateToUrlQuery,
        urlQueryArgName = 'tab',
        onTabChange,
        children,
        ...otherProps
    } = props

    // Аргументы в сроке адреса.
    const [urlQueryParams] = useUrlQueryParams()

    // Открытая вкладка.
    const [currentTab, setCurrentTab] = useState<TabName>(() => {
        if (savesStateToUrlQuery && urlQueryParams.has(urlQueryArgName)) {
            // Достаем текущую вкладку из URL Query.
            return urlQueryParams.get(urlQueryArgName) as TabName
        }
        return defaultTab
    })

    // Вызов обработчика изменения вкладки.
    useEffect(() => {
        onTabChange?.(currentTab)
    }, [currentTab])

    // Контекст.
    const Context  = TabSheetContext<TabName>()

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
                    <TabSheetStateToUrlQueryHandler name={urlQueryArgName}/>
                )}
                {children}
            </Context.Provider>
        </Tag>
    )
}

export default React.memo(TabSheet) as typeof TabSheet
