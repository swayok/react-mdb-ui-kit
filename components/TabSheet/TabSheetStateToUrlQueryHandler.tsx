import React, {useEffect, useMemo} from 'react'
import {TabSheetStateToUrlQueryHandlerProps} from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTypes'
import {useTabSheetContext} from './TabSheetContext'
import {useUrlQueryParams} from '../../helpers/useUrlQueryParams'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'

// Контроль сохранения и восстановления текущей вкладки из URL Query.
function TabSheetStateToUrlQueryHandler(props: TabSheetStateToUrlQueryHandlerProps) {

    const {
        defaultTab,
        currentTab,
        setCurrentTab,
    } = useTabSheetContext()

    // Стартовые параметры для URL Query.
    const defaultQueryArgs: AnyObject<string> = useMemo(() => {
        const queryArgs: AnyObject<string> = {}
        queryArgs[props.name] = defaultTab
        return queryArgs
    }, [defaultTab])

    // Аргументы в сроке адреса.
    const [urlQueryParams, setUrlQueryParams] = useUrlQueryParams(defaultQueryArgs)

    // Запоминание текущей вкладки в строке адреса.
    useEffect(() => {
        if (urlQueryParams.get(props.name) !== currentTab) {
            urlQueryParams.set(props.name, currentTab)
            setUrlQueryParams(urlQueryParams)
        }
    }, [currentTab])

    // Смена вкладки при изменении аргумента в строке адреса.
    useEffect(() => {
        const newTab = urlQueryParams.get(props.name) ?? defaultTab
        if (newTab !== currentTab) {
            setCurrentTab(newTab)
        }
    }, [urlQueryParams.get(props.name)])

    return null
}

export default React.memo(TabSheetStateToUrlQueryHandler)
