import React, {useEffect, useState} from 'react'
import clsx from 'clsx'
import {TabSheetTabContentProps} from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTypes'
import {useTabSheetContext} from './TabSheetContext'

// Длительность анимаций fade in/out.
const animationDuration: number = 150

// Содержимое вкладки.
function TabSheetTabContent<
    TabName extends string = string
>(props: TabSheetTabContentProps<TabName>) {

    const {
        name,
        className,
        children,
        lazy,
        ErrorBoundary,
        ...otherProps
    } = props

    const {
        currentTab,
    } = useTabSheetContext<TabName>()

    // Является ли эта вкладка открытой?
    const [
        isCurrent,
        setIsCurrent,
    ] = useState<boolean>(currentTab === name)
    // Состояние видимости компонента (display: block/hidden).
    const [
        isVisible,
        setIsVisible,
    ] = useState<boolean>(isCurrent)

    // Обработка смены вкладки.
    useEffect(() => {
        const isActive: boolean = name === currentTab
        if (isCurrent && isActive) {
            // Ничего не изменилось.
            return
        }
        if (isActive) {
            // Отложить изменение видимости (display: block/hidden)
            // чтобы анимация fade out предыдущего компонента успела отработать.
            setTimeout(() => {
                setIsVisible(true)
            }, animationDuration)
            // Запускаем анимацию fade in чуть позже чем смену видимости,
            // чтобы анимация не была отменена невидимостью компонента.
            setTimeout(() => {
                setIsCurrent(true)
            }, animationDuration + 10)
        } else {
            setIsCurrent(false)
            // Отложить изменение видимости (display: block/hidden),
            // чтобы анимация fade out этого компонента успела отработать.
            setTimeout(() => {
                setIsVisible(false)
            }, animationDuration)
        }
    }, [currentTab, name])

    // Нужно ли монтировать таблицу со списком объявлений продавца?
    const [
        shouldMountContents,
        setShouldMountContents,
    ] = useState<boolean>(!props.lazy)

    // Обработка смены текущей вкладки.
    useEffect(() => {
        if (!shouldMountContents && lazy && currentTab === name) {
            // Отложенное монтирование таблицы объявлений требуется,
            // чтобы запрос на список объявлений отправлялся только при первом
            // открытии этой вкладки, а не сразу же при монтировании страницы.
            setShouldMountContents(true)
        }
    }, [currentTab, shouldMountContents, lazy, name])

    let content = ErrorBoundary
        ? (
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        )
        : children

    return (
        <div
            className={clsx(
                'tab-pane fade',
                className,
                // Запуск анимации сразу же.
                isCurrent ? 'show' : null,
                // Смена видимости вкладки (с задержкой).
                isVisible ? 'active' : null
            )}
            role="tabpanel"
            {...otherProps}
        >
            {shouldMountContents ? content : null}
        </div>
    )
}

export default React.memo(TabSheetTabContent) as typeof TabSheetTabContent
